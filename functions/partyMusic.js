'use strict';

const partyMusic = require('../models/music');

const bcrypt = require('bcryptjs');
var ObjectID = require('mongodb').ObjectID;
exports.uploadPartyMusic = (pid,music,name,uid) =>
    new Promise((resolve,reject) => {
        const pmusic = new partyMusic({
                pid      : pid,
                music    : music,
                name     : name,
                uid      : uid,
                like     : 0,
                dislike  : 0,
                mtime    : new Date()
            });
            pmusic.save()
                .then(() => resolve({ status: 200, message: 1}))
                .catch(err => {reject({ status: 500, message: 'Internal Server Error !'+err.message });});
	});
exports.getMusic=(pid) =>
    new Promise((resolve,reject) =>{
    partyMusic.aggregate([{$match:{pid:pid}},
            {$project:{_id:1,pid:1,music:1,name:1,uid:1,mtime:1,like:1, dislike:1, factor:{$subtract: ["$like", "$dislike"]}}}, 
            {$sort:{factor:-1,like:-1}}],function (err, musics) {
                 resolve({ status: 200, message: musics });
        });  
});

exports.getMusicById=(pid,uid) =>
    new Promise((resolve,reject) =>{
    partyMusic.aggregate([{$match:{pid: pid,uid:uid}},
            {$project:{_id:1,pid:1,music:1,name:1,uid:1,mtime:1,like:1, dislike:1, factor:{$subtract: ["$like", "$dislike"]}}}, 
            {$sort:{factor:-1,like:-1}}],function (err, musics) {
                 resolve({ status: 200, message: musics });
    });   
});

exports.removeMusic=(mid) =>
    new Promise((resolve,reject) =>{
         partyMusic.findOneAndRemove({_id:ObjectID(mid)}, function (err, musics) {
            resolve({ status: 200, message: musics });
        });  
});
