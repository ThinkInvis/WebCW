var GlobalSettings = {
};

var TestGame;

var CWTestInit = function() {
	if(!Detector.webgl) Detector.addGetWebGLMessage();
	
	TestGame = new WebCW.CreeperGame({Dimensions: new THREE.Vector3(32, 32, 16), Renderer: new WebCW.Modules.Gfx.WebGLRenderer({Container: document.getElementById("container"), addStats: true})});
	TestGame.GameObjects.push(new WebCW.Modules.Units.Emitter({Game: TestGame, Position: new THREE.Vector3(1, 1, 1), FlowRate: 300}));
	TestGame.GameObjects.push(new WebCW.Modules.Units.Emitter({Game: TestGame, Position: new THREE.Vector3(1, 1, 6), FlowRate: 100}));
	TestGame.GameObjects.push(new WebCW.Modules.Units.Turret({Game: TestGame, Position: new THREE.Vector3(10, 10, 8), fireTimeout: 0.4, antiPressure: 12500}));
	TestGame.GameObjects.push(new WebCW.Modules.Units.Turret({Game: TestGame, Position: new THREE.Vector3(20, 20, 3), fireTimeout: 0.15, antiPressure: 5000}));
	
	TestGame.ModuleObjects.push(new WebCW.Modules.Control.TrackballCam({Game: TestGame}));
	TestGame.ModuleObjects[0].makeCurrent();
	
	TestGame.Renderer.Loop.Begin();
};