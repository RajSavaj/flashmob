'use strict';

const party     = require('../models/party');
const bcrypt    = require('bcryptjs');
const joinparty = require('../models/joinparty');
var ObjectID = require('mongodb').ObjectID;
var dateTime = require('node-datetime');
const user = require('../models/user');

exports.party=(name,email,pname, ptime, pdate, location, flag,pepole,lati,lang,city,uid ) =>
    new Promise((resolve,reject) =>{
        const newparty = new party({
            cname        : name,
            email       : email,
            pname       : pname,
            ptime       : ptime,
            pdate       : new Date(pdate),
            location    : location,
            flag        : flag,
            pepole      : pepole,
            lati        : lati,
            lang        : lang,
            city        : city,
            created_at  : new Date()
        });
        newparty.save().then(data=>{
                const insertJoinParty = new joinparty({
                    pid         : ""+data._id+"",
                    uid         : uid,
                    created_at  : new Date()
                });
                insertJoinParty.save();
                resolve({ status: 200, message:data});    
            })
            .catch(err => {
                    reject({ status: 500, message: 'Internal Server Error !'+err.message });
        });
});
exports.getparty=()=>new Promise((resolve,reject)=>{
    var dt = dateTime.create();
    var datec = dt.format('m/d/Y');
    party.find({"pdate": {"$gte": datec}}, function (err, parties) {
        resolve({ status: 200, message: parties });
    }); 
})

exports.searchparty=(city,date)=>new Promise((resolve,reject)=>{
    party.find({"city" : { "$regex" : city , "$options" : "i"},pdate:date}, function (err, parties) {
        resolve({ status: 200, message: parties });
    });
})

exports.requestParty=(pid,uid)=>new Promise((resolve,reject)=>{
    joinparty.find({pid:pid,uid:uid}).then(req=>{
        if(req.length==0){
            const insertJoinParty = new joinparty({
                    pid         : pid,
                    uid         : uid,
                    created_at  : new Date()
            });
            insertJoinParty.save();
            resolve({ status: 200, message:0});
        }else{
            resolve({ status: 200, message:1});
        }
    });
})

exports.userByPartyList=(uid)=>new Promise((resolve,reject)=>{
    joinparty.find({uid:uid},'-_id pid').then(req=>{
        var pid=[];
        if(req.length!=0){
            var dt = dateTime.create();
            var datec = dt.format('m/d/Y');
            for(var i=0;i<req.length;i++){
                pid.push(ObjectID(req[i].pid));
            }   
            console.log(datec);
            party.find({"_id": {"$in":pid},"pdate": {"$gte":datec}}, function (err, parties) {
                resolve({ status: 200, message: parties });
            }); 
        }else{
            resolve({ status: 200, message:[]});
        }
    });
})

exports.partyUserAttend=(pid)=>new Promise((resolve,reject)=>{
    joinparty.find({pid:pid,status:1},'-_id uid').then(req=>{
        var uid=[];
        if(req.length!=0){
            for(var i=0;i<req.length;i++){
                uid.push(ObjectID(req[i].uid));
            }   
            user.find({"_id":uid}, function (err, users) {
                resolve({ status: 200, message: users });
            }); 
        }else{
            resolve({ status: 200, message:[]});
        }
    });
})

exports.partyUserList=(pid)=>new Promise((resolve,reject)=>{
    joinparty.find({pid:pid},'-_id uid').then(req=>{
        var uid=[];
        if(req.length!=0){
            for(var i=0;i<req.length;i++){
                uid.push(ObjectID(req[i].uid));
            }   
            user.find({"_id":uid}, function (err, users) {
                resolve({ status: 200, message: users });
            }); 
        }else{
            resolve({ status: 200, message:[]});
        }
    });
})

exports.removeUserParty=(pid,uid)=>new Promise((resolve,reject)=>{
    joinparty.findOneAndRemove({pid:pid,uid:uid}, function (err, musics) {
            resolve({ status: 200, message: musics });
    });  
})



exports.getuserparty=(uid)=>new Promise((resolve,reject)=>{
    joinparty.find({uid:uid},'-_id pid').then(req=>{
        var pid=[];
        for(var i=0;i<req.length;i++){
            pid.push(ObjectID(req[i].pid));
        }   
        party.find({"_id": {"$in":pid}}, function (err, parties) {
            resolve({ status: 200, message: parties });
        });
    }); 
})