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
var server=app.listen(port,ip);

var io=socket(server);

const chat=require('../functions/partychat');
const stepcount=require('../functions/stepcount');
var d=new Date();
io.on('connection',function(socket){
	console.log("made socket connection");

 	var addedUser = false;
	var connectedUsers = 0;
	
	socket.on('chat',function(data){
		data.time=d.toString();
		io.emit('chat',data);
		chat.sendmsg(data.username,data.uniqueId,data.message,data.partyid);
	});

	socket.on('user',function(data){
		socket.username = data;
		console.log(data);
		stepcount.attemptparty(data.pid,data.uid);
		io.emit('user',data);
	});

	socket.on('count',function(data){
		stepcount.stepsend(data.pid,data.uid,data.name,data.count);
		io.sockets.emit('count',data);
	});

	socket.on('PlaySong',function(data){
		console.log(data);
		io.sockets.emit('PlaySong',data);
	});
	
	socket.on('PlayPause',function(data){
		console.log(data);
		io.sockets.emit('PlayPause',data);
	});

});
console.log(`flashmob App is Running on ${port} ${ip} `);