'use strict';

const partyImage = require('../models/partyimage');
const bcrypt = require('bcryptjs');
const imageComment = require('../models/imageComment');
var ObjectID = require('mongodb').ObjectID;
exports.uploadPartyImage = (pid,img,name,caption) =>
    new Promise((resolve,reject) => {
        const pimg = new partyImage({
                pid      : pid,
                img      : img,
                name     : name,
                caption  : caption,
                ptime    : new Date()
            });
            pimg.save()
                .then(() => resolve({ status: 200, message: 1}))
                .catch(err => {reject({ status: 500, message: 'Internal Server Error !'+err.message });});
	});
    

exports.getImage=(pid) =>
    new Promise((resolve,reject) =>{
    partyImage.find({pid:pid}, function (err, chates) {
        resolve({ status: 200, message: chates });
    });  
});

exports.imageComment = (img_id,comment,user) =>
    new Promise((resolve,reject) => {
        const imgcomment = new imageComment({
                img_id     : img_id,
                comment    : comment,
                name       : user,
                ctime      : new Date(),
            });
            imgcomment.save().then((data) => resolve({ status: 200, message: data}))
                .catch(err => {reject({ status: 500, message: 'Internal Server Error !'+err.message });});
    });
    
exports.imageCommentGet = (img_id) =>
    new Promise((resolve,reject) => {
        imageComment.find({img_id:img_id}, function (err,comments) {
            resolve({ status: 200, message: comments });
    });  
});
