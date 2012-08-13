var mongo = require('mongodb');
var mongo = require('mongodb');
var dbHub = require('./dbHub');
var languages;

dbHub.db.collection('languages', function(err, collection) {
    if(err)
        console.log("Error in connecting to languages: " + err);
    languages = collection;
});


exports.findMatchingLanguages = function(term, res) {
    var re = new RegExp(".*" + term + ".*", "i");
    languages.find({Name: re}, {Name: 1}, function(err, cursor) {
        cursor.toArray(function(err, arr) {
            res.json(arr.map(function (obj) {
                return obj.Name;
            }));
        });
    });
}


