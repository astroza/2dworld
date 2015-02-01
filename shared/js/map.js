function Map(gameCore) {
	var bxFixDef	= new b2d.b2FixtureDef();	// box  fixture definition
	bxFixDef.shape	= new b2d.b2PolygonShape();
	var blFixDef	= new b2d.b2FixtureDef();	// ball fixture definition
	blFixDef.shape	= new b2d.b2CircleShape();
	bxFixDef.density	= blFixDef.density = 1;

	var bodyDef = new b2d.b2BodyDef();
	bodyDef.type = b2d.b2Body.b2_staticBody;

	// create ground
	bxFixDef.shape.SetAsBox(80, 0.1);
	bodyDef.position.Set(0, 0);
	gameCore.world.CreateBody(bodyDef).CreateFixture(bxFixDef);

	//bxFixDef.shape.SetAsBox(1, 100);
	// left wall
	//bodyDef.position.Set(-1, 3);
	//gameCore.world.CreateBody(bodyDef).CreateFixture(bxFixDef);
	// right wall
	//bodyDef.position.Set(stage.stageWidth/100 + 1, 3);
	//gameCore.world.CreateBody(bodyDef).CreateFixture(bxFixDef);
	
}