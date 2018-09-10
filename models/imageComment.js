'use strict';
const config = require('../config/config.json');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var mongoURL = process.env.MONGOLAB_URI || config.mongourl;
//const db_name = "Flashmob";


const imageComment = mongoose.Schema({
    img_id          : String,
    name 			: String,
    comment			: String,
    ctime		    : String
});
mongoose.Promise = global.Promise;

console.log("mongourl :::",mongoURL)
mongoose.connect(mongoURL,{ useNewUrlParser: true });
module.exports = mongoose.model('imageComment', imageComment);