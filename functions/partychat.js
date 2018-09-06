'use strict';

const chat = require('../models/partychat');
const bcrypt = require('bcryptjs');

exports.sendmsg=(name,sid,msg,pid) =>
    new Promise((resolve,reject) =>{
        const chatmsg = new chat({
            name       : name,
            sid        : sid,
            msg        : msg,
            pid        : pid,
            created_at : new Date()
        });
        chatmsg.save();
});
exports.getChat=(pid) =>
    new Promise((resolve,reject) =>{
    chat.find({pid:pid}, function (err, chates) {
        resolve({ status: 200, message: chates });
    });  
});