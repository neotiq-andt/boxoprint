'use strict';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
// dependencies
const express = require('express');
const bodyParser = require('body-parser');
const bearerToken = require('express-bearer-token');
const cors = require('cors');
const cache = require('node-cache');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const generator = require('generate-password');
const http = require('http');
const fs = require('fs');

require('dotenv').config()

// Constants
const PORT = 8082;
const HOST = '0.0.0.0';
const hostname = 'cartonnages 3D';

// configurations
const mysqlConfiguration = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};
const sessionConfiguration = {
    sessions: new cache(),
    failed: new cache(),
    sessionTTL: 3600,
    superTokenTTL: 60
};
// const privateKey = fs.readFileSync(__dirname + '/ssl/privkey.pem');
// const certificate = fs.readFileSync(__dirname + '/ssl/cert.pem');
// const CA = fs.readFileSync(__dirname + '/ssl/fullchain.pem');
const saltRounds = 10;

const acl = new require('./acl').Acl(mysqlConfiguration, sessionConfiguration);
// const users = new require('./users').Users(mysqlConfiguration, function() {
//     setInterval(function() {
// 	users.update();
//     }, 60000);
// });
const smtp = require('./smtp');
const db = require('./database').Db(mysqlConfiguration);

// setup 443 web server
const app = express();

const path_www = process.env.PATH_WWW || require('path').join(__dirname, "../../ui/build");

// https.createServer({
//     key: privateKey,
//     cert: certificate,
//     ca: CA
// }, app).listen(PORT, HOST);

http.createServer({}, app).listen(PORT, HOST);

console.log('Running on http://' + HOST + ':' + PORT);

app.use(bodyParser.json({limit: '100mb'})); // support json encoded bodies
app.use(bodyParser.urlencoded({limit: '100mb',  extended: true })); // support encoded bodies
app.use(bodyParser.raw({type: 'application/octet-stream', limit : '100mb'}))
app.use(bearerToken());
app.use(cors({optionsSuccessStatus: 200})); // some legacy browsers (IE11, various SmartTVs) choke on 204

new require('./cartonnages').init(app, acl, db);

// get all users for a specific env. server
app.get("/users", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    acl.checkBearer({'roles':['admin']}, req, res, next, function(req, res, next, session) {
	/*
	if (req.query.server_id == null) {
	    res.status(400);
	    res.json({"status": "error", "log" : 'bad params'});
	    return;
	}
	acl.checkServerACL(session.role, parseInt(req.query.server_id), session.user_id, function(ret) {
	    if (ret.status == false) {
		res.status(403);
		res.json({"status": "error", "log" : 'forbidden'});
		return;
	    }
	    db.getUsers(parseInt(req.query.server_id), function(ret, status) {
		res.status(status);
		for (let i = 0; i != ret.length; i++) {
		    const conf = users.get(ret[i].login);
		    ret[i].role = conf ? conf.role : "user";
		    ret[i].disable = conf ? conf.disable : false;
		    ret[i].passwordChanged = conf ? conf.passwordChanged : false;
		    ret[i].email = conf ? conf.email : null;
		    ret[i].id = conf ? conf.id : null;
		    ret[i].company = conf ? conf.company : null;
		}
		res.json(ret);
	    });
	});
	*/
    });
});

// get all user information
app.get("/user", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    acl.checkBearer({'roles':['admin']}, req, res, next, function(req, res, next, session) {
	if (req.query.login == null) {
	    res.status(400);
	    res.json({"status": "error", "log" : 'bad params'});
	    return;
	}
	req.query.login = req.query.login.toLowerCase();
	let conf = users.get(req.query.login);
	if (conf == null) {
	    res.status(404);
	    res.json({"status": "error", "log" : 'not found'});
	    return;
	}
	if (req.query.login == '*') {
		let ret = [];
		Object.keys(conf).forEach(function (key) { 
			var val = conf[key];
			ret.push({
				user_id: val.user_id,
				role: val.role,
				login: val.login,
				disable: val.disable,
				email: val.email,
				passwordChanged: val.passwordChanged,
				company: val.company		
			});
		});
		res.status(200);
		res.json(ret);
		return;
	}
	acl.checkUserACL(session.role, req.query.login, session.user_id, function(ret) {
	    if (ret.status == false) {
		res.status(403);
		res.json({"status": "error", "log" : 'forbidden'});
		return;
	    }
	    res.json([{
		user_id: ret.user_id,
		role: conf.role,
		login: conf.login,
		disable: conf.disable,
		email: conf.email,
		passwordChanged: conf.passwordChanged,
		company: conf.company
	    }]);
	});
    });
});

