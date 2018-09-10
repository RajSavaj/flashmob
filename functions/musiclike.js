'use strict';

const likesmusic = require('../models/musiclike');
const bcrypt = require('bcryptjs');
var ObjectID = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;
const config = require('../config/config.json');
const partyMusic = require('../models/music');

exports.sendlike=(pid,uid,mid,like) =>
new Promise((resolve,reject) =>{
    likesmusic.find({pid: pid,uid: uid,mid: mid}).then(likesm => {
    	  if(likesm.length==0)
    	  {
    	  	const likeinsert = new likesmusic({
		            pid         : pid,
		            uid         : uid,
		            mid         : mid,
		            like 		: like
			});

			likeinsert.save().then(data=>{
				partyMusic.find({_id:ObjectID(mid)}).then(d=>{
	    	  		let pm = d[0];
	    	  		if(like==0){
	    	  			pm.like=pm.like+1;
	    	  		}else{
	    	  			pm.dislike=pm.dislike+1;
	    	  		}
	    	  		pm.save();
	    	  		resolve({ status: 200, message:{d,data}});
	    	  	});
			});
    	  }
    	  else
    	  {
    	  	let musicupdate = likesm[0];
    	  	if(musicupdate.like!=like){
    	  		musicupdate.like=like;
				musicupdate.save().then(d=>{
					partyMusic.find({_id:ObjectID(mid)}).then(data=>{
		    	  		let pm = data[0];
		    	  		if(like==0){
		    	  			console.log("like");
		    	  			pm.like=pm.like+1;
		    	  			pm.dislike=pm.dislike-1;
		    	  		}else{
		    	  			console.log("dislike");
		    	  			pm.dislike=pm.dislike+1;
		    	  			pm.like=pm.like-1;
		    	  		}
		    	  		pm.save();
		    	  		resolve({ status: 200, message:100});
		    	  	});
				});
				
    	  	}else{
    	  		resolve({ status: 200, message:0});
    	  	}
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
