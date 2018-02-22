var GlobalSettings = {
};

var TestGame;

var CWTestInit = function() {
	if(!Detector.webgl) Detector.addGetWebGLMessage();
	
	TestGame = new WebCW.CreeperGame({
		Dimensions: new THREE.Vector3(32, 32, 16),
		Renderer: new WebCW.Modules.Gfx.WebGLRenderer({Container: document.getElementById("container"), addStats: true}),
		InputHandler: new WebCW.BrowserInterface({BlockedKeys: [8, 9, 13, 14, 27, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 45, 46]})
	});
	TestGame.GameObjects.push(new WebCW.Modules.Units.Emitter({Game: TestGame, Position: new THREE.Vector3(1, 1, 1), FlowRate: 300}));
	TestGame.GameObjects.push(new WebCW.Modules.Units.Emitter({Game: TestGame, Position: new THREE.Vector3(1, 1, 6), FlowRate: 100}));
	TestGame.GameObjects.push(new WebCW.Modules.Units.Turret({Game: TestGame, Position: new THREE.Vector3(10, 10, 8), fireTimeout: 0.4, antiPressure: 12500}));
	TestGame.GameObjects.push(new WebCW.Modules.Units.Turret({Game: TestGame, Position: new THREE.Vector3(20, 20, 3), fireTimeout: 0.15, antiPressure: 5000}));
	
	TestGame.ModuleObjects.push(new WebCW.Modules.Control.TrackballCam({Game: TestGame}));
	TestGame.ModuleObjects[0].makeCurrent();
	
	
	TestGame.Renderer.DoRender = false;
	TestGame.UnsafeCode.setupPostproc();
	
	TestGame.Renderer.Loop.Begin();
};


// Check if a new cache is available on page load.
window.addEventListener('load', function(e) {

  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      // Browser downloaded a new app cache.
      // Swap it in and reload the page to get the new hotness.
      window.applicationCache.swapCache();
      if (confirm('A new version of this site is available. Load it?')) {
        window.location.reload();
      }
    } else {
      // Manifest didn't changed. Nothing new to server.
    }
  }, false);

}, false);