'use strict';

const stepcount = require('../models/stepcount');
const bcrypt = require('bcryptjs');

exports.stepsend=(pid,uid,count) =>
    new Promise((resolve,reject) =>{
        const stepc = new stepcount({
            pid        : pid,
            uid        : uid,
            count      : count,
            created_at : new Date()
        });
        stepc.save();
});
