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
	
	socket.on('input_data', function(input_data) {
		var player = players[player_slot];
		if(player != null) {
			input_data.player_id = player_slot;
			// Falta validar con el physics engine
			io.emit('input_data', input_data);
		}
	});
});

http.listen(3000, function(){
	console.log('2DWorld running on *:3000');
});
