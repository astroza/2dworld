var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/client'));
app.use(express.static(__dirname + '/shared'));

var free_id = 0;
var max_players = 12;
var players = [];

players[max_players-1] = null;

function get_player_slot() {
	for(i = 0; i < max_players; i++)
		if(players[i] == null)
			return i;
	return null;
}

io.on('connection', function(socket){
	var player_slot = get_player_slot();
	
	console.log('New player: ' + player_slot);
	
	players[player_slot] = {xPos: 0, yPos: 0};
	// Envia el ID asignado al cliente nuevo
	socket.emit('init', player_slot);
	// Envia informacion de los players conectados al nuevo player
	for(i = 0; i < players.length; i++) {
		var player = players[i];
		if(player != null)
			socket.emit('join', {player_id: i, xPos: player.xPos, yPos: player.yPos});
	}
	// Envia información del nuevo player a los players conectados
	socket.broadcast.emit('join', {player_id: player_slot, xPos: 0, yPos: 0});
	
	socket.on('disconnect', function() {
		console.log('Player disconnected: ' + player_slot);
		io.emit('leave', {player_id: player_slot});
		players[player_slot] = null;
	});
	
	socket.on('move', function(move_data) {
		console.log('Player ' + player_slot + ': ' + move_data.xDiff + ' ' + move_data.yDiff);
		var player = players[player_slot];
		if(player != null) {
			var x = player.xPos + move_data.xDiff;

			if(x < 0 || x > 800) {
				move_data.xDiff = 0;
			}
			var y = player.yPos + move_data.yDiff;
			if(y < 0 || y > 600) {
				move_data.yDiff = 0;
			}
			console.log("X Y " + x + ' ' + y);
			if(move_data.xDiff != 0 || move_data.yDiff != 0) {
				io.emit('move', {player_id: player_slot, xDiff: move_data.xDiff, yDiff: move_data.yDiff});
				player.xPos += move_data.xDiff;
				player.yPos += move_data.yDiff;
			}
		}
	});
});

http.listen(3000, function(){
	console.log('2DWorld running on *:3000');
});
