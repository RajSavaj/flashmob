'use strict';

const config = require('../config/config.json');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoURL = process.env.MONGOLAB_URI || config.mongourl;
//const db_name = "Flashmob";
//mongodb://rajsavaj:savaj123@ds121382.mlab.com:21382/flashmob    Live url
const chatSchema = mongoose.Schema({
    name 			: String,
    sid			    : String,
    msg          	: String,
    pid           	: String,
    created_at		: String,
});


mongoose.Promise = global.Promise;

console.log("mongourl :::",mongoURL)
mongoose.connect(mongoURL,{ useNewUrlParser: true });

module.exports = mongoose.model('partychat', chatSchema);