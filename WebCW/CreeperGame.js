var WebCW = {};
WebCW.Units = {};

WebCW.UnsafeCode = function(attachto) {
	var _this = this;
	_this.Game = attachto;
	//////This is stuff that needs to be moved to its own module but I wanted it NOOOOOOooowwwww
	//Actually partially gave up on keeping this together, so just watch for bad coding practices
	
	_this.VoxelRenderer = new WebCW.CreeperGame.Modules.Gfx.VoxelRenderer({Game: _this.Game, ChunkSize: new THREE.Vector3(16, 16, 16)});
	
	_this.VRaycastInd = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0x00ccff, transparent: true, opacity: 0.75}));
	_this.Game.Renderer.Scene.add(_this.VRaycastInd);
	
	////Input Handling
	_this.KeyDownFns = [];
	_this.KeyUpFns = [];
	_this.KeyHoldFns = [];
	_this.MouseMoveFns = [];
	
	_this.KeyDownArr = {};
	_this.KeysToProcess = [];
	_this.KeyHoldDuration = {};
	
	_this.MouseMoveToProcess = [];
	
	_this.MousePos = new THREE.Vector2();
	_this.MouseDelta = new THREE.Vector2();
	_this.CliMousePos = new THREE.Vector2();
	_this.CliMouseDelta = new THREE.Vector2();
	_this.RelMousePos = new THREE.Vector2();
	_this.RelMouseDelta = new THREE.Vector2();
	_this.Raycaster = new THREE.Raycaster();
	_this.RaycastObjects = [];
	_this.LastRaycastResult = [];
	
	_this.onDocumentKeyDown = function( event ) {
		if(!_this.KeyDownArr[event.keyCode]) {
			_this.KeyHoldDuration[event.keyCode] = 0;
			_this.KeyDownArr[event.keyCode] = true;
			_this.KeysToProcess.push([event.keyCode, 1]);
		}
		event.preventDefault();
	};
	_this.onDocumentKeyUp = function( event ) {
		if(_this.KeyDownArr[event.keyCode]) {
			_this.KeyDownArr[event.keyCode] = false;
			_this.KeysToProcess.push([event.keyCode, 0]);
		}
		event.preventDefault();
	};
	_this.onDocumentMouseMove = function(event) {
		_this.MouseDelta.set(event.screenX - _this.MousePos.x, event.screenY - _this.MousePos.y);
		_this.MousePos.set(event.screenX, event.screenY);
		_this.CliMouseDelta.set(event.clientX - _this.CliMousePos.x, event.clientY - _this.CliMousePos.y);
		_this.CliMousePos.set(event.clientX, event.clientY);
		var rmdx = (event.clientX/_this.Game.Renderer.ViewportWidth)*2-1;
		var rmdy = -(event.clientY/_this.Game.Renderer.ViewportHeight)*2+1;
		_this.RelMouseDelta.set(rmdx - _this.RelMousePos.x, rmdy - _this.RelMousePos.y);
		_this.RelMousePos.set(rmdx, rmdy);
		if(isDef(_this.Game.Renderer.CurrentCamera)) {
			_this.Raycaster.setFromCamera(_this.RelMousePos, _this.Game.Renderer.CurrentCamera);
			_this.LastRaycastResult = _this.Raycaster.intersectObjects(_this.RaycastObjects);
			if(isDef(_this.LastRaycastResult[0])) {
				//console.log(_this.LastRaycastResult);
			var htind = _this.LastRaycastResult[0].object.GdIndx;
				_this.VRaycastInd.position.copy(new THREE.Vector3().copy(_this.LastRaycastResult[0].face.normal).add(_this.Game.IndexToVec3(_this.LastRaycastResult[0].object.GdIndx)));
			}
		}
		
		_this.MouseMoveToProcess.push([new THREE.Vector2().copy(_this.MouseDelta), new THREE.Vector2().copy(_this.RelMouseDelta)]);
		
		event.preventDefault();
	};
	_this.MouseBtnIndices = [[1,"LeftMouseBtn"],[2,"RightMouseBtn"],[4,"MiddleMouseBtn"],[8,"FwdMouseBtn"],[16,"BackMouseBtn"]];
	_this.onDocumentMouseDown = function(event) {
		for(var i = 0; i < _this.MouseBtnIndices.length; i++) {
			if((event.buttons & _this.MouseBtnIndices[i][0]) == _this.MouseBtnIndices[i][0]) {
				var btn = _this.MouseBtnIndices[i][1];
				if(!_this.KeyDownArr[btn]) {
					_this.KeyHoldDuration[btn] = 0;
					_this.KeyDownArr[btn] = true;
					_this.KeysToProcess.push([btn, 1]);
				}
				return;
			}
		}
		event.preventDefault();
	};
	_this.onDocumentMouseUp = function(event) {
		for(var i = 0; i < _this.MouseBtnIndices.length; i++) {
			if(event.buttons & _this.MouseBtnIndices[i][0] == _this.MouseBtnIndices[i][0]) {
				var btn = _this.MouseBtnIndices[i][1];
				if(!_this.KeyDownArr[btn]) {
					_this.KeyDownArr[btn] = false;
					_this.KeysToProcess.push([btn, 0]);
				}
				return;
			}
		}
		event.preventDefault();
	};
	document.addEventListener( 'keydown', _this.onDocumentKeyDown, false );
	document.addEventListener( 'keyup', _this.onDocumentKeyUp, false );
	document.addEventListener( 'mousemove', _this.onDocumentMouseMove, false );
	document.addEventListener( 'mousedown', _this.onDocumentMouseDown, false );
	document.addEventListener( 'mouseup', _this.onDocumentMouseUp, false );
	
	_this.Game.Renderer.DrawCalls.push(function(rndr, t, dt, args){
		var keydat;
		for(var i = 0; i < _this.KeysToProcess.length; i++) {
			keydat = _this.KeysToProcess.pop();
			if(keydat[1] == 1) {
				_this.onKeyDown(rndr, keydat[0], t, dt, args);
			} else {
				_this.onKeyUp(rndr, keydat[0], t, dt, args);
			}
		}
		for(var i = 0; i < _this.MouseMoveToProcess.length; i++) {
			keydat = _this.MouseMoveToProcess.pop();
			_this.onMouseMove(rndr, keydat, t, dt, args);
		}
		for(var k in _this.KeyDownArr) { 
			if(_this.KeyDownArr[k]) {
				_this.onKeyHold(rndr, k, t, dt, args);
				_this.KeyHoldDuration[k] += dt;
			}
		}
	});
	
	_this.onKeyDown = function(rndr, key, t, dt, args) {
		console.log("KEYDN: " + key);
		if(isDef(_this.LastRaycastResult[0])) {
			var htind = _this.LastRaycastResult[0].object.GdIndx;
			var upind = _this.Game.Vec3ToIndex(new THREE.Vector3().copy(_this.LastRaycastResult[0].face.normal).add(_this.Game.IndexToVec3(_this.LastRaycastResult[0].object.GdIndx)));
			if(key == 68) {
				//GdIndx
				_this.Game.ValOoP[htind] = 0;
				_this.Game.TypeOoP[htind] = 0;
				_this.Game.Dirty[htind] = 1;
			} else if(key == 84) {
				_this.Game.ValOoP[upind] = 1;
				_this.Game.TypeOoP[upind] = 2;
				_this.Game.Dirty[upind] = 1;
			} else if(key == 69) {
				_this.Game.ValOoP[upind] = 100;
				_this.Game.TypeOoP[upind] = 6;
				_this.Game.Dirty[upind] = 1;
				
			} else if(key == 67) {
				_this.Game.ValOoP[upind] = 100;
				_this.Game.TypeOoP[upind] = 3;
				_this.Game.Dirty[upind] = 1;
				
			} else if(key == 78) {
				_this.Game.ValOoP[upind] = 1000000000;
				_this.Game.TypeOoP[upind] = 6;
				_this.Game.Dirty[upind] = 1;
				
			} else if(key == 86) {
				_this.Game.ValOoP[upind] = 10000;
				_this.Game.TypeOoP[upind] = 3;
				_this.Game.Dirty[upind] = 1;
				
			}
		}
	};
	_this.onKeyUp = function(rndr, key, t, dt, args) {
		console.log("KEYUP: " + key);
	};
	_this.onKeyHold = function(rndr, key, t, dt, args) {
		
	};
	_this.onMouseMove = function(rndr, deltas, t, dt, args) {
		
	};
};

