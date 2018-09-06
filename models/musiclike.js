'use strict';
const config = require('../config/config.json');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var mongoURL = process.env.MONGOLAB_URI || config.mongourl;
//const db_name = "Flashmob";

const musiclike = mongoose.Schema({
    pid             : String,
    uid           	: String,
    mid 			: String,
    like		    : Number //1 DisLike 0 For like
});

mongoose.Promise = global.Promise;
console.log("mongourl :::",mongoURL)
mongoose.connect(mongoURL,{ useNewUrlParser: true });
module.exports = mongoose.model('musiclike', musiclike);