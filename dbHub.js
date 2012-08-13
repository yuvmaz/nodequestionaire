var mongo = require('mongodb');

var db = new mongo.Db('nodequestionaire', 
        new mongo.Server('ds035997.mongolab.com',35997, {auto_reconnect: true, pool_size:4}));
db.open(function(err, client) {
    if(err) {
        console.log("Cannot open DB: " + err);
        return;
    } 
    db.authenticate('user', 'user', function(err, success) {
        if(err) {
            console.log("Cannot authenticate: " + err);
            return;
        } 
        console.log('Successfully connected to MongoDB');
    });
});


exports.db = db;
