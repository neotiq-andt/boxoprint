"use strict";
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const glob = require("glob");
const fs = require("fs");

const loader = require("./loader");
const session = { role: "admin" };
module.exports.init = function (app, acl, db) {
  let templates = {};

  function updateTemplates(callback) {
    db.getTemplates(function (currentTemplates) {
      glob(__dirname + "/templates/*.json", null, function (er, files) {
        templates = {};
        if (files && files.length) {
          for (let i = 0; i != files.length; i++) {
            let conf = JSON.parse(fs.readFileSync(files[i], "utf8"));
            if (conf && conf.name) {
              db.setTemplate(conf.name, files[i], function () {});
              templates[conf.name] = conf;
              for (let i2 = 0; i2 != currentTemplates.length; i2++) {
                if (currentTemplates[i2].name == conf.name) {
                  currentTemplates.splice(i2, 1);
                  break;
                }
              }
            }
          }
          for (let u = 0; u != currentTemplates.length; u++)
            db.deleteTemplate(currentTemplates[u].name, function () {});
        }
        callback(templates);
      });
    });
  }

  //
  // RESOURCES
  //
  // get all resources
  app.get("/api/1.0/resources", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    acl.checkBearer({}, req, res, next, function (req, res, next, session) {
      db.getResources(session, function (ret, status) {
        res.status(status);
        res.json(ret);
      });
    });
  });

  // get one resource
  app.get("/api/1.0/resource", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    acl.checkBearer({}, req, res, next, function (req, res, next, session) {
      if (
        req.query.resource_id == null ||
        parseInt(req.query.resource_id) <= 0
      ) {
        res.status(400);
        res.json({ status: "error", log: "bad params" });
        return;
      }
      db.getResource(
        session,
        parseInt(req.query.resource_id),
        function (ret, status) {
          if (status == 200 && ret) {
            res.writeHead(200, { "Content-Type": "application/octet-stream" });
            res.write(ret);
            res.end();
          } else res.status(status);
        }
      );
    });
  });

  // create/update one resource
  app.post("/api/1.0/resource", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    acl.checkBearer({}, req, res, next, function (req, res, next, session) {
      if (req.query.type == null || req.body == null) {
        res.status(400);
        res.json({ status: "error", log: "bad params" });
        return;
      }
      let resource_id = null;
      let owner_id = null;
      if (req.query.resource_id && parseInt(req.query.resource_id) > 0)
        resource_id = parseInt(req.query.resource_id);
      if (
        session.role == "admin" &&
        req.query.owner_id &&
        parseInt(req.query.owner_id) > 0
      )
        owner_id = parseInt(req.query.owner_id);
      db.setResource(
        session,
        resource_id,
        owner_id,
        req.query.type,
        req.body,
        function (ret, status) {
          res.status(status);
          res.json(ret);
        }
      );
    });
  });

  // delete one resource
  app.delete("/api/1.0/resource", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    acl.checkBearer({}, req, res, next, function (req, res, next, session) {
      if (
        req.query.resource_id == null ||
        parseInt(req.query.resource_id) <= 0
      ) {
        res.status(400);
        res.json({ status: "error", log: "bad params" });
        return;
      }
      db.deleteResource(
        session,
        parseInt(req.query.resource_id),
        function (ret, status) {
          res.status(status);
          res.json(ret);
        }
      );
    });
  });

  //
  // WORKSPACES
  //
  // get all workspaces
  app.get("/api/1.0/workspaces", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    // acl.checkBearer({}, req, res, next, function(req, res, next, session) {
    db.getWorkSpaces(session, function (ret, status) {
      res.status(status);
      res.json(ret);
    });
    // });
  });

  // get one workspaces
  app.get("/api/1.0/workspace", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    // acl.checkBearer({}, req, res, next, function(req, res, next, session) {
    if (
      req.query.workspace_id == null ||
      parseInt(req.query.workspace_id) <= 0
    ) {
      res.status(400);
      res.json({ status: "error", log: "bad params" });
      return;
    }
    const customer_email = req.query.customer_email || "";
    db.getWorkSpace(
      session,
      { workspace_id: parseInt(req.query.workspace_id), customer_email },
      function (ret, status) {
        res.status(status);
        res.json(ret);
      }
    );
    // });
  });

  // update one workspace
  app.put("/api/1.0/workspace", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    // acl.checkBearer({}, req, res, next, function(req, res, next, session) {
    if (
      req.query.workspace_id == null ||
      parseInt(req.query.workspace_id) <= 0
    ) {
      res.status(400);
      res.json({ status: "error", log: "bad params" });
      return;
    }
    let workspace_id = parseInt(req.query.workspace_id);
    let owner_id = null;
    let label = null;
    let config = null;
    let base = null;
    let name_project = null;
    if (
      session.role == "admin" &&
      req.query.owner_id &&
      parseInt(req.query.owner_id) > 0
    )
      owner_id = parseInt(req.query.owner_id);
    if (req.query.label) label = req.query.label;
    if (req.body) {
      config = req.body.config;
      base = req.body.base;
      name_project = req.body.name_project;
    }
    if (config.version == null) config = null;
    if (label == null && owner_id == null && config == null) {
      res.status(400);
      res.json({ status: "error", log: "bad params" });
      return;
    }
    db.updateWorkSpace(
      session,
      workspace_id,
      owner_id,
      label,
      config,
      base,
      name_project,
      function (ret, status) {
        res.status(status);
        res.json(ret);
      }
    );
    // });
  });

  // create one workspace
  app.post("/api/1.0/workspace", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    // acl.checkBearer({}, req, res, next, function(req, res, next, session) {
    if (
      req.body.template_name == null ||
      req.body.label == null ||
      req.body.base == null ||
      req.body.config == null ||
      req.body.name_project == null
    ) {
      res.status(400);
      res.json({ status: "error", log: "bad params" });
      return;
    }
    let template_id = null;
    db.getTemplate(req.body.template_name, function (ret, status) {
      if (ret && ret.template_id) {
        template_id = ret.template_id;
        db.createWorkSpace(
          template_id,
          req.body.label,
          req.body.name_project,
          req.body.type_defined,
          req.body.date,
          req.body.base,
          req.body.config,
          function (ret, status) {
            res.status(status);
            res.json(ret);
          }
        );
      } else {
        res.status(400);
        res.json({ status: "error", log: "bad params" });
        return;
      }
    });
    // });
  });
  // create one workspace available
  app.post("/api/1.0/workspace_available", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    // acl.checkBearer({}, req, res, next, function(req, res, next, session) {
    if (
      req.body.label == null ||
      req.body.base == null ||
      req.body.config == null
    ) {
      res.status(400);
      res.json({ status: "error", log: "bad params" });
      return;
    }
    console.log('req.body.productId', req.body.productId);
    db.createWorkSpaceAvailable(
      req.body.label,
      req.body.base,
      req.body.type_defined,
      req.body.name_project,
      req.body.owner_id,
      req.body.template_id,
      req.body.date,
      req.body.template_parent_id,
      req.body.customer_email,
      req.body.workspace_price,
      req.body.imageBase64,
      req.body.workspace_svg,
      req.body.form_key,
      req.body.product_id,
      req.body.config,
      function (ret, status) {
        res.status(status);
        res.json(ret);
      }
    );
    // });
  });

  // create one workspace available
  app.post("/api/1.0/workspace_upload", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    // acl.checkBearer({}, req, res, next, function(req, res, next, session) {
    if (req.body.imageBase64 == null) {
      res.status(400);
      res.json({ status: "error", log: "bad params" });
      return;
    }
    const base64Data = req.body.imageBase64.replace(
      /^data:image\/png;base64,/,
      ""
    );
    const nameFile = req.body.nameFile;
    fs.writeFile(nameFile, base64Data, { encoding: "base64" }, function (err) {
      console.log("File created");
    });
  });

  // delete one workspace
  app.delete("/api/1.0/workspace", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    // acl.checkBearer({}, req, res, next, function(req, res, next, session) {
    if (
      req.query.workspace_id == null ||
      parseInt(req.query.workspace_id) <= 0
    ) {
      res.status(400);
      res.json({ status: "error", log: "bad params" });
      return;
    }
    db.deleteWorkSpace(
      session,
      parseInt(req.query.workspace_id),
      function (ret, status) {
        res.status(status);
        res.json(ret);
      }
    );
    // });
  });

  //
  // TEMPLATES
  //
  // get all templates
  app.get("/api/1.0/templates", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    // acl.checkBearer({}, req, res, next, function(req, res, next, session) {
    updateTemplates(function (ret) {
      res.status(200);
      res.json(ret);
    });
    // });
  });

  // load one template
  app.get("/api/1.0/template/svg", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    // acl.checkBearer({}, req, res, next, function(req, res, next, session) {
    if (req.query.name == null) {
      res.status(400);
      res.json({ status: "error", log: "bad params" });
      return;
    }
    let args = [];
    if (req.query.length && req.query.width && req.query.height) {
      args.push(0); //x
      args.push(0); //y
      args.push(parseInt(req.query.length));
      args.push(parseInt(req.query.width));
      args.push(parseInt(req.query.height));
    }
    let conf = templates[req.query.name];
    if (conf == null) {
      res.status(404);
      res.json({ status: "error", log: "not found" });
      return;
    }
    loader.loadTemplate(conf, args, function (ret) {
      if (ret == null) {
        res.status(500);
        res.json({ status: "error" });
        return;
      }
      res.writeHead(200, { "Content-Type": "image/svg+xml" });
      res.write(ret);
      res.end();
    });
    // });
  });

  updateTemplates(function () {});
  return this;
};
