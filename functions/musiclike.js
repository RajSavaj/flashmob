'use strict';

const likesmusic = require('../models/musiclike');
const bcrypt = require('bcryptjs');
var ObjectID = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;
const config = require('../config/config.json');

exports.sendlike=(pid,uid,mid,like) =>
new Promise((resolve,reject) =>{
    likesmusic.find({pid: pid,uid: uid,mid: mid}).then(likesm => {
    	  if(likesm.length==0){
    	  	const likeinsert = new likesmusic({
		            pid         : pid,
		            uid         : uid,
		            mid         : mid,
		            like 		: like
			});
			likeinsert.save();
    	  	resolve({ status: 200, message:0});
    	  }else{
    	  	let musicupdate = likesm[0];
			musicupdate.like=like;
			musicupdate.save()
    	  	resolve({ status: 200, message:1});
    	  }
    });
});

exports.checkLike=(pid,uid,mid) =>
    new Promise((resolve,reject) =>{
    likesmusic.find({pid: pid,uid: uid,mid: mid}, function (err, parties) {
        resolve({ status: 200, message: parties });
    });
});

exports.countLike=(pid,mid) =>
    new Promise((resolve,reject) =>{
    	MongoClient.connect(config.mongourl, function(err, db) {
			db.collection("musiclikes").aggregate([
		        { $match: {pid: pid,mid: mid,like:0}},
		        { $group: {"_id": null,like: { $sum: Number(1)  }}}
		    ]).toArray(function(err,res){
		    	var like=res;
		    	db.collection("musiclikes").aggregate([
			        { $match: {pid: pid,mid:mid,like:1}},
			        { $group: {"_id": null,dislike: { $sum: Number(1)  }}}
			    ]).toArray(function(err,res){
			    	resolve({ status: 200, message: like.concat(res) });
			    });
		    });
		});
});
