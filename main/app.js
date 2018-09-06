'use strict';

const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const logger 	 = require('morgan');
const router     = express.Router();
const socket 	 = require('socket.io');
var path = require('path');

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
console.log("router"+router);

require('./routes')(router);
app.use('/api/v1', router);
app.use(express.static('public'));
var server=app.listen("https://flashmobapp.herokuapp.com/");

var io=socket(server);

const chat=require('../functions/partychat');
const stepcount=require('../functions/stepcount');
var d=new Date();
io.on('connection',function(socket){
	console.log("made socket connection");
	socket.on('chat',function(data){
		data.time=d.toString();
		io.sockets.emit('chat',data);
		chat.sendmsg(data.username,data.uniqueId,data.message,data.partyid);
	});

	socket.on('user',function(data){
		io.sockets.emit('user',data);
	});

	socket.on('count',function(data){
		stepcount.stepsend(data.pid,data.uid,data.count);
		io.sockets.emit('count',data);
	});
});
console.log(`flashmob App is Running on ${port} ${ip} `);