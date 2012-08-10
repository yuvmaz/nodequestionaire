var express = require('express'),
	everyauth = require('everyauth'),
	util = require('util'),
	mongo = require('mongodb');

var logins;

var db = new mongo.Db('nodequestionaire', new mongo.Server('ds035997.mongolab.com',35997, {auto_reconnect: true}));
db.open(function(err, client) {
		client.authenticate('user', 'user', function(err, success) {
		    db.collection('logins', function(err, collection) {
				logins = collection;
			});		
		});
	});

function addUser(source, sourceUser) {
	var user = {id: sourceUser.claimedIdentifier, firstname: sourceUser.firstname};
	logins.insert(user);

	return user;
}

everyauth.everymodule
	.findUserById(function(id, callback) {
			logins.findOne({id: id}, function(err, user) {
				callback(null, user);
			});
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
			logins.findOne({id: userMetadata.claimedIdentifier}, function(err, user) {
				if(err)
					promise.fail(err);
				if(user == null) 
					promise.fulfill(addUser('google_openid', userMetadata));
				else 
					promise.fulfill(user);
			});

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

app.listen(4000);
console.log("listening on port 4000");
