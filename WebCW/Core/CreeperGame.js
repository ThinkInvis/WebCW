var WebCW = {};
WebCW.Units = {};

WebCW.UnsafeCode = function(attachto) {
	var _this = this;
	_this.Game = attachto;
	
	_this.FBXLoader = new THREE.FBXLoader();
	//////This is stuff that needs to be moved to its own module but I wanted it NOOOOOOooowwwww
	//Actually partially gave up on keeping this together, so just watch for bad coding practices
	
	_this.VoxelRenderer = new WebCW.Modules.Gfx.VoxelRenderer({Game: _this.Game, ChunkSize: new THREE.Vector3(16, 16, 16)});
	
	_this.VRaycastInd = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0x00ccff, transparent: true, opacity: 0.75}));
	_this.Game.Renderer.Scene.add(_this.VRaycastInd);
	

	_this.Raycaster = new THREE.Raycaster();
	_this.RaycastObjects = [];
	_this.LastRaycastResult = [];
	//on mouse move:
	
	//dat.GUI debugger tools
	_this.gui = new dat.GUI({width: 300});
	var folderAdder = _this.gui.addFolder('Pencil');
	var params = {
		pencilAmt: 1,
		pencilAmtPow10: 2,
		pencilType: 4
	};
	folderAdder.add(params, 'pencilAmt', 0, 10);
	folderAdder.add(params, 'pencilAmtPow10', -30, 30);
	folderAdder.add(params, 'pencilType', _this.Game.SubstanceNameIndex);
	folderAdder.open();
	
	_this.RelMousePos = new THREE.Vector2();
	_this.RelMouseDelta = new THREE.Vector2();
		
	_this.Game.InputHandler.keyDownHandlers.push(function(key,t,dt,args) {
		if(isDef(_this.LastRaycastResult[0])) {
			var htind = _this.LastRaycastResult[0].object.GdIndx;
			var upind = _this.Game.Vec3ToIndex(new THREE.Vector3().copy(_this.LastRaycastResult[0].face.normal).add(_this.Game.IndexToVec3(_this.LastRaycastResult[0].object.GdIndx)));
			if(key == 68) {
				for(var i = 0; i < _this.Game.Substances.length; i++) {
					_this.Game.Val[i][htind] = 0;
					_this.Game.ValBuf[i][htind] = 0;
					_this.Game.ValOoP[i][htind] = 0;
					_this.Game.Dirty[htind] = 1;
				}
			} else if(key == 84) {
				var pAdd = params.pencilAmt * Math.pow(10, params.pencilAmtPow10);
				_this.Game.Val[params.pencilType][upind] = pAdd;
				_this.Game.ValBuf[params.pencilType][upind] = pAdd;
				_this.Game.ValOoP[params.pencilType][upind] = pAdd;
				_this.Game.Dirty[upind] = 1;
			}
		}
	});
	
	_this.Game.InputHandler.mouseMoveHandlers.push(function(deltas,t,dt,args) {
		if(isDef(_this.Game.Renderer.CurrentCamera)) {
			var rmdx = (_this.Game.InputHandler.CliMousePos.x/_this.Game.Renderer.ViewportWidth)*2-1;
			var rmdy = -(_this.Game.InputHandler.CliMousePos.y/_this.Game.Renderer.ViewportHeight)*2+1;
			_this.RelMouseDelta.set(rmdx - _this.RelMousePos.x, rmdy - _this.RelMousePos.y);
			_this.RelMousePos.set(rmdx, rmdy);
			_this.Raycaster.setFromCamera(_this.RelMousePos, _this.Game.Renderer.CurrentCamera);
			_this.LastRaycastResult = _this.Raycaster.intersectObjects(_this.RaycastObjects);
			if(isDef(_this.LastRaycastResult[0])) {
				//console.log(_this.LastRaycastResult);
			var htind = _this.LastRaycastResult[0].object.GdIndx;
				_this.VRaycastInd.position.copy(new THREE.Vector3().copy(_this.LastRaycastResult[0].face.normal).add(_this.Game.IndexToVec3(_this.LastRaycastResult[0].object.GdIndx)));
			}
		}
	});
	
	_this.setupPostproc = function() {
		//Postprocessing
		// Create a multi render target with Float buffers
		_this.DepthBuf = new THREE.WebGLRenderTarget( _this.Game.Renderer.ViewportWidth, _this.Game.Renderer.ViewportHeight );
		_this.DepthBuf.texture.format = THREE.RGBFormat;
		_this.DepthBuf.texture.minFilter = THREE.NearestFilter;
		_this.DepthBuf.texture.magFilter = THREE.NearestFilter;
		_this.DepthBuf.texture.generateMipmaps = false;
		_this.DepthBuf.stencilBuffer = false;
		_this.DepthBuf.depthBuffer = true;
		_this.DepthBuf.depthTexture = new THREE.DepthTexture();
		_this.DepthBuf.depthTexture.type = THREE.UnsignedShortType;
		
		
		// Setup post processing stage
		_this.postCamera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
		_this.postMaterial = new THREE.ShaderMaterial( {
			vertexShader: document.querySelector( '#post-vert' ).textContent.trim(),
			fragmentShader: document.querySelector( '#post-frag' ).textContent.trim(),
			uniforms: {
				cameraNear: { value: _this.Game.Renderer.CurrentCamera.near },
				cameraFar:  { value: _this.Game.Renderer.CurrentCamera.far },
				tDiffuse:   { value: _this.DepthBuf.texture },
				tDepth:     { value: _this.DepthBuf.depthTexture },
				resolution:	{ value: _this.Game.Renderer.ViewportSize}
			}
		});
		_this.postPlane = new THREE.PlaneBufferGeometry( 2, 2 );
		_this.postQuad = new THREE.Mesh( _this.postPlane, _this.postMaterial );
		_this.postScene = new THREE.Scene();
		_this.postScene.add( _this.postQuad );
		
		_this.Game.Renderer.ResizeCalls.push(function(rndr,wid,hei) {
			var dpr = rndr.Context.getPixelRatio();
			_this.DepthBuf.setSize(wid*dpr, hei*dpr);
		});
		_this.Game.Renderer.DrawCalls.push(function(rndr,t,dt,loopargs) {
			_this.Game.Renderer.Context.render(_this.Game.Renderer.Scene, _this.Game.Renderer.CurrentCamera, _this.DepthBuf);
			_this.Game.Renderer.Context.render(_this.postScene, _this.postCamera);
		});
	};
};

