var mongo = require('mongodb');

exports.findUser = function(id, callback) {
    openLoginsCollection( function(collection) {
        collection.findOne({id: id}, function(err, user) {
           callback(null, user);
        });
    });
}



exports.findOrCreateUser = function(userMetadata, promise) {
    openLoginsCollection(function(collection) {
        collection.findOne({id: userMetadata.claimedIdentifier}, function(err, user) {
        if(err)
            promise.fail(err);
        if(user == null) 
            promise.fulfill(addUser('google_openid', userMetadata));
        else 
            promise.fulfill(user);
        });
    });
}


function addUser(sourceUser) {
	var user = {id: sourceUser.claimedIdentifier, firstname: sourceUser.firstname};
	openLoginsCollection(function(collection) {
        collection.insert(user);
    });

	return user;
}

function openLoginsCollection(callback) {
    db = new mongo.Db('nodequestionaire', new mongo.Server('ds035997.mongolab.com',35997, {auto_reconnect: true, pool_size:4}));
    db.open(function(err, client) {
       if(err) {
            console.log(err);
            return;
        }
        client.authenticate('user', 'user', function(err, success) {
            db.collection('logins', function(err, collection) {
                console.log('ok logins');
                callback(collection);
                //db.close();
            });
        });
    });
}

