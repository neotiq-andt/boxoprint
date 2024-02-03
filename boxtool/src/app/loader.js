
const fork = require('child_process').fork;
const fs = require('fs');

process.on('message', function(m) {
    switch (m.method) {
    default:
    case 'loader':
	let conf = m.conf;
	if (conf && conf.render && conf.filename) {
	    let template = fs.readFileSync(__dirname + "/templates/" + conf.filename, "utf8");
	    if (template) {
		eval(template);
		if (m.args == null || m.args.length == 0)
		    m.args = conf.render.args;
		process.send(eval(conf.render.function).apply(this, Array.prototype.slice.call(m.args, 0)));
		return;
	    }
	}
	process.send(null);
	process.exit(-1);
    }
});

// chargement d'un template
module.exports.loadTemplate = function(conf, args, callback) {
    let loader = fork(__dirname + '/loader.js');
    let timer = null;

    if (conf == null) {
	callback(null);
	return;
    }
    loader.on('message', function(response) {
	if (timer)
	    clearTimeout(timer);
	callback(response);
	loader.disconnect();
    });

    loader.send({method: 'loader', conf: conf, args: args});
    timer = setTimeout(function() {
	loader.kill();
	loader.disconnect();
	callback(null);
    }, 5000);
};
