'use strict';
const config = require('../config/config.json');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var mongoURL = process.env.MONGOLAB_URI || config.mongourl;
//const db_name = "Flashmob";


const partyMusic = mongoose.Schema({
    pid             : String,
    music           : String,
    name 			: String,
    mtime		    : String,
	uid 			: String,
	like            : Number,
	dislike         : Number,   
});
mongoose.Promise = global.Promise;

console.log("mongourl :::",mongoURL)
mongoose.connect(mongoURL,{ useNewUrlParser: true });
module.exports = mongoose.model('partyMusic', partyMusic);