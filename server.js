var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public', 'public'));

var free_id = 0;
var players = [];

io.on('connection', function(socket){
	var user_id = ++free_id;
	// Bug: Se producen 2 o mas connection por cliente
	
	console.log('New player: ' + user_id);
	
	players[user_id] = {xPos: 0, yPos: 0};
	// Envia el ID asignado al cliente nuevo
	socket.emit('init', user_id);
	// Informa sobre su existencia y la existencia del resto (si hay)
	for(i = 0; i < players.length; i++) {
		var player = players[i];
		if(player != null)
			io.emit('join', {player_id: user_id, xPos: player.xPos, yPos: player.yPos});
	}
	
	socket.on('move', function(move_data) {
		console.log('Player ' + user_id + ': ' + move_data);
		var player = players[user_id];
		if(player != null) {
			player.xPos += move_data.xDiff;
			player.yPos += move_data.yDiff;
			io.emit('move', {player_id: user_id, xDiff: move_data.xDiff, yDiff: move_data.yDiff});
		}
	});
});

http.listen(3000, function(){
	console.log('2DWorld running on *:3000');
});
