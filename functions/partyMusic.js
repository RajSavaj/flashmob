'use strict';

const partyMusic = require('../models/music');
const bcrypt = require('bcryptjs');

exports.uploadPartyMusic = (pid,music,name,uid) =>
    new Promise((resolve,reject) => {
        const pmusic = new partyMusic({
                pid      : pid,
                music    : music,
                name     : name,
                uid      : uid,
                mtime    : new Date()
            });
            pmusic.save()
                .then(() => resolve({ status: 200, message: 1}))
                .catch(err => {reject({ status: 500, message: 'Internal Server Error !'+err.message });});
	});
    
exports.getMusic=(pid) =>
    new Promise((resolve,reject) =>{
    partyMusic.find({pid:pid}, function (err, musics) {
        resolve({ status: 200, message: musics });
    });  
});

exports.getMusicById=(pid,uid) =>
    new Promise((resolve,reject) =>{
    partyMusic.find({pid: pid,uid:uid}, function (err, musics) {
        resolve({ status: 200, message: musics });
    });  
});