WebCW.CreeperGame = function(iniargs) {
	//SETUP
	var _this = this;
	_this.DftGenArgs = {
		Renderer: function() {return new WebCW.WebGLRenderer({});}
	};
	_this.RequiredArgs = [
		"Dimensions", "InputHandler"
	];
	initArgs(_this, iniargs);
	
	_this.Renderer.DrawCalls.push(function(rndr, t, dt, args){
		_this.InputHandler.HandleInputs(t, dt, args);
	});
	
	//PUBLIC VARS
	_this.GameObjects = [];
	_this.ModuleObjects = [];
	_this.Colliders = [];
	
	_this.Substances = [
		new WebCW.CreeperGame.Substance({IDName: "Atmosphere", IsSolid: false, Class: "Yield", IsVisible: false}),
		new WebCW.CreeperGame.Substance({IDName: "WorldBoundary", DisplayName: "OUT OF BOUNDS", Class: "Terrain", IsVisible: false}),
		new WebCW.CreeperGame.Substance({IDName: "Dirt", Color: [119/255, 68/255, 34/255], BlocksTurrets: true}),
		new WebCW.CreeperGame.Substance({IDName: "Creeper", IsSolid: false, Class: "Liquid",
			GlobalPressure: [
				-1, -1, -6, //Add to positive-coord Von Neumann neighbors
				-1, -1, 3 //Add to negative-coord Von Neumann neighbors
			], SpreadLimit: 0, EvapLimit: 0.01, SpreadRate: 4, Color: [255/255, 0/255, 255/255]}),
		new WebCW.CreeperGame.Substance({IDName: "Explosion", Color: [70/255, 70/255, 70/255], IsSolid: false, Class: "Liquid", GlobalPressure: [0,0,0,0,0,0], SpreadLimit: 0, EvapLimit: 0.1, SpreadRate: 10, ConstEvap: 0.25}),
		new WebCW.CreeperGame.Substance({IDName: "Shield", Color: [10/255, 60/255, 255/255]}),
		new WebCW.CreeperGame.Substance({IDName: "CrystalCreep", DisplayName: "Crystallized Creeper", Color: [125/255, 10/255, 125/255]}),
		new WebCW.CreeperGame.Substance({IDName: "TNT", DisplayName: "Trinitrotoluene", Color: [125/255, 10/255, 10/255], EvapLimit: 1})
	];
	
	_this.SubstanceIDIndex = {
		
	};
	_this.SubstanceNameIndex = {
		
	};
	for(var i = 0; i < _this.Substances.length; i++) {
		if(isDef(_this.SubstanceIDIndex[_this.Substances[i].IDName])) {
			console.log("WARNING: Substance conflict detected! At least two substances both have the same IDName: \"" + _this.Substances[i].IDName + "\". Only the first such instance will be added to the ID index.");
		} else {
			_this.SubstanceIDIndex[_this.Substances[i].IDName] = i;
			_this.SubstanceNameIndex[_this.Substances[i].DisplayName] = i;
		}
	}
	
	//Interaction format: Source substance, target substance, function called on match, optional parameters (for use in standard functions below).
	//Functions are passed: the grid index where interaction is happening, the source type, the destination type, the source value, the destination value, and the delta time; followed by any optional parameters for the specific function.
	var StandardInteractions = {
		Annihilate: function(ind, typefrom, typeto, valfrom, valto, dt, iacargs) { //ratio, limit
			var unitsAnnihilated = Math.min(Math.max(valfrom * iacargs[0] - valto, 0) * dt, iacargs[1]/iacargs[0]);
			var unitsAnnihilating = unitsAnnihilated / iacargs[0];
			if(unitsAnnihilated > 0) _this.Dirty[ind] = true;
			_this.ValOoP[typefrom][ind] -= unitsAnnihilating;
			_this.ValOoP[typeto][ind] -= unitsAnnihilated;
		},
		Merge: function(ind, typefrom, typeto, valfrom, valto, dt, iacargs) { //ratio, limit
			var unitsAnnihilated = Math.min(Math.max(valfrom * iacargs[0] - valto, 0) * dt, iacargs[1]/iacargs[0]);
			var unitsAnnihilating = unitsAnnihilated / iacargs[0];
			if(unitsAnnihilated > 0) _this.Dirty[ind] = true;
			_this.ValOoP[typefrom][ind] -= unitsAnnihilating;
			_this.ValOoP[typeto][ind] += unitsAnnihilated;
		},
		InstantMerge: function(ind, typefrom, typeto, valfrom, valto, dt, iacargs) { //ratio, limit
			_this.ValOoP[typefrom][ind] = 0;
			_this.ValOoP[typeto][ind] += valfrom * iacargs[0];
		},
		Evaporate: function(ind, typefrom, typeto, valfrom, valto, dt, iacargs) {
			if(_this.ValOoP[typefrom][ind] > 0) _this.Dirty[ind] = true;
			_this.ValOoP[typefrom][ind] *= _this.Substances[typefrom].ConstEvap;
			if(_this.ValOoP[typefrom][ind] < _this.Substances[typefrom].EvapLimit) _this.ValOoP[typefrom][ind] = 0;
			if(_this.ValOoP[typefrom][ind] < 0 && _this.Substances[typefrom].IsClamped) {
				_this.ValOoP[typefrom][ind] = 0;
			}
		}
	};
	
	_this.Interactions = [
		[_this.SubstanceIDIndex["Explosion"], _this.SubstanceIDIndex["Creeper"], StandardInteractions.Annihilate, [10, 10000]],
		[_this.SubstanceIDIndex["Shield"], _this.SubstanceIDIndex["Creeper"], StandardInteractions.Annihilate, [0.01, 1]],
		[_this.SubstanceIDIndex["CrystalCreep"], _this.SubstanceIDIndex["Creeper"], StandardInteractions.Merge, [0.01, 100]],
		[_this.SubstanceIDIndex["TNT"], _this.SubstanceIDIndex["Explosion"], StandardInteractions.InstantMerge, [1000]]
	];
	for(var i = 0; i < _this.Substances.length; i++) {
		//if(_this.Substances[i].Class == "Liquid")
			_this.Interactions.push([i, i, StandardInteractions.Evaporate, []]);
	}
	
	_this.LayerSize = _this.Dimensions.y * _this.Dimensions.x
	_this.TotalSize = _this.Dimensions.z * _this.LayerSize;
	
	_this.Dirty = new Uint8Array(_this.TotalSize);
	//uint8array: maximum of 256 substance types
	_this.Val = []; //VALUE: Existing cells.
	_this.ContainsSolid = new Float32Array(_this.TotalSize);
	_this.ValBuf = []; //BUFFER: Intermediary for Stage 1 (propagation).
	_this.ValOoP = []; //OUT-OF-PLACE: Intermediary for Stage 2 (interaction).
	for(var i = 0; i < _this.Substances.length; i++) {
		_this.Val.push(new Float32Array(_this.TotalSize));
		_this.ValBuf.push(new Float32Array(_this.TotalSize));
		_this.ValOoP.push(new Float32Array(_this.TotalSize));
	}
	_this.CoordsX = new Uint16Array(_this.TotalSize);
	_this.CoordsY = new Uint16Array(_this.TotalSize);
	_this.CoordsZ = new Uint16Array(_this.TotalSize);
	
	_this.BoundsPX = new Uint8Array(_this.TotalSize);
	_this.BoundsMX = new Uint8Array(_this.TotalSize);
	_this.BoundsPY = new Uint8Array(_this.TotalSize);
	_this.BoundsMY = new Uint8Array(_this.TotalSize);
	_this.BoundsPZ = new Uint8Array(_this.TotalSize);
	_this.BoundsMZ = new Uint8Array(_this.TotalSize);
	

	_this.UnsafeCode = new WebCW.UnsafeCode(_this);

	//FUNCTIONS
	_this.distribFluid = function(type, ifrm, ito, ifrac) {
		if(ifrac != 0) {
			_this.Dirty[ifrm] = 1; _this.Dirty[ito] = 1;
			_this.ValBuf[type][ifrm] = _this.ValBuf[type][ifrm] - ifrac;
			_this.ValBuf[type][ito] = _this.ValBuf[type][ito] + ifrac;
		}
	};
	
	_this.getBiasedPrsDif = function(type, ifrm, ito, iglb) {
		if(_this.ContainsSolid[ito]) return 0;
		return Math.max(_this.Val[type][ifrm] - _this.Val[type][ito] + _this.Substances[type].GlobalPressure[iglb], 0);
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
	
	_this.Update = function(renderer, gameTime, deltaTime, loopArgs) {
		_this.GameTime = gameTime;
		_this.LastDelta = deltaTime;
		_this.LastLoopArgs = loopArgs;
		for(var i = 0; i < _this.GameObjects.length; i++) {
			_this.GameObjects[i].OnPreUpdate(gameTime, deltaTime, loopArgs);
		}
		
		var ind, ipx, imx, ipy, imy, ipz, imz, ibuf, totalExtPressure, extPressure, extpx, extmx, extpy, extmy, extpz, extmz, dstFrac, extPTot, ovrpx, ovrmx, ovrpy, ovrmy, ovrpz, ovrmz, i;
		
		//PHASE 1: Propagate liquids (and gases)
		for(inda = 0; inda < _this.TotalSize; inda++) {
			for(var i = 0; i < _this.Substances.length; i++) {
				if(_this.Substances[i].Class == "Liquid") {
					if(_this.Val[i][inda] < _this.Substances[i].SpreadLimit) continue;
					//TODO: extend to full propagation rules, like interaction rules?
					ipx = inda+1;
					imx = inda-1;
					ipy = inda+_this.Dimensions.x;
					imy = inda-_this.Dimensions.x;
					ipz = inda+_this.LayerSize;
					imz = inda-_this.LayerSize;
					totalExtPressure = 0;
					extPressure = 0;
						
					extpx = _this.BoundsPX[inda]==1 ? 0 : _this.getBiasedPrsDif(i, inda, ipx, 0);
					extmx = _this.BoundsMX[inda]==1 ? 0 : _this.getBiasedPrsDif(i, inda, imx, 3);
					extpy = _this.BoundsPY[inda]==1 ? 0 : _this.getBiasedPrsDif(i, inda, ipy, 1);
					extmy = _this.BoundsMY[inda]==1 ? 0 : _this.getBiasedPrsDif(i, inda, imy, 4);
					extpz = _this.BoundsPZ[inda]==1 ? 0 : _this.getBiasedPrsDif(i, inda, ipz, 2);
					extmz = _this.BoundsMZ[inda]==1 ? 0 : _this.getBiasedPrsDif(i, inda, imz, 5);
					
					extPTot = extpx+extmx+extpy+extmy+extpz+extmz;
					if(extPTot == 0) continue;
					
					var fluidLeft = Math.max(_this.Val[i][inda] - extPTot, 0);
					var fluidDstb = _this.Val[i][inda] - fluidLeft;
					dstFrac = fluidDstb/extPTot * _this.Substances[i].SpreadRate * deltaTime;
					_this.Dirty[inda] = 1; 
					_this.distribFluid(i, inda, ipx, dstFrac*extpx);
					_this.distribFluid(i, inda, imx, dstFrac*extmx);
					_this.distribFluid(i, inda, ipy, dstFrac*extpy);
					_this.distribFluid(i, inda, imy, dstFrac*extmy);
					_this.distribFluid(i, inda, ipz, dstFrac*extpz);
					_this.distribFluid(i, inda, imz, dstFrac*extmz);
				}
			}
		}
		
		//PHASE 2: Interaction
		for(inda = 0; inda < _this.TotalSize; inda++) {
			for(var i = 0; i < _this.Substances.length; i++) {
				_this.ValOoP[i][inda] = _this.ValBuf[i][inda];
			}
			for(var i = 0; i < _this.Interactions.length; i++) {
				var vfrom = _this.ValBuf[_this.Interactions[i][0]][inda];
				var vto = _this.ValBuf[_this.Interactions[i][1]][inda];
				if(vfrom != 0 && vto != 0) _this.Interactions[i][2](
					inda,
					_this.Interactions[i][0], _this.Interactions[i][1],
					vfrom, vto,
					deltaTime,
					_this.Interactions[i][3]);
			}
		}
		
		for(var i = 0; i < _this.GameObjects.length; i++) {
			_this.GameObjects[i].OnPostUpdate(gameTime, deltaTime, loopArgs);
		}
		
		//PHASE 3: Reset buffers
		for(var indb = 0; indb < _this.TotalSize; indb++) {
			if(_this.Dirty[indb] == 1) {
				_this.UnsafeCode.VoxelRenderer.setVoxelDirty(indb);
				_this.Dirty[indb] = 0;
			}
			_this.ContainsSolid[indb] = 0;
			for(var i = 0; i < _this.Substances.length; i++) {
				_this.Val[i][indb] = _this.ValOoP[i][indb];
				_this.ValBuf[i][indb] = _this.ValOoP[i][indb];
				if(_this.Substances[i].IsSolid && _this.Val[i][indb] > 0)
						_this.ContainsSolid[indb] = 1;
			}
		}
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
				for(var mm = 0; mm < _this.Substances.length; mm++) {
					if(mm == _this.SubstanceIDIndex["Dirt"] && (k == 0 || (k < 5 && (i == 15 || j == 15)) || (k == 5 && i < 15 && j < 15))) {
						_this.Val[mm][gbind] = 1;
						_this.ValOoP[mm][gbind] = 1;
						_this.ValBuf[mm][gbind] = 1;
						_this.ContainsSolid[gbind] = 1;
					} else {
						_this.Val[mm][gbind] = 0;
						_this.ValOoP[mm][gbind] = 0;
						_this.ValBuf[mm][gbind] = 0;
						_this.ContainsSolid[gbind] = 0;
					}
				}
				
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

WebCW.Modules = {};
