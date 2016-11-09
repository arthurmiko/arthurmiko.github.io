var http = require('http');
var static = require('node-static');
var file = new static.Server('.');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var server = new http.Server().listen(8080);
console.log('Server running on port 8080');
server.on('request', handler);
var MongoClient = require('mongodb').MongoClient;
var querystring = require('querystring');
var dbUrl = 'mongodb://localhost:27017/messages';

function handler(req, res) {
  console.log('--------------------' + req.url);
  if (req.url == '/arch') {
    var body = '';
    req
      .on('readable', function(){
        var chunk;
        while (null !== (chunk = req.read())) {
          body += chunk;
        }
      })
      .on('end', function() {
        body = JSON.parse(body);
        var userName = body.name;
        body = JSON.stringify(body);
        fs.writeFile('./data/' + userName + '.json', body, function(){
          console.log('data saved');
        });
        res.end('data saved into: ' + userName + '.json');
      })
  } else if (req.url == '/db/users') {
    mongoReq('list', null, function(data){
      res.end(JSON.stringify(data));
    });
  } else if (req.url.slice(0, 7) == '/userId') {
    var userIdsArr = querystring.parse(req.url.slice(8));
    mongoReq('msg', userIdsArr.ids, function(data){
      res.end(JSON.stringify(data));
    });
  } else {
    file.serve(req, res);
  }
}

function mongoReq(type, userId, callback) {
  MongoClient.connect(dbUrl, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    if (type == 'msg') {
      if (typeof(userId) == 'string') {
        var dbReq = {
          selector: {id: userId},
          projection: {_id: false}
        }
      } else {
        var idsArr = [];
        userId.forEach(function(val) {
          idsArr.push({id: val});
        })
        var dbReq = {
          selector: {$or: idsArr},
          projection: {_id: false}
        }
      }
    } else if (type == 'list') {
      var dbReq = {
        selector: {},
        projection: {name: true, id: true, _id: false}
      }
    }

    findDocuments(db, dbReq, function(data) {
      db.close();
      callback(data);
    })

  });
}

var findDocuments = function(db, dbReq, callback) {
  var collection = db.collection('users');
  console.log(dbReq.selector);
  collection.find(dbReq.selector, dbReq.projection).toArray(function(err, r) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(r);
    callback(r);
  });
}

var aggregateDocuments = function(db, dbReq, callback) {
  var collection = db.collection('users');
  collection.aggregate({$match: {name: 'mama'}}, function(err, r){
    console.log(r[1]);
    console.log('aggregate by name mama');
    callback(r);
  })
}

// db.users.aggregate([ {$match: {name: 'warlus'}}, {$project: {name: true, _id: false, msgs: true}}, {$unwind: "$msgs"}, {$match: {"msgs.date": {$gt: 1474808952, $lt: 1474858952}}}])
// db.users.aggregate([ {$match: {$or: [{name: 'warlus'}, {name: 'alex'}]}}, {$project: {name: true, _id: false, msgs: true}}, {$unwind: "$msgs"}, {$match: {"msgs.date": {$gt: 1434808952, $lt: 1474858952}}}])
