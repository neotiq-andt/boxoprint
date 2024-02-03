const fs = require('fs');
const mysql = require('mysql');
const random = require('random');

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

module.exports.Users = function(conf, callback = function() {}) {
    let pool = mysql.createPool(conf);
    let db = {};
    let self = this;

    this.get = function(key) {
	key = key.toLowerCase();
	try {
	    if (key == "*")
		return db;
	    return db[key];
	}
	catch(err) {
	    console.log("@db get : ", err.message);
	}
    };

    this.cipherEmail = function(email) {
	let cipher_email = "";
	for (let i = 0; i != email.length; i++)
	    cipher_email += "*";
	if (email.length > 10) {
	    for (let i2 = 0; i2 != 6;) {
		let i3 = random.int(0, email.length - 1);
		if (cipher_email[i3] == '*') {
		    cipher_email = cipher_email.replaceAt(i3, email[i3]);
		    i2++;
		}
	    }
	}
	return cipher_email;
    };
    
    this.set = function(key, val, callback = function() {}) {
	key = key.toLowerCase();
	try {
	    db[key] = val;
	    pool.getConnection(function(err, connection) {
		connection.query("SELECT user_id, user_conf FROM app_user WHERE login=\"" + key + "\"", (error, results, fields) => {
		    if (error) {
			connection.release();
			console.log("db error sql : ", error);
			return;
		    }
		    let sql;
		    let inserts;
		    if (results.length == 0) {
			sql = "INSERT INTO app_user (login, user_conf) VALUES (?, ?)";
			inserts = [key, JSON.stringify(val)];
		    } else {
			sql = "UPDATE app_user SET user_conf=? WHERE user_id=" + results[0].user_id;
			inserts = [JSON.stringify(val)];
		    }
		    sql = mysql.format(sql, inserts);
		    connection.query(sql, (error, results, fields) => {
			connection.release();
			if (error) {
			    console.log("db error sql : ", error);
			    return;
			}
			callback(results.insertId ? true : false);
		    });
		});
	    });
	}
	catch(err) {
	    console.log("@db set : ", err.message);
	}
    };

    this.remove = function(key) {
	key = key.toLowerCase();
	if (key == 'trash') {
	    console.log("error : trash is a special user.");
	    return;
	}
	try {
	    pool.getConnection(function(err, connection) {
		connection.query("DELETE FROM app_user WHERE login=\"" + key + "\"", (error, results, fields) => {
		    connection.release();
		    if (error)
			console.log("error : ", error);
		    else
			delete db[key];
		});
	    });
	    return;
	}
	catch(err) {
	    console.log("@db remove : ", err.message);
	}
    };

    this.updateTables = function(login, role, phone_id) {
	if (role == 'admin')
	    return;
	pool.getConnection(function(err, connection) {
	    connection.query("SELECT * FROM app_user WHERE login=\"" + login + "\"", (error, results, fields) => {
		connection.release();
		if (error) {
		    console.log("db error sql : ", error);
		    return;
		}
		if (results.length) {
		    let user_id = results[0].user_id;
		    switch (role) {
		    case 'partner':
			break
		    case 'user':
			break
		    }
		}
	    });
	});
    };

    let next = function(callback) {
	pool.getConnection(function(err, connection) {
	    connection.query("SELECT * FROM app_user", (error, results, fields) => {
		connection.release();
		if (error) {
		    console.log("db error sql : ", error);
		    return;
		}
		for (var i = 0; i != results.length; i++) {
		    var val = JSON.parse(results[i].user_conf);
		    val.user_id = results[i].user_id;
		    db[results[i].login] = val;
		}
		callback(this);
	    });
	});
    };
    
    this.update = function(callback = function(){}) {
	try {
	    db = {};
	    next(callback);
	}
	catch(err) {
	    console.log("@db : ", err.message);
	    db = {};
	    callback(null);
	}
    };
    this.update(callback);
    return this;
};

/*
const users = new module.exports.Users({
    host: 'localhost',
    user: 'louna',
    password: 'Fonia64*',
    database: 'vtigercrmdb'
}, function() {
    setTimeout(function() {
	var conf = users.get('*');
	Object.keys(conf).forEach(function(key) {
	    if (conf[key].email && conf[key].email.length) {
		conf[key].cipherEmail = users.cipherEmail(conf[key].email);
		users.set(conf[key].login, conf[key]);
	    }
	});
    }, 1000);
});
*/
