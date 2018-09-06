'use strict';

const partyImage = require('../models/partyimage');
const bcrypt = require('bcryptjs');

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

