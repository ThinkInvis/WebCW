estabObjPath("WebCW.Modules.Control");

WebCW.Modules.Control.TrackballCam = function(args) {
	var _this = this;
	_this.RequiredArgs = ["Game"];
	_this.DefaultArgs = {
		FoV: 90,
		Near: 0.1,
		Far: 500,
		Dist: 5,
		InitialTarget: new THREE.Vector3(0, 0, 0)
	};
	initArgs(_this, args);
	
	//if(!isDef(_this.Game.Gfx)) _this.Game.Gfx = {};
	if(isUndef(_this.Game.Renderer)) {
		throw("A CreeperGame.Modules.Control.TrackballCam was added to a non-CreeperGame object, or added before any compatible Graphics module was added!");
		return;
	}
	
	_this.CtxElem = _this.Game.Renderer.Context.domElement;
	_this.Camera = new THREE.PerspectiveCamera(_this.FoV, _this.Game.Renderer.ViewportWidth/_this.Game.Renderer.ViewportHeight, _this.Near, _this.Far);
	_this.Camera.position.z = _this.Dist;
	_this.Ctrl = new THREE.TrackballControls(_this.Camera, _this.CtxElem);
	_this.Game.Renderer.Scene.add(_this.Camera);
		
	_this.Ctrl.rotateSpeed = 3.0;
	_this.Ctrl.zoomSpeed = 2.0;
	_this.Ctrl.panSpeed = 0.8;
	_this.Ctrl.noZoom = false;
	_this.Ctrl.noPan = false;
	_this.Ctrl.staticMoving = true;
	_this.Ctrl.dynamicDampingFactor = 0.3;
	_this.Ctrl.keys = [65, 83, 68];
	_this.Ctrl.target.copy(_this.InitialTarget);
		//_this.Ctrl.target.x = gsize.x/2 - 0.5;
		//_this.Ctrl.target.y = gsize.y/2 - 0.5;
		//_this.Ctrl.target.z = gsize.z/2 - 0.5;
	window.addEventListener( 'resize', function() {
		_this.Ctrl.handleResize();
		_this.Camera.aspect = _this.Game.Renderer.ViewportWidth / _this.Game.Renderer.ViewportHeight;
		_this.Camera.updateProjectionMatrix();
		//_this.CtxElem.setSize( _this.Gfx.Container.innerWidth, _this.Gfx.Container.innerHeight );
	});
	
	_this.makeCurrent = function() {
		_this.Game.Renderer.CurrentCamera = _this.Camera;
	};
	
	_this.Game.Renderer.DrawCalls.push(_this.Ctrl.update);
};