// create/update a user for a specific env. server
app.post("/user", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    acl.checkBearer({'roles':['admin', 'partner']}, req, res, next, function(req, res, next, session) {
	if (req.query.login == null || req.query.role == null || req.query.email == null || req.query.id == null || req.query.company == null) {
	    res.status(400);
	    res.json({"status": "error", "log" : 'bad params'});
	    return;
	}
	req.query.login = req.query.login.toLowerCase();
	if (req.query.role != 'user' && req.query.role != 'partner') {
	    res.status(400);
	    res.json({"status": "error", "log" : 'bad params'});
	    return;
	}
	let conf = users.get(req.query.login);
	if (conf && req.query.role != conf.role) {
	    res.status(403);
	    res.json({"status": "error", "log" : 'You cannot change the user role'});
	    return;
	}
	if (conf) {
	    acl.checkUserACL(session.role, req.query.login, session.user_id, function(ret) {
		if (ret.status == false) {
		    res.status(403);
		    res.json({"status": "error", "log" : 'forbidden'});
		    return;
		}
		if (req.query.password != null) {
		    bcrypt.genSalt(saltRounds, function(err, salt) {
			bcrypt.hash(req.query.password, salt, function(err, hash) {
			    conf.login = req.query.login;
			    if (req.query.disable)
				conf.disable = req.query.disable.toLowerCase() == 'true' ? true : false;
			    conf.passwordChanged = false;
			    conf.email = req.query.email;
			    conf.id = req.query.id;
			    conf.company = req.query.company;
			    conf.cipherEmail = users.cipherEmail(req.query.email);
			    users.set(conf.login, conf, function(created) {
				res.json({'status':'ok'});
			    });
			});
		    });
		} else {
		    conf.login = req.query.login;
		    if (req.query.disable)
			conf.disable = req.query.disable.toLowerCase() == 'true' ? true : false;
		    conf.email = req.query.email;
		    conf.id = req.query.id;
		    conf.company = req.query.company;
		    conf.cipherEmail = users.cipherEmail(req.query.email);
		    users.set(conf.login, conf, function(created) {
			res.json({'status':'ok'});
		    });
		}
	    });
	} else {
	    if (req.query.password == null) {
		res.status(400);
		res.json({"status": "error", "log" : 'bad params'});
		return;
	    }
	    bcrypt.genSalt(saltRounds, function(err, salt) {
		bcrypt.hash(req.query.password, salt, function(err, hash) {
		    conf = {login: req.query.login,
			    password: hash,
			    role : req.query.role,
			    disable: false,
			    passwordChanged: false,
			    email: req.query.email,
			    cipherEmail: users.cipherEmail(req.query.email),
			    id: req.query.id,
			    company: req.query.company
			   };
		    users.set(conf.login, conf, function(created) {
			if (created == true) {
			    users.update();
			    res.status(201);
			}
			res.json({'status':'ok'});
		    });
		});
	    });
	}
    });
});

// delete a user for a specific env. server
app.delete("/user", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    acl.checkBearer({'roles':['admin']}, req, res, next, function(req, res, next, session) {
	if (req.query.login == null) {
	    res.status(400);
	    res.json({"status": "error", "log" : 'bad params'});
	    return;
	}
	req.query.login = req.query.login.toLowerCase();
	if (req.query.login == 'trash') {
	    res.status(403);
	    res.json({"status": "error", "log" : 'forbidden'});
	    return;
	}
	let conf = users.get(req.query.login);
	if (conf == null) {
	    res.status(404);
	    res.json({"status": "error", "log" : 'User not found'});
	    return;
	}
	acl.checkUserACL(session.role, req.query.login, session.user_id, function(ret) {
	    if (ret.status == false) {
		res.status(403);
		res.json({"status": "error", "log" : 'forbidden'});
		return;
	    }
	    users.remove(req.query.login);
	    res.json({"status": "ok"});
	});
    });
});

// ask to reset the password for a user {partner, or user}
app.get("/resetpassword", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.query.login == null ||
	req.query.email == null) {
	res.status(400);
	res.json({"status": "error", "log" : 'bad params'});
	return
    }
    let login = req.query.login.toLowerCase();
    let _auth = users.get(login);
    if (_auth == null || _auth.email != req.query.email) {
	res.status(200);
	res.json({"status": "ok"});
	console.log("/resetpassword login not found ", login);
	return;
    }
    let newPassword = generator.generate({
	length: 12,
	numbers: true
    });
    bcrypt.genSalt(saltRounds, function(err, salt) {
	bcrypt.hash(newPassword, salt, function(err, hash) {
	    _auth.password = hash;
	    _auth.passwordChanged = false;
	    users.set(login, _auth);
	    smtp.sendEmail(_auth.email, null, "Demande de réinitialisation du mot de passe : MERCI DE NE PAS REPONDRE A CET EMAIL",
			   "Bonjour,\n\nUne demande de réinitialisation du mot de passe de votre compte " + hostname + " vient d'être effectuée.\n\nVoici votre nouveau mot de passe provisoire : " + newPassword + "\n\nNous vous souhaitons une bonne journée.");
	    res.status(200);
	    res.json({"status": "ok"});
	});
    });
});

