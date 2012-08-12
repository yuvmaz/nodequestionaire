
function addUser(loginsCollection, sourceUser) {
	var user = {id: sourceUser.claimedIdentifier, firstname: sourceUser.firstname};
	loginsCollection.insert(user);

	return user;
}

exports.findUser = function(loginsCollection, id, callback) {
    loginsCollection.findOne({id: id}, function(err, user) {
        callback(null, user);
    });
}



exports.findOrCreateUser = function(loginsCollection, userMetadata, promise) {
    loginsCollection.findOne({id: userMetadata.claimedIdentifier}, function(err, user) {
    if(err)
        promise.fail(err);
    if(user == null) 
        promise.fulfill(addUser('google_openid', userMetadata));
    else 
        promise.fulfill(user);
    });
}
