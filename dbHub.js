var nconf = require('nconf');
var mongo = require('mongodb');

nconf.argv().file({ file: 'config.json'});

var db = new mongo.Db(nconf.get("mongo:dbname"), 
        new mongo.Server(nconf.get("mongo:server"), nconf.get("mongo:port") , {auto_reconnect: true, pool_size:4}));
db.open(function(err, client) {
    if(err) {
        console.log("Cannot open DB: " + err);
        return;
    } 
    db.authenticate(nconf.get("mongo:user"), nconf.get("mongo:password"), function(err, success) {
        if(err) {
            console.log("Cannot authenticate: " + err);
            return;
        } 
        console.log('Successfully connected to MongoDB');
    });
});


exports.db = db;
