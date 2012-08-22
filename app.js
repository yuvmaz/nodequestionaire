var express = require('express'),
	everyauth = require('everyauth'),
	util = require('util'),
    nconf = require('nconf'),
    dbHub = require('./dbHub'),
    users = require('./users'),
    languages = require('./languages');

everyauth.everymodule
	.findUserById(function(id, callback) {
        return users.findUser(id, callback);
});

everyauth.azureacs
  .identityProviderUrl(nconf.get('azure:identityProviderUrl'))
  .entryPath('/auth/azureacs')
  .callbackPath('/auth/azureacs/callback')
  .signingKey(nconf.get("azure:signingKey"))
  .realm(nconf.get("azure:realm"))
  .homeRealm('') // if you want to use a default idp (like google/liveid)
  .tokenFormat('swt') // only swt supported for now
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
	express.session( {secret: nconf.get("sessionKey")}),
	everyauth.middleware()
);
app.set('view engine', 'jade');

app.get('/', function(req, res) {
    res.render('main.jade', {req: req, everyauth: everyauth});
});

app.get('/getLanguages', function(req, res) {
    var term = req.query.term;
    languages.findMatchingLanguages(term, res);
});

var port = nconf.get("port");
app.listen(port);
console.log("listening on port " + port);
