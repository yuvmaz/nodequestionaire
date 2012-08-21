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

everyauth.azureacs
  .identityProviderUrl('https://nodeqacs.accesscontrol.windows.net/v2/wsfederation/')
  .entryPath('/auth/azureacs')
  .callbackPath('/auth/azureacs/callback')
  .signingKey('fsFZ7kFWosQndob50Fg+h6Jt8CLOyPQUdCZjnq84MY0=')
  .realm('http://nodequestionnaires.com/')
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
	express.session( {secret: 'BlablaBLA'}),
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

app.listen(12040);
console.log("listening on port 12040");
