if(isUndef(WebCW.CreeperGame.Modules.Units)) WebCW.CreeperGame.Modules.Units = {};

WebCW.CreeperGame.Modules.Units.Turret = function(args) {
	var _this = this;
	_this.RequiredArgs = ["Game", "Position"];
	initArgs(_this, args);
	
	_this.PosInd = _this.Game.Vec3ToIndex(_this.Position);
	
	_this.Range = 8;
	
	_this.fireTimeout = 0.5;
	_this.fireAccum = 0;
	_this.antiPressure = 150;
	_this.apFalloff = 3;
	
	_this.targetsList = [];
	//_this.tQtyAtDist = {};
	
	_this.buildTargetsList = function() {
		var tqlastdist = 0;
		_this.targetsList = [];
		//_this.tQtyAtDist = {};
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
							//if(isUndef(_this.tQtyAtDist[pdist])) _this.tQtyAtDist[pdist] = 1;
							//else _this.tQtyAtDist[pdist] ++;
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
			if(_this.Game.IsSolidIndex[_this.Game.Type[inds[i]]] == 1) return true;
		}
		return false;
	};
	
	_this.OnPreUpdate = function(gt, dt, larg) {
		
	};
	
	_this.tgtIncrement = 0;
	
	_this.OnPostUpdate = function(gt,dt,larg) {
		_this.fireAccum = Math.max(_this.fireAccum - dt, 0);
		if(_this.fireAccum < _this.fireTimeout/2) _this.FiringTracer.visible = false;
		
		var fireAmt = (_this.fireTimeout-_this.fireAccum)/_this.fireTimeout;
		
		var closest = _this.Range + 1;
		var tgts = [];
		var tgti=0;
		for(var i = 0; i < _this.targetsList.length; i++) {
			if(_this.Game.Dirty[_this.targetsList[i][1]]) {
				//if(_this.debugT) console.log("Turret detected dirty target");
				_this.targetsList[i][2] = _this.isTgtOccluded(_this.targetsList[i][3]);
				if(!_this.targetsList[i][2] && _this.Game.Type[_this.targetsList[i][1]] == 3) {
					if(_this.targetsList[i][0] <= closest) {
						closest = _this.targetsList[i][0];
						tgts.push(_this.targetsList[i]);
					}
				}
			}
		}
		_this.Mesh.rotation.z += Math.pow(fireAmt,8)*dt*Math.PI*2;
		_this.Mat.color.setRGB(1-fireAmt, fireAmt, 0);
		
		if(tgts.length > 0 && _this.fireAccum <= 0) {
			_this.tgtIncrement++;
			var tgt = tgts[_this.tgtIncrement%(tgts.length)];
			var tgti = tgt[1];
			var tgtp = _this.Game.IndexToCoord(tgti);
			_this.Mesh.lookAt(_this.Game.IndexToVec3(tgti));
			_this.fireAccum = _this.fireTimeout;
			var pressureLeft = _this.antiPressure;
			
			var pSub = Math.max(_this.Game.ValOoP[tgti]-_this.antiPressure,0);
			pressureLeft -= pSub;
			_this.Game.ValOoP[tgti] -= pSub;
			if(pressureLeft > 0) {
				_this.Game.TypeOoP[tgti] = _this.Game.TypeIndex.indexOf("Explosion");
				_this.Game.ValOoP[tgti] = pressureLeft;
			}
			//pressureLeft -= _this.apFalloff;
			
			_this.FiringTracer.visible = true;
			_this.FiringTracer.setLength(tgt[0]);
			
			//TODO: expand explosion
			
			/*var nbi = [tgti];
			while(pressureLeft > 0) {
				var ttlStagePressure = 0;
				var validnbi = [];
				for(var i = 0; i < nbs.length; i++) {
					if(_this.Game.Type[_this.nbi[i]] == 3) {
						ttlStagePressure += _this.Game.Val;
						validnbi.push(tgti+1);
						validnbi.push(tgti-1);
						validnbi.push(tgti+_this.Game.Dimensions.x);
						validnbi.push(tgti-_this.Game.Dimensions.x);
						validnbi.push(tgti+_this.Game.LayerSize);
						validnbi.push(tgti-_this.Game.LayerSize);
					}
				}
				_this.Game.ValOoP[
			}*/
		}
	};
	
	_this.Geom = new THREE.BoxGeometry(0.5, 0.5, 0.5);
	_this.Mat = new THREE.MeshBasicMaterial({color: 0x00FF00, wireframe: false});
	_this.Mesh = new THREE.Mesh(_this.Geom, _this.Mat);
	_this.Game.Renderer.Scene.add(_this.Mesh);
	_this.Mesh.position.copy(_this.Position);
	
	_this.FiringTracer = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), _this.Range, 0xFF0000);
	_this.Mesh.add(_this.FiringTracer);
	//_this.TracerGeom = [];
	
	/*for(var i = 0; i < _this.tgtSubframe; i++) {
	_this.TracerGeom[i] = new THREE.ArrowHelper(SphrLookup(0, 0), _this.Position, _this.Range);
	_this.Game.Renderer.Scene.add(_this.TracerGeom[i]);
	}*/
	
	_this.buildTargetsList();
	
	_this.OnDraw = function(gfx) {
		//_this.Mesh.rotation.set(_this.Game.GameTime/2, _this.Game.GameTime, _this.Game.GameTime/3);
	};
};