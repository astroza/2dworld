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
}

function DWorld(htmlElement) {
	this.stage = new PIXI.Stage(0x66FF99);
	this.renderer = new PIXI.WebGLRenderer(800, 600);
	this.players = [];
	this.me_id = null;
	

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
	
	this.socket.on('init', function(player_id) {
		_dWorld.me_id = player_id;
		console.log("me_id: " + player_id);
	});
	
	this.socket.on('join', function(player_config) {
		_dWorld.players[player_config.player_id] = new Player(_dWorld, player_config.xPos, player_config.yPos);
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
	if(this.me_id == null) {
		console.log('me_id is null');
		return;
	}
	
	var sprite = this.players[this.me_id].sprite;
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