// ask a riddle to help the user to find the recovery email address {partner, or user}
app.get("/riddle", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.query.login == null) {
	res.status(400);
	res.json({"status": "error", "log" : 'bad params'});
    } else {
	let login = req.query.login.toLowerCase();
	let _auth = users.get(login);
	if (_auth == null || _auth.disable == true || _auth.cipherEmail == null || _auth.cipherEmail.length == 0)
	    res.json({"status": "ok", "email" : "******************.com"});
	else
	    res.json({"status": "ok", "email" : _auth.cipherEmail});
    }
});

// change password of a user {admin, partner, user}
app.use("/changepassword", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    acl.checkBearer({}, req, res, next, function(req, res, next, session) {
	if (session.passwordChanged == false && session.sessionId == null) {
	    res.status(403);
	    res.json({"status": "error", "log" : 'forbidden'});
	    return;
	}
	if (req.query.password == null) {
	    res.status(400);
	    res.json({"status": "error", "log" : 'bad params'});
	    return;
	}
	let _auth = users.get(session.login);
	if (_auth == null) {
	    res.status(404);
	    res.json({"status": "error", "log" : 'not found'});
	    return;
	}
	bcrypt.compare(req.query.password, _auth.password, function(err, status) {
	    if (status == true) {
		res.status(405);
		res.json({"status": "error", "log" : 'password already used'});
		return;
	    }
	    bcrypt.genSalt(saltRounds, function(err, salt) {
		bcrypt.hash(req.query.password, salt, function(err, hash) {
		    _auth.password = hash;
		    _auth.passwordChanged = true;
		    users.set(session.login, _auth);
		    _auth.login = session.login;
		    res.status(200);
		    if (session.sessionId) {
			sessionConfiguration.sessions.set(""+session.sessionId, _auth, sessionConfiguration.sessionTTL);
			res.json({"status": "ok", 'login': session.login, 'role': session.role, 'sessionId': session.sessionId});
		    } else
			res.json({"status": "ok", 'login': session.login, 'role': session.role});
		});
	    });
	});
    }, true);
});

// get all information for the user {admin, partner, user}
app.use("/me", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    acl.checkBearer({}, req, res, next, function(req, res, next, session) {
	res.status(200);
	res.json({"status": "ok", 'login' : session.login, 'role': session.role});
    });
});

// remove the current sesssion of the user {admin, partner, user}
app.use("/logout", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    acl.checkBearer({}, req, res, next, function(req, res, next, session) {
	sessionConfiguration.sessions.del(""+session.sessionId);
	res.status(200);
	res.json({"status": "ok"});
    });
});

// login a user {admin, partner, user}
app.use("/auth", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.query.login == null || req.query.password == null) {
	res.status(400);
	res.json({"status": "error", "log" : 'bad params'});
    } else {
	let login = req.query.login.toLowerCase();
	let _auth = users.get(login);

	if (_auth == null || _auth.disable == true) {
	    res.status(401);
	    res.json({"status": "error", "log" : 'auth failed.'});
	} else {
	    bcrypt.compare(req.query.password, _auth.password, function(err, status) {
		let f = sessionConfiguration.failed.get(login);
		if (f == null)
		    f = 0;
		if (status == false) {
		    if (f >= 10)
			sessionConfiguration.failed.set(login, f*2, 3600);
		    else
			sessionConfiguration.failed.set(login, f+1, 3600);
		}
		setTimeout(function() {
		    if (status == false) {
			res.status(401);
			res.json({"status": "error", "log" : 'auth failed.'});
		    } else {
			sessionConfiguration.failed.set(login, 0);
			let sessionId = uuidv4();
			_auth.login = login;
			sessionConfiguration.sessions.set(""+sessionId, _auth, sessionConfiguration.sessionTTL);
			let superToken = null;
			if (_auth.passwordChanged == false) {
			    superToken = uuidv4();
			    sessionConfiguration.sessions.set(""+superToken, {"sessionId":sessionId,"login":login,"disable":false,"role":_auth.role,"passwordChanged":false}, sessionConfiguration.superTokenTTL);
			}
			res.status(200);
			if (superToken != null)
			    res.json({'sessionId' : sessionId, 'login':login, 'role' : _auth.role, 'superToken' : superToken});
			else
			    res.json({'sessionId' : sessionId, 'login':login, 'role' : _auth.role});
		    }
		}, f * 1000);
	    });
	}
    }
});

// Serve the static files from the React app
app.use(express.static(path_www));

// root entry for the 443 webapp
app.get("*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.sendFile('index.html', { root: path_www });
});
