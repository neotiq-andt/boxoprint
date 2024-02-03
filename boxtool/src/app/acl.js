const mysql = require('mysql');

module.exports.Acl = function(mysqlConfiguration, sessionConfiguration) {
    let pool = mysql.createPool(mysqlConfiguration);
    let sessions = sessionConfiguration;

    this.checkBearer = function(acl, req, res, next, callback, force = false) {
	if (req.token == null) {
	    res.status(401);
	    res.json({"status": "error", "log" : "access denied"});
	    console.log("no token found! ", req.headers);
	    return;
	}
	let auth_ = sessions.sessions.get(req.token);
	if (auth_ != null && auth_.login != null && auth_.disable == false) {
	    if (force == false && auth_.passwordChanged == false) {
		res.status(423);
		res.json({"status": "error", "log" : "need to change password"});
		return;
	    }
	    if (acl.roles != null) {
		let i = 0;
		for (; i != acl.roles.length; i++) {
		    if (acl.roles[i] == auth_.role) {
			break;
		    }
		}
		if (i == acl.roles.length) {
		    console.log("checkBearer ACL failed :" + acl.roles);
		    res.status(403);
		    res.json({"status": "error", "log" : 'forbidden'});
		    return;
		}
	    }
	    sessions.sessions.ttl(req.token, sessions.sessionTTL);
	    callback(req, res, next, auth_);
	}
	else {
	    res.status(401);
	    console.log("error token : ", req.token);
	    res.json({"status": "error", "log" : "access denied token"});
	}
    };

    this.checkUserACL = function(role, login, user_id, callback) {
	let ret = {};
	ret.status = false;
	switch (role) {
	case 'admin':
	    pool.getConnection(function(err, connection) {
		connection.query("SELECT user_id FROM app_user WHERE login=\"" + login + "\"", (error, results, fields) => {
		    connection.release();
		    if (error) {
			callback(ret, 400);
			console.log("db error sql : ", error);
			return;
		    }
		    if (results.length)
			ret.user_id = results[0].user_id;
		    ret.status = true;
		    callback(ret, 200);
		});
	    });
	    break;

	case 'user':
	case 'partner':
	    callback(ret, 400);
	    break;

	default:
	    callback(ret, 400);
	}
    };
    return this;
};
