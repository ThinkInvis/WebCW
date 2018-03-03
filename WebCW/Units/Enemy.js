estabObjPath("WebCW.Modules.Units");

WebCW.Modules.Units.Emitter = function(args) {
	var _this = this;
	_this.RequiredArgs = ["Game", "Position"];
	_this.OptionalArgs = {
		FlowRate: 0.1
	};
	initArgs(_this, args);
	
	_this.PosInd = _this.Game.Vec3ToIndex(_this.Position);
	
	_this.OnPreUpdate = function(gt,dt,larg) {
		_this.Game.Val[_this.Game.SubstanceIDIndex["Creeper"]][_this.PosInd] += _this.FlowRate * dt;
		_this.Game.ValBuf[_this.Game.SubstanceIDIndex["Creeper"]][_this.PosInd] += _this.FlowRate * dt;
	};
	_this.OnPostUpdate = function(gt,dt,larg) {
		
	};
	_this.Geom = new THREE.CubeGeometry(0.5, 0.5, 0.5);
	_this.Mat = new THREE.MeshBasicMaterial({color: 0xFF0000, wireframe: false});
	_this.Mesh = new THREE.Mesh(_this.Geom, _this.Mat);
	_this.Game.Renderer.Scene.add(_this.Mesh);
	_this.Mesh.position.copy(_this.Position);
	_this.OnDraw = function(gfx) {
		_this.Mesh.rotation.set(_this.Game.GameTime/2, _this.Game.GameTime, _this.Game.GameTime/3);
	};
};