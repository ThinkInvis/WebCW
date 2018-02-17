if(isUndef(WebCW.Modules.Units)) WebCW.Modules.Units = {};

WebCW.Modules.Units.Turret = function(args) {
	var _this = this;
	_this.RequiredArgs = ["Game", "Position"];
	_this.DefaultArgs = {
		Range: 8,
		fireTimeout: 0.5,
		antiPressure: 150
	};
	initArgs(_this, args);

	_this.PosInd = _this.Game.Vec3ToIndex(_this.Position);

	_this.fireAccum = 0;

	_this.targetsList = [];

	_this.buildTargetsList = function() {
		var tqlastdist = 0;
		_this.targetsList = [];

		//TODO: "fire-at-highest-concentration" mode
		for(var i = -_this.Range; i <= _this.Range; i++) {
			for(var j = -_this.Range; j <= _this.Range; j++) {
				for(var k = -_this.Range; k <= _this.Range; k++) {
					var ii = i+_this.Position.x;
					var jj = j+_this.Position.y;
					var kk = k+_this.Position.z;
					if(ii < _this.Game.Dimensions.x && ii >= 0 && jj < _this.Game.Dimensions.y && jj >= 0 && kk < _this.Game.Dimensions.z && kk >= 0) {
						var pdist = Math.sqrt(i*i+j*j+k*k);
						if(pdist < _this.Range) {
							var icoord = new THREE.Vector3(ii,jj,kk);
							_this.targetsList.push([pdist, _this.Game.Vec3ToIndex(icoord), _this.isTgtOccluded(icoord), icoord]);
						}
					}
				}	
			}	
		}
		_this.targetsList.sort(function(a,b) {return b.pdist - a.pdist;});
	};

	_this.isTgtOccluded = function(tgtpos) {
		var inds = _this.Game.GetLine(_this.Position, tgtpos);
		for(var i = 0; i < inds.length; i++) {
			for(var j = 0; j < _this.Game.Substances.length; j++) {
				if(_this.Game.Substances[j].BlocksTurrets) {
					if(_this.Game.Val[j][inds[i]] > 0) return true;
				}
			}
		}
		return false;
	};

	_this.OnPreUpdate = function(gt, dt, larg) {
		
	};

	_this.tgtIncrement = 0;

	_this.OnPostUpdate = function(gt,dt,larg) {
		if(!_this.InitComplete) return;
		_this.fireAccum = Math.max(_this.fireAccum - dt, 0);
		if(_this.fireAccum < _this.fireTimeout/2) _this.FiringTracer.visible = false;
		
		var fireAmt = (_this.fireTimeout-_this.fireAccum)/_this.fireTimeout;
		
		var closest = _this.Range + 1;
		var tgts = [];
		var tgti=0;
		for(var i = 0; i < _this.targetsList.length; i++) {
			if(_this.Game.Dirty[_this.targetsList[i][1]]) {
				_this.targetsList[i][2] = _this.isTgtOccluded(_this.targetsList[i][3]);
				if(!_this.targetsList[i][2] && _this.Game.Val[_this.Game.SubstanceIDIndex["Creeper"]][_this.targetsList[i][1]] > 0) {
					if(_this.targetsList[i][0] <= closest) {
						closest = _this.targetsList[i][0];
						tgts.push(_this.targetsList[i]);
					}
				}
			}
		}
		//_this.Mesh.rotation.z += Math.pow(fireAmt,8)*dt*Math.PI*2;
		_this.Mat.color.setRGB(1-fireAmt, fireAmt, 0);

		if(tgts.length > 0 && _this.fireAccum <= 0) {
			_this.tgtIncrement++;
			var tgt = tgts[_this.tgtIncrement%(tgts.length)];
			var tgti = tgt[1];
			var tgtp = _this.Game.IndexToCoord(tgti);
			//_this.Mesh.lookAt(_this.Game.IndexToVec3(tgti));
			_this.Mesh.children[0].children[0].rotation.z = Math.atan2(tgtp[1]-_this.Position.y, tgtp[0]-_this.Position.x)-Math.PI/2;
			_this.fireAccum = _this.fireTimeout;
			
			_this.Game.Val[_this.Game.SubstanceIDIndex["Explosion"]][tgti] += _this.antiPressure;
			_this.Game.ValOoP[_this.Game.SubstanceIDIndex["Explosion"]][tgti] += _this.antiPressure;
			_this.FiringTracer.visible = true;
			_this.FiringTracer.setLength(tgt[0]);
		}
	};
	
	_this.ExpandHitbox = [0, 0, 0, 0, 0, 1];
	
	//_this.Geom = new THREE.BoxGeometry(0.5, 0.5, 0.5);
	_this.Mat = new THREE.MeshBasicMaterial({color: 0x00FF00, wireframe: false});
	_this.BaseMat = new THREE.MeshBasicMaterial({color: 0xaaaaaa, wireframe: false});
	//_this.Mesh = new THREE.Mesh(_this.Geom, _this.Mat);
	//_this.Game.Renderer.Scene.add(_this.Mesh);
	//_this.Mesh.position.copy(_this.Position);
	
	_this.InitComplete = false;
	_this.Game.UnsafeCode.FBXLoader.load( './WebCW/Models/Turret.fbx', function ( object ) {
		_this.Mesh = object;
		object.position.copy(_this.Position);
		object.scale.set(0.01, 0.01, 0.01);
		object.children[0].material = _this.BaseMat;
		object.children[0].children[0].children[1].material = _this.BaseMat;
		object.children[0].children[0].children[0].children[0].children[0].material = _this.Mat;
		object.material = _this.Mat;
		_this.Game.Renderer.Scene.add( object );
		_this.FiringTracer = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), _this.Range, 0xFF0000);
		_this.Mesh.add(_this.FiringTracer);
		_this.InitComplete = true;
	}, function() {}, function(err) {
		console.log(err);
	}	);

	_this.buildTargetsList();

	_this.OnDraw = function(gfx) {
	};
};