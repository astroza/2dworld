var xVel = 5;
var yVel = 5;

function Player(dWorld, x, y)  {
	var texture = PIXI.Texture.fromImage("/img/player.png");
	var sprite = new PIXI.Sprite(texture);
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.5;
	sprite.position.x = x;
	sprite.position.y = y;
	
	dWorld.stage.addChild(sprite);
	this.sprite = sprite;
	this.dWorld = dWorld;
}

Player.prototype.destroy = function() {
	this.dWorld.stage.removeChild(this.sprite);
}

function DWorld(htmlElement) {
	this.stage = new PIXI.Stage(0x66FF99);
	this.renderer = new PIXI.WebGLRenderer(800, 600);
	this.players = [];
	this.meId = null;
	

	log('Initializing 2DWorld, a Unethical Corp. game');

	htmlElement.appendChild(this.renderer.view);
	requestAnimFrame(animate);
	this.socket = io();
	
	log('Running..');
	window.addEventListener('keydown', this.keyDown.bind(this), true);
	var _dWorld = this;
	function animate() {
		requestAnimFrame(animate);
	    _dWorld.renderer.render(_dWorld.stage);
	}
	
	this.socket.on('init', function(playerId) {
		_dWorld.meId = playerId;
		console.log("meId: " + playerId);
	});
	
	this.socket.on('join', function(playerInfo) {
		_dWorld.players[playerInfo.player_id] = new Player(_dWorld, playerInfo.xPos, playerInfo.yPos);
		log('Player ' + playerInfo.player_id + ' has joined the game');
	});
	
	this.socket.on('leave', function(playerInfo) {
		log('Player ' + playerInfo.player_id + ' has left the game');
		var player = _dWorld.players[playerInfo.player_id];
		player.destroy();
		_dWorld.players[playerInfo.player_id] = null;
	});
	
	this.socket.on('move', function(move_data) {
		var player = _dWorld.players[move_data.player_id];
		if(player) {
			player.sprite.position.x += move_data.xDiff;
			player.sprite.position.y += move_data.yDiff;
		}
	});
}

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
