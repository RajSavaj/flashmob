'use strict';
const config = require('../config/config.json');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var mongoURL = process.env.MONGOLAB_URI || config.mongourl;
//const db_name = "Flashmob";

const stepcount = mongoose.Schema({
    pid             : String,
    uid           	: String,
    count 			: Number,
    mtime		    : String 
});

mongoose.Promise = global.Promise;
console.log("mongourl :::",mongoURL)
mongoose.connect(mongoURL,{ useNewUrlParser: true });
module.exports = mongoose.model('stepcount', stepcount);