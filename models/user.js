'use strict';

const config = require('../config/config.json');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var mongoURL = process.env.MONGOLAB_URI || config.mongourl;
//const db_name = "Flashmob";
//mongodb://rajsavaj:savaj123@ds121382.mlab.com:21382/flashmob    Live url
const userSchema = mongoose.Schema({ 

	name 			: String,
	email			: String,
	age 			: Number,
	city 			: String,
	image           : String,
    hashed_password	: String,
	created_at		: String,
	temp_password	: String,
	temp_password_time: String

});


mongoose.Promise = global.Promise;

console.log("mongourl :::",mongoURL)
mongoose.connect(mongoURL,{ useNewUrlParser: true });

module.exports = mongoose.model('user', userSchema);