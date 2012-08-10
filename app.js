var express = require('express'),
	everyauth = require('everyauth'),
	util = require('util'),
	mongo = require('mongodb');

everyauth.debug=true;
var users = {};
var usersById = {};
var userIndex = 0;
var logins;

var db = new mongo.Db('nodequestionaire', new mongo.Server('ds035997.mongolab.com',35997, {auto_reconnect: true}));
db.open(function(err, client) {
		client.authenticate('user', 'user', function(err, success) {
			if(err)
				console.log("error " + err);
			else {
		       console.log("success ");
			}
			console.log("in connecting to mongo");
		    db.collection('logins', function(err, collection) {
				logins = collection;
			});		
		});
	});

function addUser(source, sourceUser) {
	var user;
	user = usersById[++userIndex] = {id: userIndex};
	user[source] = sourceUser;

	return user;
}

everyauth.everymodule
	.findUserById(function(id, callback) {
			callback(null, usersById[id]);
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
			return usersById[userMetadata.claimedIdentifier] ||
			(usersById[userMetadata.claimedIdentifier] = addUser('google_openid', userMetadata));
	})
	.redirectPath('/');

var app = express.createServer(
	express.bodyParser(),
	express.static(__dirname + "/public"),
	express.cookieParser(),
	express.session( {secret: 'BlablaBLA'}),
	everyauth.middleware()
);



app.get('/', function(req, res) {
	var name = ( typeof req.user === 'undefined') ? 'Anonymous' : req.user.google_openid.firstname;
	res.write('<h1>Hello ' + name + '</h1>');
	res.write('<h2>You are ');
	if(!req.loggedIn)
		res.write('not ');
    res.write('authenticated</h2>');
	res.write('<a href="/auth/openid">OpenID</a>');
	res.end();
});

app.listen(4000);
console.log("listening on port 4000");
