'use strict';

const stepcount = require('../models/stepcount');
const bcrypt = require('bcryptjs');
const joinparty = require('../models/joinparty');

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
      			stepc.count=stepc.count+count;
      			stepc.save();
      			console.log("Update");
      		}
      });
});
exports.attemptparty=(pid,uid)=>
     new Promise((resolve,reject) =>{
      joinparty.find({pid:pid,uid:uid}).then(data=>{
           if(data.length!=0){
                  let stepc=data[0];
                  stepc.status=1;
                  stepc.save();
           }
      });
 });

exports.attemptparty=(pid,uid) =>
    new Promise((resolve,reject) =>{
      joinparty.find({pid:pid,uid:uid}).then(data=>{
          if(data.length!=0){
               let stepc=data[0];
              stepc.status=1;
              stepc.save();
              console.log("Update");
          }
      });
});