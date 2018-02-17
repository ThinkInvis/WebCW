if(isUndef(WebCW.Modules.Gfx)) WebCW.Modules.Gfx = {};

WebCW.Modules.Gfx.VoxelRenderer = function(args) {
	var _this = this;
	_this.RequiredArgs = ["Game", "ChunkSize"];
	_this.OptionalArgs = {
		GenGrid: false
	};
	_this.OptGenArgs = {
		PickerGeom: function() {return new THREE.BoxGeometry(0.75, 0.75, 0.75);},
		PickerMtl: function() {return new THREE.MeshBasicMaterial({color: 0xff0000, opacity: 0.5, transparent: true})},
		VoxelGeom: function() {return new THREE.BoxGeometry(1, 1, 1);},
		VoxelMtl: function() {return new THREE.MeshLambertMaterial({color: 0xfeb74c})},
		ExtraObjects: {},
		ExtraGeom: {},
		ExtraMtl: {}
	};
	initArgs(_this, args);
	
	if(isUndef(_this.Game.Renderer)) {
		throw("A Modules.Gfx.VoxelRenderer was added to a non-CreeperGame object, or added before any compatible Graphics module was added!");
		return;
	}
	
	_this.ChunkCount = new THREE.Vector3(
		Math.floor(_this.Game.Dimensions.x/_this.ChunkSize.x),
		Math.floor(_this.Game.Dimensions.y/_this.ChunkSize.y),
		Math.floor(_this.Game.Dimensions.z/_this.ChunkSize.z)
	);
	
	_this.Chunks = [];
	
	_this.GeomIndex = [];
	
	var rclg = new THREE.BoxGeometry(1,1,1);
	var rclnr = new THREE.MeshBasicMaterial({visible: false});
	_this.buildChunks = function() {
		var chunkLoc = new THREE.Vector3();
		var startLoc = new THREE.Vector3();
		var endLoc = new THREE.Vector3();
		for(var i = 0; i < _this.ChunkCount.z; i++) {
			_this.Chunks[i] = [];
			chunkLoc.z = i;
			startLoc.z = i*_this.ChunkSize.z;
			endLoc.z = (i+1)*_this.ChunkSize.z;
			for(var j = 0; j < _this.ChunkCount.y; j++) {
				_this.Chunks[i][j] = [];
				chunkLoc.y = j;
				startLoc.y = j*_this.ChunkSize.y;
				endLoc.y = (j+1)*_this.ChunkSize.y;
				for(var k = 0; k < _this.ChunkCount.x; k++) {
					chunkLoc.x = k;
					startLoc.x = k*_this.ChunkSize.x;
					endLoc.x = (k+1)*_this.ChunkSize.x;
					var nch = {
						VoxDirty: true
					};
					nch.Geom = new THREE.InstancedBufferGeometry();
					nch.Geom.addAttribute('instposition', _this.cubePositions);
					nch.Geom.addAttribute('instuv', _this.cubeUVs);
					nch.Geom.setIndex(new THREE.BufferAttribute(_this.cubeIndices, 1));
					
					nch.IIBuf = new THREE.InstancedInterleavedBuffer(new Float32Array(_this.ChunkSize.x*_this.ChunkSize.y*_this.ChunkSize.z*8), 8, 1).setDynamic(true);
					
					nch.IIColors = new THREE.InterleavedBufferAttribute(nch.IIBuf, 3, 3);
					for(var u = 0, uend = nch.IIColors.count; u < uend; u++) {
						nch.IIColors.setXYZ(u, 1, 0, 1);
					}
					nch.Geom.addAttribute('instmtlcolor', nch.IIColors);
					
					nch.IIVisible = new THREE.InterleavedBufferAttribute(nch.IIBuf, 1, 6);
					for(var u = 0, uend = nch.IIVisible.count; u < uend; u++) {
						nch.IIVisible.setX(u, 0);
					}
					nch.Geom.addAttribute('instvisible', nch.IIVisible);
					
					nch.IIScale = new THREE.InterleavedBufferAttribute(nch.IIBuf, 1, 7);
					for(var u = 0, uend = nch.IIScale.count; u < uend; u++) {
						nch.IIScale.setX(u, 1);
					}
					nch.Geom.addAttribute('instuniscale', nch.IIScale);
					
					
					nch.IIOffsets = new THREE.InterleavedBufferAttribute(nch.IIBuf, 3, 0);
					var iitr = 0;
							for(kk = 0; kk < _this.ChunkSize.z; kk++) {
						for(jj = 0; jj < _this.ChunkSize.y; jj++) {
					for(ii = 0; ii < _this.ChunkSize.x; ii++) {
								nch.IIOffsets.setXYZ(iitr, ii, jj, kk);
								
								iitr++;
							}
						}
					}
					
					nch.Geom.addAttribute('instoffset', nch.IIOffsets);
					
					nch.Mesh = new THREE.Mesh(nch.Geom, _this.cubeShader);
					nch.Mesh.frustumCulled = false;
					
					nch.Mesh.position.set(startLoc.x, startLoc.y, startLoc.z);
					
					_this.Game.Renderer.Scene.add(nch.Mesh);
					
					
					
					nch.GeomS = new THREE.InstancedBufferGeometry();
					nch.GeomS.addAttribute('instposition', _this.cubePositions);
					nch.GeomS.addAttribute('instuv', _this.cubeUVs);
					nch.GeomS.setIndex(new THREE.BufferAttribute(_this.cubeIndices, 1));
					
					nch.IIBufS = new THREE.InstancedInterleavedBuffer(new Float32Array(_this.ChunkSize.x*_this.ChunkSize.y*_this.ChunkSize.z*8), 8, 1).setDynamic(true);
					
					nch.IIColorsS = new THREE.InterleavedBufferAttribute(nch.IIBufS, 3, 3);
					for(var u = 0, uend = nch.IIColorsS.count; u < uend; u++) {
						nch.IIColorsS.setXYZ(u, 1, 0, 1);
					}
					nch.GeomS.addAttribute('instmtlcolor', nch.IIColorsS);
					
					nch.IIVisibleS = new THREE.InterleavedBufferAttribute(nch.IIBufS, 1, 6);
					for(var u = 0, uend = nch.IIVisibleS.count; u < uend; u++) {
						nch.IIVisibleS.setX(u, 0);
					}
					nch.GeomS.addAttribute('instvisible', nch.IIVisibleS);
					
					nch.IIScaleS = new THREE.InterleavedBufferAttribute(nch.IIBufS, 1, 7);
					for(var u = 0, uend = nch.IIScaleS.count; u < uend; u++) {
						nch.IIScaleS.setX(u, 1);
					}
					nch.GeomS.addAttribute('instuniscale', nch.IIScaleS);
					
					
					nch.IIOffsetsS = new THREE.InterleavedBufferAttribute(nch.IIBufS, 3, 0);
					var iitr = 0;
					
					nch.rendColliders = [];
							for(kk = 0; kk < _this.ChunkSize.z; kk++) {
						for(jj = 0; jj < _this.ChunkSize.y; jj++) {
					for(ii = 0; ii < _this.ChunkSize.x; ii++) {
								var rcl = new THREE.Mesh(rclg, rclnr);
								rcl.Game = _this.Game;
								rcl.position.set(ii+startLoc.x,jj+startLoc.y,kk+startLoc.z);
								rcl.GdIndx = _this.Game.Vec3ToIndex(rcl.position);
								rcl.updateMatrix();
								nch.rendColliders.push(rcl);
								_this.Game.UnsafeCode.RaycastObjects.push(rcl);
								_this.Game.Renderer.Scene.add(rcl);
								nch.IIOffsetsS.setXYZ(iitr, ii, jj, kk);
								
								iitr++;
							}
						}
					}
					
					nch.GeomS.addAttribute('instoffset', nch.IIOffsetsS);
					
					nch.MeshS = new THREE.Mesh(nch.GeomS, _this.cubeSolidShader);
					nch.MeshS.frustumCulled = false;
					
					nch.MeshS.position.set(startLoc.x, startLoc.y, startLoc.z);
					
					_this.Game.Renderer.Scene.add(nch.MeshS);
					
					_this.GeomIndex.push(nch.Mesh);
					_this.GeomIndex.push(nch.MeshS);
					
					_this.Chunks[i][j][k] = nch;
				}
			}
		}
	};
	
	_this.setVoxelDirty = function(ind) {
		var coord = _this.Game.IndexToCoord(ind);
		_this.Chunks[Math.floor(coord[2]/_this.ChunkSize.z)][Math.floor(coord[1]/_this.ChunkSize.y)][Math.floor(coord[0]/_this.ChunkSize.x)].VoxDirty = true;
	};
	
	_this.updateChunks = function() {
		var icoord, i, j, k, iind, ii, jj, kk, nch, ityp, ival, iitr;
		for(i = 0; i < _this.ChunkCount.z; i++) {
			for(j = 0; j < _this.ChunkCount.y; j++) {
				for(k = 0; k < _this.ChunkCount.x; k++) {
					
					nch = _this.Chunks[i][j][k]
					if(!nch.VoxDirty) continue;
					nch.VoxDirty = false;
					
					iitr = 0;
					for(ii = 0; ii < _this.ChunkSize.z; ii++) {
						for(jj = 0; jj < _this.ChunkSize.y; jj++) {
							for(kk = 0; kk < _this.ChunkSize.x; kk++) {
								icoord = [k*_this.ChunkSize.x+kk, j*_this.ChunkSize.y+jj, i*_this.ChunkSize.z+ii];
								iind = _this.Game.CoordToIndex(icoord);
								var didRend = false;
								for(var mm = 0; mm < _this.Game.Substances.length; mm++) {
									ival = _this.Game.Val[mm][iind];
									if(ival != 0 && _this.Game.Substances[mm].IsVisible) {
										var sbs = _this.Game.Substances[mm];
										didRend = true;
										if(sbs.IsSolid) {
											nch.IIColorsS.setXYZ(iitr, sbs.Color[0], sbs.Color[1], sbs.Color[2]);
											nch.IIVisible.setX(iitr, 0);
											nch.IIVisibleS.setX(iitr, 1);
											nch.IIScaleS.setX(iitr, 1);
											nch.rendColliders[iitr].visible = true;
										} else {
											nch.IIColors.setXYZ(iitr, sbs.Color[0], sbs.Color[1], sbs.Color[2]);
											nch.IIVisible.setX(iitr, 1);
											nch.IIVisibleS.setX(iitr, 0);
											nch.IIScale.setX(iitr, Math.pow(1-1/(ival+1),4));
											nch.rendColliders[iitr].visible = false;
										}
										break;
									}
								}
								
								if(!didRend) {
									nch.IIVisible.setX(iitr, 0);
									nch.IIVisibleS.setX(iitr, 0);
									nch.rendColliders[iitr].visible = false;
								}
								
								iitr++;
							}
						}
					}
					
					nch.IIBuf.needsUpdate = true;
					nch.IIBufS.needsUpdate = true;
					
				}
			}
		}
	};
	
	// per mesh data x,y,z,w,u,v,s,t for 4-element alignment
	// only use x,y,z and u,v; but x, y, z, nx, ny, nz, u, v would be a good layout
	_this.cubeVertexBuffer = new THREE.InterleavedBuffer( new Float32Array( [
			// Front
			-1, 1, 1, 0, 0, 0, 0, 0,
			1, 1, 1, 0, 1, 0, 0, 0,
			-1, -1, 1, 0, 0, 1, 0, 0,
			1, -1, 1, 0, 1, 1, 0, 0,
			// Back
			1, 1, -1, 0, 1, 0, 0, 0,
			-1, 1, -1, 0, 0, 0, 0, 0,
			1, -1, -1, 0, 1, 1, 0, 0,
			-1, -1, -1, 0, 0, 1, 0, 0,
			// Left
			-1, 1, -1, 0, 1, 1, 0, 0,
			-1, 1, 1, 0, 1, 0, 0, 0,
			-1, -1, -1, 0, 0, 1, 0, 0,
			-1, -1, 1, 0, 0, 0, 0, 0,
			// Right
			1, 1, 1, 0, 1, 0, 0, 0,
			1, 1, -1, 0, 1, 1, 0, 0,
			1, -1, 1, 0, 0, 0, 0, 0,
			1, -1, -1, 0, 0, 1, 0, 0,
			// Top
			-1, 1, 1, 0, 0, 0, 0, 0,
			1, 1, 1, 0, 1, 0, 0, 0,
			-1, 1, -1, 0, 0, 1, 0, 0,
			1, 1, -1, 0, 1, 1, 0, 0,
			// Bottom
			1, -1, 1, 0, 1, 0, 0, 0,
			-1, -1, 1, 0, 0, 0, 0, 0,
			1, -1, -1, 0, 1, 1, 0, 0,
			-1, -1, -1, 0, 0, 1, 0, 0
		] ), 8 );
		
	_this.cubeIndices = new Uint16Array( [
			0, 1, 2,
			2, 1, 3,
			4, 5, 6,
			6, 5, 7,
			8, 9, 10,
			10, 9, 11,
			12, 13, 14,
			14, 13, 15,
			16, 17, 18,
			18, 17, 19,
			20, 21, 22,
			22, 21, 23
		] );
		// geometry
		// Use vertexBuffer, starting at offset 0, 3 items in position attribute
	_this.cubePositions = new THREE.InterleavedBufferAttribute(_this.cubeVertexBuffer, 3, 0 );
		// Use vertexBuffer, starting at offset 4, 2 items in uv attribute
	_this.cubeUVs = new THREE.InterleavedBufferAttribute(_this.cubeVertexBuffer, 2, 4);
	_this.cubeShader = new THREE.ShaderMaterial({
		uniforms: {ofsScale: {value: 0.95}},
		extensions: {
			fragDepth: true,
			drawBuffers: true
		},
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
		side: THREE.DoubleSide,
		transparent: true,
		alphaTest: false,
		depthTest: true,
		depthWrite: false,
		blending: 2
	});
	_this.cubeSolidShader = new THREE.ShaderMaterial({
		uniforms: {ofsScale: {value: 1.0}},
		extensions: {
			fragDepth: true,
			drawBuffers: true
		},
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
		side: THREE.DoubleSide,
		transparent: false
	});
};