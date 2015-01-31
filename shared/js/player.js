var b2d = require('Box2D');
function Player(gameCore, name) {
	this.name = name;
	var bodyDef = new b2d.b2BodyDef;
	bodyDef.type = b2d.b2Body.b2_dynamicBody;
	bodyDef.position.Set(100, 100);
	this.body = gameCore.world.CreateBody(bodyDef);
	
	var dynamicBox = new b2d.b2PolygonShape;
	dynamicBox.SetAsBox(1.0, 1.0);
	
	var fixtureDef = new b2d.b2FixtureDef;
	fixtureDef.shape = dynamicBox;
	fixtureDef.density = 1.0;
	fixtureDef.friction = 0.3;
	
	this.body.CreateFixture(fixtureDef);
}