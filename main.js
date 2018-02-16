var GlobalSettings = {
};

var TestGame;

var CWTestInit = function() {
	TestGame = new WebCW.CreeperGame({Dimensions: new THREE.Vector3(32, 32, 16), Renderer: new WebCW.CreeperGame.Modules.Gfx.WebGLRenderer({Container: document.getElementById("container")})});
	TestGame.GameObjects.push(new WebCW.CreeperGame.Modules.Units.Emitter({Game: TestGame, Position: new THREE.Vector3(1, 1, 1), FlowRate: 200}));
	TestGame.GameObjects.push(new WebCW.CreeperGame.Modules.Units.Emitter({Game: TestGame, Position: new THREE.Vector3(1, 1, 6), FlowRate: 150}));
	TestGame.GameObjects.push(new WebCW.CreeperGame.Modules.Units.Turret({Game: TestGame, Position: new THREE.Vector3(10, 10, 8)}));
	TestGame.GameObjects.push(new WebCW.CreeperGame.Modules.Units.Turret({Game: TestGame, Position: new THREE.Vector3(20, 20, 3)}));
	TestGame.GameObjects[3].fireTimeout = 0.15;
	TestGame.GameObjects[3].antiPressure = 10;
	
	TestGame.ModuleObjects.push(new WebCW.CreeperGame.Modules.Control.TrackballCam({Game: TestGame}));
	TestGame.ModuleObjects[0].makeCurrent();
	TestGame.Renderer.Loop.Begin();
};
