'use strict';

const stepcount = require('../models/stepcount');
const bcrypt = require('bcryptjs');

exports.stepsend=(pid,uid,count) =>
    new Promise((resolve,reject) =>{
      stepcount.find({pid:pid,uid:uid}).then(data=>{
      		if(data.length==0){
      			  const stepc = new stepcount({
		            pid        : pid,
		            uid        : uid,
		            count      : count,
		            created_at : new Date()
		        });
      			console.log("save");
		        stepc.save();
      		}
      		else{
      			let stepc=data[0];
      			stepc.count=stepc.count+1;
      			stepc.save();
      			console.log("Update");
      		}
      });
});
