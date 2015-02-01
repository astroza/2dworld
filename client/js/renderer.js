/* 1 metro es 10 pixeles
 */
function Renderer(parentElement) {
	this.stage = new PIXI.Stage(0x66FF99);
	this.glRenderer = new PIXI.WebGLRenderer(800, 600);
	
	parentElement.appendChild(this.glRenderer.view);
}

Renderer.prototype.createPlayer = function(player) {
	var texture = PIXI.Texture.fromImage("/img/player.png");
	var sprite = new PIXI.Sprite(texture);
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.5;
	var pos = player.body.GetPosition();
	sprite.position.x = 10 * pos.x;
	sprite.position.y = 600 - 10*pos.y;
	
	this.stage.addChild(sprite);
	player.sprite = sprite;
};

Renderer.prototype.updatePlayer = function(player) {
	var pos = player.body.GetPosition();
	player.sprite.position.x = 10 * pos.x;
	player.sprite.position.y = 600 - 10 * pos.y;
	player.sprite.rotation = player.body.GetAngle();
	//player.body.ApplyForce({x: 0, y: 1}, {x: 1.5, y: 1.9});
};

Renderer.prototype.render = function() {
	this.glRenderer.render(this.stage);
};