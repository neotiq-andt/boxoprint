const dbConfiguration = {
    host: '127.0.0.1',
    user: 'box_generator',
    password: '2yVcQ8SscRxS',
    database: 'magento'
};

const random = require('random');
const bcrypt = require('bcrypt');
const saltRounds = 10;

let users = new require('./users').Users(dbConfiguration, function() {
    if (users == null) {
	console.log("fatal error");
	return;
    }
    const { prompt } = require('enquirer');

    
    const firstQuestion = [
	{
	    type: 'select',
	    name: 'main',
	    message: 'User manager options:',
	    choices: ['Quit', 'Edit', 'Delete', 'Add', 'List']
	}
    ];

    generateServersMenu = function() {
	let val = {};
	let conf = users.getServers();
	val.type = 'autocomplete',
	val.name = 'server',
	val.message = 'Select the env. serveur to associate this user';
	val.suggest = function(input, choices) {
	    return choices.filter(choice => choice.message.startsWith(input));
	};
	val.choices = [];
	val.choices.push("0: null");
	Object.keys(conf).forEach(function(key) {
	    val.choices.push(""+key+": "+conf[key].name);
	});
	return val;
    };

    generatePhonesMenu = function(server_id) {
	let val = {};
	let conf = users.getServers()[server_id];
	val.type = 'autocomplete',
	val.name = 'phone',
	val.message = 'Select the phone to associate this user';
	val.suggest = function(input, choices) {
	    return choices.filter(choice => choice.message.startsWith(input));
	};
	val.choices = [];
	val.choices.push("0: null");
	for (var i = 0; i != conf.phones.length; i++) {
	    val.choices.push(""+ conf.phones[i].phone_id + ": " + conf.phones[i].name + " (" + conf.phones[i].number + ")");;
	}
	return val;
    };

    generateUserMenu = function() {
	let val = {};
	let conf = users.get("*");
	val.type = 'autocomplete',
	val.name = 'user',
	val.message = 'Select the user';
	val.suggest = function(input, choices) {
	    return choices.filter(choice => choice.message.startsWith(input));
	};
	val.choices = [];
	val.choices.push("0: null");
	Object.keys(conf).forEach(function(key) {
	    val.choices.push(key);
	});
	return val;
    };

    generateConfirmMenu = function(message) {
	let menu = [];
	let val = {};
	val.type = 'confirm';
	val.name = 'confirm';
	val.message = message;
	menu.push(val);
	return menu;
    };

    const emailQuestion = [
	{
            type: 'input',
	    name: 'email',
	    message: 'email recovery: '
	}
    ];

    const passwordQuestion = [
	{
	    type: 'password',
	    name: 'password',
	    message: 'password: '
	}
    ];

    const roleQuestion = [
	{
	    type: 'select',
	    name: 'role',
	    message: 'Select the role:',
	    choices: ['user', 'admin', 'partner']
	}
    ];

    const userLogin = [
	{
	    type: 'input',
	    name: 'user',
	    message: 'User name :'
	}
    ];

    console.log("Welcome to the backend manager.");
    (async () => {
	do {
	    let answers = await prompt(firstQuestion);
	    switch (answers.main) {
	    case 'Quit':
		process.exit(1);	    
		break;
		
	    case 'Edit':
		var user = await prompt(generateUserMenu());
		var conf = users.get(user.user);
		var disable = await prompt(generateConfirmMenu("Account disable?"));
		if (disable.confirm == true) {
		    conf.disable = true;
		    users.set(user.user, conf);
		    break;
		}
		conf.disable = false;
		var role = await prompt(roleQuestion);
		conf.role = role.role;
		var recovery = await prompt(generateConfirmMenu("Change email recovery?"));
		if (recovery.confirm == true) {
		    var email = await prompt(emailQuestion);
		    conf.email = email.email;
		}
		var confirm = await prompt(generateConfirmMenu("Reset password?"));
		if (confirm.confirm == true) {
		    var pwd = await prompt(passwordQuestion);
		    bcrypt.genSalt(saltRounds, function(err, salt) {
			bcrypt.hash(pwd.password, salt, function(err, hash) {
			    conf.password = hash;
			    conf.passwordChanged = false;
			    users.set(conf.login, conf);
			});
		    });
		} else
		    users.set(conf.login, conf);
		break;

	    case 'Delete':
		var user = await prompt(generateUserMenu());
		var conf = users.get(user.user);
		if (conf == null) {
		    console.log("error : account not found.");
		    break;
		}
		var confirm = await prompt(generateConfirmMenu("Delete " + user.user + " account?"));
		if (confirm.confirm == true) {
		    users.remove(conf.login);
		}
		break;

	    case 'Add':
		var user = await prompt(userLogin);
		var conf = users.get(user.user);
		if (conf != null) {
		    console.log("error : account already exist.");
		    break;
		}
		var pwd = await prompt(passwordQuestion);
		var email = await prompt(emailQuestion);
		var role = await prompt(roleQuestion);
		var confirm = await prompt(generateConfirmMenu("Confirm " + user.user + " password : " + pwd.password + " role : " + role.role));
		if (confirm.confirm == true) {
		    /*
		    var server = await prompt(generateServersMenu());
		    var server_id = parseInt(server.server);
		    var phone_id = 0;
		    if (server_id && users.getServers()[server_id].phones.length) {
			var phone = await prompt(generatePhonesMenu(server_id));
			phone_id = parseInt(phone.phone);
		    }
		    */
		    bcrypt.genSalt(saltRounds, function(err, salt) {
			bcrypt.hash(pwd.password, salt, function(err, hash) {
			    conf = {
				login: user.user,
				password: hash,
				role: role.role,
				disable: false,
				passwordChanged: false,
				email: email.email,
				cipherEmail: users.cipherEmail(email.email)
			    };
			    users.set(conf.login, conf, function() {
				users.updateTables(user.user, role.role);
			    });
			});
		    });
		}
		break;

	    case 'List':
		var conf = users.get('*');
		Object.keys(conf).forEach(function(key) {
                    console.log("role: " + conf[key].role + "\thash password: " + conf[key].password + "\tdisable: " + conf[key].disable + "\t\tpasswordChanged: " + conf[key].passwordChanged + "\t\tuser: " + key + "\t\temail: " + conf[key].email);
		});
		break;
	    default:
		break;
	    }
	} while (true);
    })();
});
