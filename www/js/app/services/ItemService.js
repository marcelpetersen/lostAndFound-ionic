angular.module('lf.services.item', [])


    .factory('ItemService', function ($rootScope,$firebaseArray,constants) {
        $rootScope.item;

        var service = {

            fetchAlerts: function (cb) {
                //var lostalerts = $firebaseArray($rootScope.ref.child('items').child("alert").child("lost"));
                //var foundalerts = $firebaseArray($rootScope.ref.child('items').child("alert").child("found"));

                var alerts = $firebaseArray($rootScope.ref.child("items").child("alert"));

                alerts.$loaded().then(function(){
                    cb(null,alerts);
                });

/*

                var norm = new Firebase.util.NormalizedCollection(
                   $rootScope.ref.child('items').child("alert").child("lost"),
                   $rootScope.ref.child('items').child("alert").child("found")
                )
                .select('lost.alertLocation','lost.createdAt','lost.createdBy','lost.name','lost.description','lost.picture', 'fount.alertLocation', 'found.createdAt','found.createdBy','found.name','found.description','found.picture');
                var alertsRef = $firebaseArray(norm.ref());

                alertsRef.$loaded().then(function() {
                    cb(null,alertsRef);
                });

*/

/*
                async.parallel([
                    function(callback){
                        lostalerts.$loaded().then(function () {
                            callback(null,lostalerts);
                        });
                    },
                    function(callback){
                        foundalerts.$loaded().then(function () {
                            callback(null,foundalerts);
                        });
                    }
                ],
                // optional callback
                function(err, results){
                    // the results array will equal ['one','two'] even though
                    // the second function had a shorter timeout.
                    console.log("all alerts");
                    console.log(results);
                    cb(null,results[0].concat(results[1]));
                });
*/

/*
            	var Item = Parse.Object.extend("Item"),

                    ItemCollection = Parse.Collection.extend({
                        model: Item,
                        query: (new Parse.Query(Item)).equalTo("office", $rootScope.office).equalTo('type','alert').include('createdBy').descending("createdAt")
                    });
                var item_collection = new ItemCollection();

                item_collection.fetch({
                  success: function(collection) {
                    cb(null,collection);
                  },
                  error: function(collection, error) {
                    cb(error,null);
                  }
                });
*/                
            },

            fetchFoundItems: function(cb) {


                var foundRef = new Firebase(constants.FIREBASEID+'/items/office'),
                    foundCollection = $firebaseArray(foundRef),
                    query = foundRef.orderByChild("office").equalTo($rootScope.office.$id);

                cb(null,$firebaseArray(query));
/*
            	var Item = Parse.Object.extend("Item"),
                    ItemCollection = Parse.Collection.extend({
                        model: Item,
                        query: (new Parse.Query(Item)).equalTo("office", $rootScope.office).equalTo('type','found').include('createdBy').include('category').descending("createdAt")
                    });
                var item_collection = new ItemCollection();

                item_collection.fetch({
                  success: function(collection) {
                    cb(null,collection);
                  },
                  error: function(collection, error) {
                    cb(error,null);
                  }
                });
*/
            },

            foundItemsByCategory: function(category_id,cb) {
                results = [];
                $rootScope.founditems_collection.$loaded().then(function(){
                    angular.forEach($rootScope.founditems_collection, function(item) {
                        if(item.category === category_id){
                            results.push(item);
                        }
                    });
                    cb(null,results);
                });
                
                
            }

        }
        return  service;
    });
