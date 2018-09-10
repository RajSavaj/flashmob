'use strict';
const config = require('../config/config.json');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var mongoURL = process.env.MONGOLAB_URI || config.mongourl;
//const db_name = "Flashmob";


const partySchema = mongoose.Schema({
    cname           : String,
    email           : String,
    pname 			: String,
    ptime			: String,
    pdate 			: Date,
    location 		: String,
    flag            : Number,
    pepole 			: Number,
    lati            : String,
    lang            : String,
    city            : String,
    created_at		: String
});
mongoose.Promise = global.Promise;

console.log("mongourl :::",mongoURL)
mongoose.connect(mongoURL,{ useNewUrlParser: true });
module.exports = mongoose.model('party', partySchema);