var mongo = require('mongodb');
var dbHub = require('./dbHub');
var logins;


dbHub.db.collection('logins', function(err, collection) {
    if(err) {
        console.log("Error in connecting to logins: " + err);
        return;
    }
    logins = collection;
});

exports.findUser = function(id, callback) {
    logins.findOne({id: id}, function(err, user) {
        if(err) {
            console.log("Error in finding user: " + err);
            return;
        }
        callback(null, user);
    });
}



exports.findOrCreateUser = function(userMetadata, promise) {
    logins.findOne({id: userMetadata.claimedIdentifier}, function(err, user) {
    if(err)
        promise.fail(err);
    if(user == null) 
        promise.fulfill(addUser(userMetadata));
    else 
        promise.fulfill(user);
    });
}


function addUser(sourceUser) {
	var user = {id: sourceUser.claimedIdentifier, name: sourceUser.firstname};
    logins.insert(user);

	return user;
}

