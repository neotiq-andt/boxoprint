process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

var confSMTP = {
    user:    "maconfig@faktori.fr", 
    password:"Menfous7575**", 
    host:    "smtp.faktori.fr", 
    ssl:     true
};

module.exports.sendEmail = function(email, cc, subject, message) {
    var msg = {};
    msg.text = message;
    msg.from = confSMTP.user;
    msg.to = email;
    if (cc != null)
	msg.cc = cc;
    msg.subject = subject;
    require('emailjs').server.connect(confSMTP).send(msg, function(err, message) { console.log(err || message); });
};

//module.exports.sendEmail("yann@logmote.com", null, "test", "message");
