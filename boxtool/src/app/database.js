var mysql = require("mysql");

module.exports.Db = function(mysqlConf) {
  let pool = mysql.createPool(mysqlConf);

  this.getResources = function(session, callback) {
    pool.getConnection(function(err, connection) {
      let sql;
      if (session.role == "admin")
        sql = "SELECT resource_id, owner_id, type FROM resources";
      else
        sql =
          "SELECT resource_id, owner_id, type FROM resources WHERE owner_id=" +
          session.user_id;
      connection.query(sql, (error, results, fields) => {
        connection.release();
        if (error) {
          callback([], 400);
          console.log("db error sql : ", error);
          return;
        }
        callback(results, 200);
      });
    });
  };

  this.getResource = function(session, resource_id, callback) {
    pool.getConnection(function(err, connection) {
      let sql;
      if (session.role == "admin")
        sql = "SELECT data FROM resources WHERE resource_id=" + resource_id;
      else
        sql =
          "SELECT data FROM resources WHERE resource_id=" +
          resource_id +
          " AND owner_id=" +
          session.user_id;
      connection.query(sql, (error, results, fields) => {
        connection.release();
        if (error) {
          callback(null, 400);
          console.log("db error sql : ", error);
          return;
        }
        if (results.length) callback(results[0], 200);
        else callback(null, 200);
      });
    });
  };

  this.deleteResource = function(session, resource_id, callback) {
    pool.getConnection(function(err, connection) {
      let sql;
      if (session.role == "admin")
        sql = "DELETE FROM resources WHERE resource_id=" + resource_id;
      else
        sql =
          "DELETE FROM resources WHERE owner_id=" +
          session.user_id +
          " AND resource_id=" +
          resource_id;
      connection.query(sql, (error, results, fields) => {
        connection.release();
        if (error) {
          callback({ status: "error" }, 400);
          console.log("db error sql : ", error);
          return;
        }
        callback({ status: "ok" }, 200);
      });
    });
  };

  this.setResource = function(
    session,
    resource_id,
    owner_id,
    type,
    data,
    callback
  ) {
    pool.getConnection(function(err, connection) {
      let inserts;

      if (owner_id == null) owner_id = session.user_id;
      if (resource_id != null) {
        sql =
          "UPDATE resources SET owner_id=?, type=?, data=? WHERE resource_id=" +
          resource_id;
        if (session.role != "admin") sql += " AND owner_id=" + session.user_id;
      } else sql = "INSERT INTO resources (owner_id, type, data) VALUES(?, ?, ?)";
      sql = mysql.format(sql, [owner_id, type, data]);
      connection.query(sql, (error, results, fields) => {
        connection.release();
        if (error) {
          callback({ status: "error" }, 400);
          console.log("db error sql : ", error);
          return;
        }
        if (results.insertId)
          callback({ status: "ok", resource_id: results.insertId }, 201);
        else callback({ status: "ok" }, 200);
      });
    });
  };

  this.getWorkSpaces = function(session, callback) {
    pool.getConnection(function(err, connection) {
      let sql;
      if (session.role == "admin") sql = "SELECT workspace_id, template_id, owner_id, label, base FROM boxoprint_workspace";
      else sql = "SELECT workspace_id, template_id, owner_id, label, base FROM boxoprint_workspace WHERE owner_id=" + session.user_id;
      connection.query(sql, (error, results, fields) => {
        connection.release();
        if (error) {
          callback([], 400);
          console.log("db error sql : ", error);
          return;
        }
        callback(results, 200);
      });
    });
  };

  this.getWorkSpace = function(session, {workspace_id, customer_email, template_parent_id}, callback) {
    pool.getConnection(function(err, connection) {
        let sql, sql2
        if (session.role == "admin"){
            sql = "SELECT * FROM boxoprint_workspace WHERE workspace_id=" + workspace_id
        }
        else{
            sql = "SELECT * FROM boxoprint_workspace WHERE workspace_id=" + workspace_id + " AND owner_id=" + session.user_id
        }
        connection.query(sql, (error, results, fields) => {
            connection.release();
            if (error) {
                callback({ status: "error" }, 400)
                console.log("db error sql : ", error)
                return;
            }
            if (results.length){
                 let result = results[0]
                 if( customer_email ){
                   template_parent_id = result.template_parent_id? result.template_parent_id: result.workspace_id
                   connection.query("SELECT workspace_id, name_project, customer_email FROM boxoprint_workspace WHERE template_parent_id=" + template_parent_id + " AND customer_email=" +"'"+ customer_email+"'", function(err, res2) {
                     if (err) {
                         callback({ status: "error" }, 400)
                         return
                     }
                     result = {...result,customer_email_list: res2}
                     callback(result, 200)
                   })
                 }else{
                    callback({...result,customer_email_list: []}, 200)
                 }
            }
            else{
              callback({}, 200)
            }
        })
    })
  }

  this.deleteWorkSpace = function(session, workspace_id, callback) {
    pool.getConnection(function(err, connection) {
      let sql;
      if (session.role == "admin")
        sql = "DELETE FROM boxoprint_workspace WHERE workspace_id=" + workspace_id;
      else
        sql =
          "DELETE FROM boxoprint_workspace WHERE owner_id=" +
          session.user_id +
          " AND workspace_id=" +
          workspace_id;
      connection.query(sql, (error, results, fields) => {
        connection.release();
        if (error) {
          callback({ status: "error" }, 400);
          console.log("db error sql : ", error);
          return;
        }
        callback({ status: "ok" }, 200);
      });
    });
  };

  this.createWorkSpace = function( template_id, label, name_project, type_defined, date, base, config, callback) {
    pool.getConnection(function(err, connection) {
      let owner_id = 0;
      const status = 1;
      sql = "INSERT INTO boxoprint_workspace (template_id, owner_id, label, name_project, type_defined, `date`, `status`, base, config) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
	  sql = mysql.format(sql, [template_id, owner_id, label, name_project, type_defined, date, status, JSON.stringify(base), JSON.stringify(config)]);
      connection.query(sql, (error, results, fields) => {
        connection.release();
        if (error) {
          callback({ status: "error" }, 400);
          console.log("db error sql : ", error);
          return;
        }
        if (results.insertId)
          callback({ status: "ok", workspace_id: results.insertId }, 201);
        else callback({ status: "error" }, 400);
      });
    });
  };

  this.createWorkSpaceAvailable = function( label, base, type_defined, name_project, owner_id, template_id, date, template_parent_id, customer_email, workspace_price, imageBase64, workspace_svg, form_key, product_id, config, callback) {
    const status = 1;
    console.log('db',product_id);
    pool.getConnection(function(err, connection) {
      sql = "INSERT INTO boxoprint_workspace ( label, base, type_defined, name_project, owner_id, template_id, date, template_parent_id, customer_email, workspace_price, status, image_base, workspace_svg, form_key, product_id, config) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?, ?)"
      sql = mysql.format(sql, [label, JSON.stringify(base), type_defined, name_project, owner_id, template_id, date , template_parent_id, customer_email, workspace_price, status, imageBase64, workspace_svg, form_key, product_id, JSON.stringify(config)])
      connection.query(sql, (error, results, fields) => {
        connection.release();
        if (error) {
          callback({ status: "error" }, 400);
          console.log("db error sql : ", error);
          return;
        }
        if (results.insertId)
          callback({ status: "ok", workspace_id: results.insertId }, 201);
        else callback({ status: "error" }, 400);
      });
    });
  }

  this.updateWorkSpace = function(
    session,
    workspace_id,
    owner_id,
    label,
    config,
    base,
    name_project,
    callback
  ) {
    pool.getConnection(function(err, connection) {
      let inserts;
      let first = false;
      let tab = [];

      sql = "UPDATE boxoprint_workspace SET ";
      if (owner_id != null) {
        if (first == true) sql += ", ";
        first = true;
        sql += "owner_id=?";
        tab.push(owner_id);
      }
      if (label != null) {
        if (first == true) sql += ", ";
        first = true;
        sql += "label=?";
        tab.push(label);
      }
      if (base != null) {
         if (first == true) sql += ", ";
         first = true;
         sql += "base=?";
         tab.push(JSON.stringify(base));
      }
      if (config != null) {
        if (first == true) sql += ", ";
          sql += "config=?";
          tab.push(JSON.stringify(config));
      }
      if (name_project != null) {
        if (first == true) sql += ", ";
          sql += "name_project=?";
          tab.push(name_project);
      }
      sql += " WHERE workspace_id=" + workspace_id;
      if (session.role != "admin") sql += " AND owner_id=" + session.user_id;
      sql = mysql.format(sql, tab);
      connection.query(sql, (error, results, fields) => {
        connection.release();
        if (error) {
          callback({ status: "error" }, 400);
          console.log("db error sql : ", error);
          return;
        }
        callback({ status: "ok" }, 200);
      });
    });
  };

  this.getTemplates = function(callback) {
    pool.getConnection(function(err, connection) {
      connection.query(
        "SELECT * FROM boxoprint_template WHERE status=0",
        (error, results, fields) => {
          connection.release();
          if (error) {
            callback([], 400);
            console.log("db error sql : ", error);
            return;
          }
          callback(results, 200);
        }
      );
    });
  };

  this.getTemplate = function(name, callback) {
    pool.getConnection(function(err, connection) {
      let sql = "SELECT * FROM boxoprint_template WHERE status=0 AND name=?";
      sql = mysql.format(sql, [name]);
      connection.query(sql, (error, results, fields) => {
        connection.release();
        if (error) {
          callback({}, 400);
          console.log("db error sql : ", error);
          return;
        }
        if (results.length) callback(results[0], 200);
        else callback({}, 200);
      });
    });
  };

  this.deleteTemplate = function(name, callback) {
    pool.getConnection(function(err, connection) {
      let sql = "DELETE FROM boxoprint_template WHERE name=?";
      sql = mysql.format(sql, [name]);
      connection.query(sql, (error, results, fields) => {
        connection.release();
        if (error) {
          callback({ status: "error" }, 400);
          console.log("db error sql : ", error);
          return;
        }
        callback({ status: "ok" }, 200);
      });
    });
  };

  this.setTemplate = function(name, path, callback) {
    pool.getConnection(function(err, connection) {
      let sql = "SELECT * FROM boxoprint_template WHERE name=?";
      sql = mysql.format(sql, [name]);
      connection.query(sql, (error, results, fields) => {
        let inserts;
        if (results.length) sql = "UPDATE boxoprint_template SET path=? WHERE name=?";
        else sql = "INSERT INTO boxoprint_template (path, name) VALUES(?, ?)";
        sql = mysql.format(sql, [path, name]);
        connection.query(sql, (error, results, fields) => {
          connection.release();
          if (error) {
            callback({ status: "error" }, 400);
            console.log("db error sql : ", error);
            return;
          }
          callback({ status: "ok" }, 200);
        });
      });
    });
  };

  return this;
};