WebCW.CreeperGame = function(iniargs) {
	//SETUP
	var _this = this;
	_this.DefaultArgs = {
		CreeperProps: {
			viscosity: 0.3,
			//viscosity: 100,
			evaplimit: 0.02,
			spreadlimit: 1,
			globalPressure: [
				-1, -1, -6, //Add to positive-coord Von Neumann neighbors
				-1, -1, 3 //Add to negative-coord Von Neumann neighbors
			]
		}, Settings: {
			CellRate: 10
		}
	};
	_this.DftGenArgs = {
		Renderer: function() {return new WebCW.CreeperGame.WebGLRenderer({});}
	};
	_this.RequiredArgs = [
		"Dimensions"
	];
	initArgs(_this, iniargs);
	
	_this.UnsafeCode = new WebCW.UnsafeCode(_this);
	
	//PUBLIC VARS
	_this.GameObjects = [];
	_this.ModuleObjects = [];
	_this.Colliders = [];
	
	//TODO: apply "delta logic" to OoP transferral, flag cells/chunks as "dirty", "interior", "LoS" for the voxel renderer
	_this.TypeIndex = [
		"Atmosphere",
		"WorldBoundary",
		"Dirt",
		"Creeper",
		"Stone",
		"Anticreep",
		"Explosion"
	];
	_this.ClassIndex = [
		"Yield",
		"Terrain",
		"Terrain",
		"Liquid",
		"Terrain",
		"Liquid",
		"Liquid"
	];
	_this.ColorRIndex = [
		0/255,
		255/255,
		119/255,
		255/255,
		51/255,
		0/255,
		125/255
	];
	_this.ColorGIndex = [
		0/255,
		255/255,
		68/255,
		0/255,
		51/255,
		204/255,
		125/255
	];
	_this.ColorBIndex = [
		0/255,
		255/255,
		34/255,
		255/255,
		51/255,
		255/255,
		125/255
	];
	_this.VisibilityIndex = [
		0,
		0,
		1,
		1,
		1,
		1,
		1
	];
	_this.IsSolidIndex = [
		false,
		true,
		true,
		false,
		true,
		false,
		false
	];
	
	_this.AnnihilationIndex = [
		[],
		[],
		[],
		[],
		[],
		[],
		[3]
	];
	
	/*_this.CeAtData = new CellAuto3D({GdSize: _this.Dimensions, InitialType: function(pos) {
		if(pos[2] == 0 || (pos[2] < 5 && (pos[1] == 15 || pos[0] == 15)) || (pos[2] == 5 && pos[1] < 15 && pos[0] < 15)) {
			return 2;
		}
		return 0;
	}, InitialVal: function(pos) {
		if(pos[2] == 0 || (pos[2] < 5 && (pos[1] == 15 || pos[0] == 15)) || (pos[2] == 5 && pos[1] < 15 && pos[0] < 15)) return 1;
		return 0;
	},
		BoundaryType: function(pos) {return 1;},
		BoundaryVal: function(pos) {return 1;}}
	);*/
	
	_this.LayerSize = _this.Dimensions.y * _this.Dimensions.x
	_this.TotalSize = _this.Dimensions.z * _this.LayerSize;
	
	_this.Dirty = new Uint8Array(_this.TotalSize);
	//uint8array: maximum of 256 substance types
	_this.Type = new Uint8Array(_this.TotalSize);
	_this.Val = new Float32Array(_this.TotalSize);
	_this.TypeOoP = new Uint8Array(_this.TotalSize);
	_this.ValOoP = new Float32Array(_this.TotalSize);
	_this.CoordsX = new Uint16Array(_this.TotalSize);
	_this.CoordsY = new Uint16Array(_this.TotalSize);
	_this.CoordsZ = new Uint16Array(_this.TotalSize);
	
	_this.BoundsPX = new Uint8Array(_this.TotalSize);
	_this.BoundsMX = new Uint8Array(_this.TotalSize);
	_this.BoundsPY = new Uint8Array(_this.TotalSize);
	_this.BoundsMY = new Uint8Array(_this.TotalSize);
	_this.BoundsPZ = new Uint8Array(_this.TotalSize);
	_this.BoundsMZ = new Uint8Array(_this.TotalSize);
	


	//FUNCTIONS
	
	_this.distribFluid = function(ifrm, ito, ifrac) {
		if(_this.Val[ifrm] > 0 && ifrac > 0) {
			_this.Dirty[ifrm] = 1; _this.Dirty[ito] = 1;
			if(_this.ClassIndex[_this.Type[ito]] == "Yield") {
				_this.TypeOoP[ito] = _this.Type[ifrm];
				_this.ValOoP[ito] = _this.Val[ifrm] * ifrac;
				_this.ValOoP[ifrm] -= _this.Val[ifrm] * ifrac;
			} else if(_this.Type[ito] != _this.Type[ifrm]) { //TODO: better annihilation logic
				_this.ValOoP[ito] -= _this.Val[ifrm] * ifrac;
				_this.ValOoP[ifrm] -= _this.Val[ifrm] * ifrac;
				if(_this.ValOoP[ito] < 0) {
					_this.ValOoP[ifrm] -= _this.ValOoP[ito];
					//_this.ValOoP[ito] = -_this.ValOoP[ito];
					//_this.TypeOoP[ito] = _this.Type[ifrm];
				}
			} else {
				_this.ValOoP[ito] += _this.Val[ifrm] * ifrac;
				_this.ValOoP[ifrm] -= _this.Val[ifrm] * ifrac;
			}
		}
	};
	
	_this.getBiasedPrsDif = function(ifrm, ito, iglb, iovr) {
		if(_this.Type[ifrm] != _this.Type[ito] && _this.ClassIndex[_this.Type[ito]] != "Yield" && _this.Type[ito] != iovr) return 0;
		return Math.max(_this.Val[ifrm] - _this.Val[ito] + _this.CreeperProps.globalPressure[iglb], 0);
	};
	
	
	
	_this.GetLine = function(pstart, pend, idebug) {
		var ppos = new THREE.Vector3().copy(pstart).floor();
		var pendf = new THREE.Vector3().copy(pend).floor();
		var pdelta = new THREE.Vector3().copy(pendf).sub(ppos);
		var pdelabs = new THREE.Vector3().copy(pdelta);
		pdelabs.x = Math.abs(pdelabs.x);
		pdelabs.y = Math.abs(pdelabs.y);
		pdelabs.z = Math.abs(pdelabs.z);
		var pdelct;
		if(pdelabs.z > pdelabs.y && pdelabs.z > pdelabs.x) {
			pdelct = pdelabs.z;
			pdelta.multiplyScalar(1/pdelabs.z);
		} else if(pdelabs.y > pdelabs.x) { 
			pdelct = pdelabs.y;
			pdelta.multiplyScalar(1/pdelabs.y);
		} else {
			pdelct = pdelabs.x;
			pdelta.multiplyScalar(1/pdelabs.x);
		}
		//TODO: use 3D Bresenham instead
		var pdelbuf = new THREE.Vector3();
		var pindex = [];
		for(var i = 0; i <= pdelct; i++) {
			var pposi = _this.Vec3ToIndex(ppos);
			pindex.push(pposi);
			
			if(idebug) {console.log(_this.IsSolidIndex[_this.Type[pposi]]);}
			
			pdelbuf.add(pdelta);
			
			if(pdelbuf.x >= 1) {
				pdelbuf.x--;
				ppos.x++;
			}
			if(pdelbuf.y >= 1) {
				pdelbuf.y--;
				ppos.y++;
			}
			if(pdelbuf.z >= 1) {
				pdelbuf.z--;
				ppos.z++;
			}
			if(pdelbuf.x <= -1) {
				pdelbuf.x++;
				ppos.x--;
			}
			if(pdelbuf.y <= -1) {
				pdelbuf.y++;
				ppos.y--;
			}
			if(pdelbuf.z <= -1) {
				pdelbuf.z++;
				ppos.z--;
			}
		};
		
		return pindex;
	};
	
	
	//_this.Raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(), 16, 1);
	_this.RaycastSearch = function(pos, angdir, range) {
		/*_this.Raycaster.far = range;
		//_this.Raycaster.set(pos, new THREE.Vector3(GLOBALS.));
		_this.Raycaster.set(pos, angdir);
		var clds = _this.Raycaster.intersectObjects(_this.Colliders, false);
		var cldsr = [];
		for(var i = 0; i < clds.length; i++) {
			var cldspos = _this.Vec3ToIndex(clds[i].object.position);
			cldsr.push([_this.Type[cldspos], _this.Val[cldspos], cldspos, clds[i].object.position]);
		}
		return cldsr;*/
		var dtpos = new THREE.Vector3().copy(angdir);
		var ndtpos = new THREE.Vector3().copy(dtpos).multiplyScalar(range);
		var stpos = new THREE.Vector3().copy(pos);
		var edpos = new THREE.Vector3().copy(pos).add(ndtpos);
		var ccpos = new THREE.Vector3().copy(pos);
		var cfpos = new THREE.Vector3().copy(pos).floor();
		var cdpos = new THREE.Vector3();
		var cldsr = [];
		for(var i = 0; i < range; i++) {
			cdpos.copy(cfpos);
			ccpos.add(dtpos);
			cfpos.copy(ccpos).floor();
			if(!cfpos.equals(cdpos)) {
				var cfind = _this.Vec3ToIndex(cfpos);
				cldsr.push([_this.Type[cfind], _this.Val[cfind], cfind, new THREE.Vector3().copy(cfpos)]);
			}
		};
		return cldsr;
	};
	
	_this.Update = function(renderer, gameTime, deltaTime, loopArgs) {
		//console.log("=== BEGIN UPDATE LOOP AT T:" + gameTime + "S ===");
		_this.GameTime = gameTime;
		_this.LastDelta = deltaTime;
		_this.LastLoopArgs = loopArgs;
		for(var i = 0; i < _this.GameObjects.length; i++) {
			_this.GameObjects[i].OnPreUpdate(gameTime, deltaTime, loopArgs);
		}
		//ONLY SET VALUES IN OoP ARRAY HERE
		//LOOP 1
		
		var ind, ipx, imx, ipy, imy, ipz, imz, ibuf, totalExtPressure, extPressure, extpx, extmx, extpy, extmy, extpz, extmz, dstFrac, extPTot, ovrpx, ovrmx, ovrpy, ovrmy, ovrpz, ovrmz;
		
		//ind = 0; ipx = 0; imx = -2; ipy = _this.Dimensions.x-1; imy = -_this.Dimensions.x-1; ipz = _this.LayerSize-1; imz = -_this.LayerSize-1;
		//NOTE: Only use Type/Val when reading, only use TypeOoP/ValOoP when writing! Exception is checking type while setting -- conflicts may arise in this case. This is TODO logic; for now, only supports Creeper. PROGRAMMER'S NOTE: Check fluid type instead of class, and perform interaction logic instead of/on top of pressure logic if no match?
		for(inda = 0; inda < _this.TotalSize; inda++) {
			//ipx++; imx++; ipy++; imy++; ipz++; imz++;
			//if(_this.ClassIndex[_this.Type[inda]] != "Liquid") continue;
			switch(_this.TypeIndex[_this.Type[inda]]) {
				case "Creeper":
					//if(_this.Val[inda] < _this.CreeperProps.spreadlimit) continue;
					totalExtPressure = 0;
					extPressure = 0;
					
					ipx = inda+1;
					imx = inda-1;
					ipy = inda+_this.Dimensions.x;
					imy = inda-_this.Dimensions.x;
					ipz = inda+_this.LayerSize;
					imz = inda-_this.LayerSize;
					
					extpx = _this.BoundsPX[inda]==1 ? 0 : _this.getBiasedPrsDif(inda, ipx, 0, 6);
					extmx = _this.BoundsMX[inda]==1 ? 0 : _this.getBiasedPrsDif(inda, imx, 3, 6);
					extpy = _this.BoundsPY[inda]==1 ? 0 : _this.getBiasedPrsDif(inda, ipy, 1, 6);
					extmy = _this.BoundsMY[inda]==1 ? 0 : _this.getBiasedPrsDif(inda, imy, 4, 6);
					extpz = _this.BoundsPZ[inda]==1 ? 0 : _this.getBiasedPrsDif(inda, ipz, 2, 6);
					extmz = _this.BoundsMZ[inda]==1 ? 0 : _this.getBiasedPrsDif(inda, imz, 5, 6);
					
					extPTot = extpx+extmx+extpy+extmy+extpz+extmz;
					if(extPTot == 0) continue;
					
					//STAGE 2: Determine total amt to distribute
					var fluidLeft = Math.max(_this.Val[inda] - extPTot, 0);
					var fluidDstb = _this.Val[inda] - fluidLeft;
					dstFrac = fluidDstb/extPTot / _this.Val[inda] * _this.CreeperProps.viscosity;
					
					//STAGE 3: Distribute
					_this.distribFluid(inda, ipx, dstFrac*extpx);
					_this.distribFluid(inda, imx, dstFrac*extmx);
					_this.distribFluid(inda, ipy, dstFrac*extpy);
					_this.distribFluid(inda, imy, dstFrac*extmy);
					_this.distribFluid(inda, ipz, dstFrac*extpz);
					_this.distribFluid(inda, imz, dstFrac*extmz);
					break;
				case "Explosion":
					totalExtPressure = 0;
					extPressure = 0;
					
					ipx = inda+1;
					imx = inda-1;
					ipy = inda+_this.Dimensions.x;
					imy = inda-_this.Dimensions.x;
					ipz = inda+_this.LayerSize;
					imz = inda-_this.LayerSize;
					
					extpx = _this.BoundsPX[inda]==1 ? 0 : _this.getBiasedPrsDif(inda, ipx, 0, 3);
					extmx = _this.BoundsMX[inda]==1 ? 0 : _this.getBiasedPrsDif(inda, imx, 3, 3);
					extpy = _this.BoundsPY[inda]==1 ? 0 : _this.getBiasedPrsDif(inda, ipy, 1, 3);
					extmy = _this.BoundsMY[inda]==1 ? 0 : _this.getBiasedPrsDif(inda, imy, 4, 3);
					extpz = _this.BoundsPZ[inda]==1 ? 0 : _this.getBiasedPrsDif(inda, ipz, 2, 3);
					extmz = _this.BoundsMZ[inda]==1 ? 0 : _this.getBiasedPrsDif(inda, imz, 5, 3);
					
					extPTot = extpx+extmx+extpy+extmy+extpz+extmz;
					if(extPTot == 0) continue;
					
					//STAGE 2: Determine total amt to distribute
					var fluidLeft = Math.max(_this.Val[inda] - extPTot, 0);
					var fluidDstb = _this.Val[inda] - fluidLeft;
					dstFrac = fluidDstb / extPTot / _this.Val[inda] * 1;
					
					//STAGE 3: Distribute
					_this.distribFluid(inda, ipx, dstFrac*extpx);
					_this.distribFluid(inda, imx, dstFrac*extmx);
					_this.distribFluid(inda, ipy, dstFrac*extpy);
					_this.distribFluid(inda, imy, dstFrac*extmy);
					_this.distribFluid(inda, ipz, dstFrac*extpz);
					_this.distribFluid(inda, imz, dstFrac*extmz);
					break;
				default:
					break;
			}
		}
		
		for(var i = 0; i < _this.GameObjects.length; i++) {
			_this.GameObjects[i].OnPostUpdate(gameTime, deltaTime, loopArgs);
		}
		
		for(var indb = 0; indb < _this.TotalSize; indb++) {
			if(_this.TypeOoP[indb] == 6) _this.ValOoP[indb] /= 1.1;
			
			if(_this.ClassIndex[_this.TypeOoP[indb]] == "Liquid" && _this.ValOoP[indb] < _this.CreeperProps.evaplimit) {
				_this.TypeOoP[indb] = 0;
				_this.ValOoP[indb] = 0;
				_this.Dirty[indb] = 1;
			}
			
			if(_this.Dirty[indb] == 1) {
				_this.UnsafeCode.VoxelRenderer.setVoxelDirty(indb);
				_this.Dirty[indb] = 0;
			}
			
			//callbackClone(indb, _this.Type[indb], _this.Val[indb], _this.Dirty[indb] == 1);
			_this.Type[indb] = _this.TypeOoP[indb];
			_this.Val[indb] = _this.ValOoP[indb];
		}
		
		//console.log("=== END UPDATE LOOP ===");
		//console.log(" ");
	};
	
	_this.Draw = function() {
		
	};
	_this.Vec3ToIndex = function(pos) {
		return pos.z * _this.LayerSize + pos.y * _this.Dimensions.x + pos.x;
	};
	_this.IndexToVec3 = function(ind) {
		return new THREE.Vector3(_this.CoordsX[ind], _this.CoordsY[ind], _this.CoordsZ[ind]);
	};
	_this.Vec3ToCoord = function(pos) {
		return [pos.x, pos.y, pos.z];
	};
	_this.CoordToVec3 = function(crd) {
		return new THREE.Vector3(crd[0], crd[1], crd[2]);
	};
	_this.IndexToCoord = function(ind) {
		return [_this.CoordsX[ind], _this.CoordsY[ind], _this.CoordsZ[ind]];
	};
	_this.CoordToIndex = function(crd) {
		return crd[2] * _this.LayerSize + crd[1] * _this.Dimensions.x + crd[0];
	};
	
	//build coordinate buffers
	var gbind = 0;
	
	_this.NoRenderMaterial = new THREE.MeshBasicMaterial({visible: false});
	
	_this.ColliderGeom = new THREE.BoxGeometry(1, 1, 1);
	
	for(var k = 0; k < _this.Dimensions.z; k++) {
		for(var j = 0; j < _this.Dimensions.y; j++) {
			for(var i = 0; i < _this.Dimensions.x; i++) {
				_this.CoordsX[gbind] = i;
				_this.CoordsY[gbind] = j;
				_this.CoordsZ[gbind] = k;
				_this.Type[gbind] = (k == 0 || (k < 5 && (i == 15 || j == 15)) || (k == 5 && i < 15 && j < 15)) ? 2 : 0;
				_this.Val[gbind] = (_this.Type[gbind] == 2) ? 1 : 0;
				
				_this.ValOoP[gbind] = _this.Val[gbind];
				_this.TypeOoP[gbind] = _this.Type[gbind];
				
				_this.BoundsMX[gbind] = (i == 0);
				_this.BoundsPX[gbind] = (i == (_this.Dimensions.x - 1));
				_this.BoundsMY[gbind] = (j == 0);
				_this.BoundsPY[gbind] = (j == (_this.Dimensions.y - 1));
				_this.BoundsMZ[gbind] = (k == 0);
				_this.BoundsPZ[gbind] = (k == (_this.Dimensions.z - 1));
				
				
				_this.Colliders[gbind] = new THREE.Object3D(_this.ColliderGeom);
				_this.Colliders[gbind].position.set(i, j, k);
				_this.Renderer.Scene.add(_this.Colliders[gbind]);
				
				gbind++;
			}
		}
	}
	
	_this.UnsafeCode.VoxelRenderer.buildChunks();
	_this.Renderer.UpdateCalls.push(this.Update);
	_this.Renderer.UpdateCalls.push(this.UnsafeCode.VoxelRenderer.updateChunks);
	_this.Renderer.DrawCalls.push(this.Draw);
	
};

WebCW.CreeperGame.Modules = {};
