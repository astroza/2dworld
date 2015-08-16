function GameCore(maxPlayers) {
	var _maxPlayers = maxPlayers || 16;
	this.world = new b2d.b2World(
		new b2d.b2Vec2(0, -10), // gravity
		true                // dosleep
	);
	this.players = [];
	this.players[maxPlayers-1] = null;
	this.velocityIterations = 10;
	this.positionIterations = 10;
	this.timeStep = 1/30.0;
	this.renderer = null;
}

GameCore.prototype.setRenderer = function(renderer) {
	this.renderer = renderer;
}

GameCore.prototype.digestInput = function(playerId, data) {
	
}

GameCore.prototype.createPlayer = function(playerId, x, y) {
	var player = new Player(this, 'Player ' + playerId);
	player.body.SetPositionAndAngle({x: x, y: y}, 0);
	this.players[playerId] = player;
	if(this.renderer)
		this.renderer.createPlayer(player);
	
}

GameCore.prototype.destroyPlayer = function(playerId, x, y) {
	this.players[playerId] = null;
}

GameCore.prototype.tick = function() {
	if(this.renderer) {
		for(i = 0; i < this.players.length; i++) {
			var player = this.players[i];
			if(this.renderer)
				this.renderer.updatePlayer(player);
		}
		if(this.renderer)
			this.renderer.render();
	}
	this.world.Step(this.timeStep, this.velocityIterations, this.positionIterations);
	this.world.ClearForces();
}

GameCore.prototype.init = function() {
	var gameCore = this;
	setInterval(function() {
		gameCore.tick();
	}, 1000/60.0);
};

module.exports = GameCore;
