'use strict';

const frequest = require('../models/frequest');
const user = require('../models/user');
const bcrypt = require('bcryptjs');
const config = require('../config/config.json');
var ObjectID = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;


exports.getProfile=(sid,rid) =>
    new Promise((resolve,reject) =>{
        MongoClient.connect(config.mongourl, function(err, db) {
            db.collection("frequests").find({"$or": [{"sid": sid,"rid": rid},{"rid": sid,"sid": rid}]}).toArray(function(err,res){
                 if(res==0){
                     user.find({_id:ObjectID(rid)}, function (err, users) {
                        resolve({ status: 200, message: users });
                    });
                 }
                 else{
                    resolve({ status: 200, message: []  });
                 }
                 
            });
        });
    });

exports.sendRequest=(sid,rid) =>
    new Promise((resolve,reject) =>{
        MongoClient.connect(config.mongourl, function(err, db) {
            db.collection("frequests").find({"$or": [{"sid": sid,"rid": rid},{"rid": sid,"sid": rid}]}).toArray(function(err,res){
                 if(res==0){
                    const newparty = new frequest({
                        sid             : sid,
                        rid             : rid,
                        status          : 0,
                        created_at  : new Date()
                    });
                    newparty.save().then(() => resolve({ status: 200, message: 0}))
                            .catch(err => {
                            reject({ status: 500, message: 'Internal Server Error !'+err.message });
                        });
                 }
                 else{
                    resolve({ status: 200, message: 1  });
                 }
                 
            });
        });
    });

exports.responseRequest=(sid,rid,status) =>
    new Promise((resolve,reject) =>{
        frequest.find({$and:[{sid: sid},{rid:rid}]})
            .then(freq => {
                if (freq.length == 0) {
                    reject({ status: 500, message: 'Request Not Found !' });
                } else {
                    let rquest = freq[0];
                    rquest.atime = new Date();
                    rquest.status=status;
                    rquest.save().then(() => resolve({ status: 200, message: 1}));
                }
            });
    });

exports.FriendList=(ouid) =>
    new Promise((resolve,reject) =>{
        var rid=[];
        MongoClient.connect(config.mongourl, function(err, db) {
            db.collection("frequests").find({$and:[{sid: ouid},{"status":1}]},{rid:2}).toArray(function(err, result) {
                if (err) throw err;
                for(var i=0;i<result.length;i++){
                    rid.push(ObjectID(result[i]["rid"]));
                }
                db.collection("frequests").find({$and:[{rid: ouid},{"status":1}]},{sid:1}).toArray(function(err, result) {
                    for(var j=0;j<result.length;j++){
                        rid.push(ObjectID(result[j]["sid"]));
                    }
                    user.find({_id:rid}, function (err, parties) {
                        resolve({ status: 200, message: parties });
                    });
                    db.close();
                });
            });
        });

    });

exports.FriendReqList=(ouid) =>
    new Promise((resolve,reject) =>{
        var sid=[];
        MongoClient.connect(config.mongourl, function(err, db) {
            db.collection("frequests").find({$and:[{rid: ouid},{"status":0}]},{sid:2,_id:0}).toArray(function(err, res) {
                if (err) throw err;
                if(res!=0){
                    for(var i=0;i<res.length;i++){
                        sid.push(ObjectID(res[i]["sid"]));
                    }
                    user.find({_id:sid}, function (err, parties) {
                        resolve({ status: 200, message: parties });
                    });
                }
                else{
                     resolve({ status: 200, message: [] });
                }
            });
        });
});
