var mongo = require('mongodb');
var languages;


exports.findMatchingLanguages = function(term, res) {
    var re = new RegExp(".*" + term + ".*", "i");
    if(languages == null) {
        openLanguagesCollection(function (collection) {
            collection.find({Name: re}, {Name: 1}, function(err, cursor) {
                cursor.toArray(function(err, arr) {
                    res.json(arr.map(function (obj) {
                        return obj.Name;
                    }));
                });
            });
        });
    }
    else {
        languages.find({Name: re}, {Name: 1}, function(err, cursor) {
            cursor.toArray(function(err, arr) {
                res.json(arr.map(function (obj) {
                    return obj.Name;
                }));
            });
        });
    }
}



function openLanguagesCollection(callback) {
    var db = new mongo.Db('nodequestionaire', new mongo.Server('ds035997.mongolab.com',35997, {auto_reconnect: true, pool_size: 4}));
    db.open(function(err, client) {
       if(err) {
            console.log(err);
            return;
        }
        client.authenticate('user', 'user', function(err, success) {
            db.collection('languages', function(err, collection) {
                languages = collection;
                console.log('ok languages');
                callback(collection);
                //db.close();
            });
        });
    });
}

