
Player.prototype.destroy = function() {
	// this.dWorld.stage.removeChild(this.sprite);
}

function DWorld(htmlElement) {
	this.meId = null;
	var gameCore = new GameCore();
	gameCore.setRenderer(new Renderer(htmlElement));
	
	log('Initializing 2DWorld, a Unethical Corp. game');

	this.socket = io();
	
	log('Running..');
	window.addEventListener('keydown', this.keyDown.bind(this), true);
	var _dWorld = this;
	
	this.socket.on('init', function(playerId) {
		_dWorld.meId = playerId;
		console.log("meId: " + playerId);
	});
	
	this.socket.on('join', function(playerInfo) {
		gameCore.createPlayer(playerInfo.player_id, 0, 0);
		log('Player ' + playerInfo.player_id + ' has joined the game');
	});
	
	this.socket.on('leave', function(playerInfo) {
		log('Player ' + playerInfo.player_id + ' has left the game');
		gameCore.destroyPlayer(playerInfo.player_id);
	});
	
	this.socket.on('input_data', function(input_data) {
		var player = gameCore.players[input_data.player_id];
		var center = player.body.GetWorldCenter();
		var lastInputTime = player.lastInputTime || 0;
		
		var now = input_data.time;
		if(now - lastInputTime >= 2000) {
			player.body.SetPositionAndAngle({x: input_data.position.x, y: input_data.position.y}, input_data.angle);
			player.lastInputTime = now;
		}
		
		player.body.ApplyImpulse({x: input_data.x_impulse, y: input_data.y_impulse}, center);
	});
	
	this.gameCore = gameCore;
	this.map = new Map(gameCore);
}

DWorld.prototype.init = function() {
	this.gameCore.init();
};

DWorld.prototype.keyDown = function(evt) {
	if(this.meId == null) {
		console.log('meId is null');
		return;
	}
	
	var impulse = 500;
	var xImp = 0;
	var yImp = 0;
	
	switch (evt.keyCode) {
		case 38:  /* Up arrow was pressed */
			yImp = impulse;
			break;
		case 40:  /* Down arrow was pressed */
			yImp = -impulse;
			break;
		case 37:  /* Left arrow was pressed */
			xImp = -impulse;
			break;
		case 39:  /* Right arrow was pressed */
			xImp = impulse;
			break;
	}
	var player = this.gameCore.players[this.meId];
	this.socket.emit('input_data', {x_impulse: xImp, y_impulse: yImp, position: player.body.GetPosition(), angle: player.body.GetAngle(),  time: Date.now()});
}
