var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
GLOBAL.b2d = require('./shared/js/Box2D.js');
GLOBAL.Player = require('./shared/js/player.js');
GLOBAL.GameCore = require('./shared/js/game_core.js');
GLOBAL.Map = require('./shared/js/map.js');

app.use(express.static(__dirname + '/client'));
app.use(express.static(__dirname + '/shared'));

var free_id = 0;
var max_players = 12;
var players = [];

players[max_players-1] = null;
var gameCore = new GameCore();
var map = new Map(gameCore);

function get_player_slot() {
	for(i = 0; i < max_players; i++)
		if(players[i] == null) {
			players[i] = true;
			return i;
		}
	return null;
}

function PlayerState(player) {
	this.position = player.body.GetPosition();
	this.angle = player.body.GetAngle();
	this.player_id = player.player_id;
	console.log(this);
	return this;
}

io.on('connection', function(socket){
	var player_slot = get_player_slot();
	
	console.log('New player: ' + player_slot);
	gameCore.createPlayer(player_slot, 30, 60);
	gameCore.players[player_slot].player_id = player_slot;

	// Envia el ID asignado al cliente nuevo
	socket.emit('init', player_slot);
	// Envia informacion de los players conectados al nuevo player
	for(i = 0; i < max_players; i++) {
		var player = gameCore.players[i];
		if(player != null) {
			socket.emit('join', new PlayerState(player));
		}
	}
	// Envia información del nuevo player a los players conectados
	socket.broadcast.emit('join', new PlayerState(gameCore.players[player_slot]));
	
	socket.on('disconnect', function() {
		console.log('Player disconnected: ' + player_slot);
		io.emit('leave', {player_id: player_slot});
		gameCore.players[player_slot] = null;
		players[player_slot] = null;
	});
	
	socket.on('input_data', function(input_data) {
		var player = gameCore.players[player_slot];
		if(player != null) {
			input_data.player_id = player_slot;
			console.log({x: input_data.position.x, y: input_data.position.y});
			player.body.SetPositionAndAngle({x: input_data.position.x, y: input_data.position.y}, input_data.angle);
			console.log("GP ", player.body.GetPosition());
			// Falta validar con el physics engine
			io.emit('input_data', input_data);
		}
	});
});

http.listen(3000, function(){
	console.log('2DWorld running on *:3000');
	gameCore.init();
});
