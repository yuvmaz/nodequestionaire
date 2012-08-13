var express = require('express'),
	everyauth = require('everyauth'),
	util = require('util'),
    dbHub = require('./dbHub'),
    users = require('./users'),
    languages = require('./languages');

  
everyauth.everymodule
	.findUserById(function(id, callback) {
        return users.findUser(id, callback);
});

everyauth.openid
	.myHostname('http://local.host:4000')
	.sendToAuthenticationUri(function (req, res) {
        var self = this;
        this.relyingParty.authenticate('http://www.google.com/accounts/o8/id', false, function(err, authenticationUrl) {
        if(err) 
            return p.fail(err);

        self.redirect(res, authenticationUrl);
        });
    })
	.findOrCreateUser(function(session, userMetadata) {
        var promise = this.Promise();
        users.findOrCreateUser(userMetadata, promise);

        return promise;
	})
	.redirectPath('/');

var app = express.createServer(
	express.bodyParser(),
	express.static(__dirname + "/public"),
	express.cookieParser(),
	express.session( {secret: 'BlablaBLA'}),
	everyauth.middleware()
);
app.set('view engine', 'jade');

app.get('/', function(req, res) {
    res.render('main.jade', {req: req});
});

app.get('/getLanguages', function(req, res) {
    var term = req.query.term;
    languages.findMatchingLanguages(term, res);
});

app.listen(4000);
console.log("listening on port 4000");
