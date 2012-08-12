var express = require('express'),
	everyauth = require('everyauth'),
	util = require('util'),
	mongo = require('mongodb'),
    users = require('./users');

var logins;
var languages;

var db = new mongo.Db('nodequestionaire', new mongo.Server('ds035997.mongolab.com',35997, {auto_reconnect: true}));
db.open(function(err, client) {
       if(err) {
            console.log(err);
            return;
        }
        client.authenticate('user', 'user', function(err, success) {
            db.collection('logins', function(err, collection) {
                logins = collection;
                console.log('ok');
            });
        /*        
            db.collection('languages', function(err, collection) {
                languages = collection;
                console.log('ok');
            });
        */
    });    
});


everyauth.everymodule
	.findUserById(function(id, callback) {
    return users.findUser(logins, id, callback);
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
        users.findOrCreateUser(logins, userMetadata, promise);

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
    var re = new RegExp("^" + term);
    console.log(re);
    languages.findOne( {Name: re}, function(err, lang) {
        console.log(util.inspect(lang));
    });
    /*
    var c = languages.find({Name: re}); 
     c.each(function(doc) {
        if(doc != null)
            console.log(util.inspect(doc));
    });
    */


});

app.listen(4000);
console.log("listening on port 4000");
