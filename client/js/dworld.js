var xVel = 5;
var yVel = 5;

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
	
	this.socket.on('move', function(move_data) {
	});
	
	this.gameCore = gameCore;
}

DWorld.prototype.init = function() {
	this.gameCore.init();
};

DWorld.prototype.keyDown = function(evt) {
	if(this.meId == null) {
		console.log('meId is null');
		return;
	}
	
	var sprite = this.players[this.meId].sprite;
	var xDiff = 0; 
	var yDiff = 0;
	switch (evt.keyCode) {
		case 38:  /* Up arrow was pressed */
			yDiff = -yVel;
		break;
		case 40:  /* Down arrow was pressed */
			yDiff = yVel;
		break;
		case 37:  /* Left arrow was pressed */
			xDiff = -xVel;
		break;
		case 39:  /* Right arrow was pressed */
			xDiff = xVel;
		break;
	}
	this.socket.emit('move', {xDiff: xDiff, yDiff: yDiff});
}
