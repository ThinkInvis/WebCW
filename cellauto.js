//Support function library for 3D decimal Cellular Automata
//DEPENDENCIES: three.js, WebCW/utils.js

var CellAuto3D = function(crargs) {
	//SETUP
	var _this = this;
	_this.DefaultArgs = {
		InitialVal: function(pos) {return 0;},
		BoundaryVal: function(pos) {return 0;},
		InitialType: function(pos) {return 0;},
		BoundaryType: function(pos) {return 0;}
	};
	_this.RequiredArgs = [
		"GdSize"
	];
	initArgs(_this, crargs);
	
	_this.LayerSize = _this.GdSize.y * _this.GdSize.x
	_this.TotalSize = _this.GdSize.z * _this.LayerSize;
	
	//PUBLIC VARS
	_this.Dirty = new Uint8Array(_this.TotalSize);
	//uint8array: maximum of 256 substance types
	_this.Type = new Uint8Array(_this.TotalSize);
	_this.Val = new Float32Array(_this.TotalSize);
	_this.TypeOoP = new Uint8Array(_this.TotalSize);
	_this.ValOoP = new Float32Array(_this.TotalSize);
	
	//uint16array: maximum map size is 65535x65535x65535
	_this.CoordsX = new Uint16Array(_this.TotalSize);
	_this.CoordsY = new Uint16Array(_this.TotalSize);
	_this.CoordsZ = new Uint16Array(_this.TotalSize);
	
	_this.Bounds = new Uint8Array(_this.TotalSize);
	
	_this.IterVonNeumann = function(callbackIter, callbackClone) {
		var ipx, imx, ipy, imy, ipz, imz, ibuf;
		for(ind = 0; ind < _this.TotalSize; ind++) {
			ipx = ind+1;
			imx = ind-1;
			ipy = ind+_this.GdSize.x;
			imy = ind-_this.GdSize.x;
			ipz = ind+_this.LayerSize;
			imz = ind-_this.LayerSize;
			_this.Dirty[ind] = callbackIter(ind, ipx, imx, ipy, imy, ipz, imz);
		}
		
		for(ind = 0; ind < _this.TotalSize; ind++) {
			callbackClone(ind, _this.Type[ind], _this.Val[ind], _this.Dirty[ind] == 1);
			_this.Type[ind] = _this.TypeOoP[ind];
			_this.Val[ind] = _this.ValOoP[ind];
		}
	};
	
	_this.IsIndValid = function(ind) {
		return ind >= 0 && ind < _this.TotalSize;
	};
	_this.IsCoordValid = function(crd) {
		return (crd[0] >= 0 && crd[0] < _this.GdSize.x)
		&& (crd[1] >= 0 && crd[1] < _this.GdSize.y)
		&& (crd[2] >= 0 && crd[2] < _this.GdSize.z);
	};
	
	_this.GetValWithBoundary = function(ind, bflg) {
		if(_this.Bounds[ind] & bflg) return _this.BoundaryVal(_this.IndexToCoord(ind));
		return _this.Val[ind];
	};
	_this.GetTypeWithBoundary = function(ind, bflg) {
		if(_this.Bounds[ind] & bflg) return _this.BoundaryType(_this.IndexToCoord(ind));
		return _this.Type[ind];
	};
	_this.AddCell = function(ind, ntyp, nval) {
		if(ntyp === _this.TypeOoP[ind]) {
			_this.ValOoP[ind] += nval;
		} else { //TODO: interactions list/check...
			_this.TypeOoP[ind] = ntyp;
			_this.ValOoP[ind] = nval;
		}
	}
	_this.SetTypeBound = function(ind, ntyp) {
		if(_this.IsIndValid(ind)) _this.TypeOoP[ind] = ntyp;
	}
	_this.SetValBound = function(ind, nval) {
		if(_this.IsIndValid(ind)) _this.ValOoP[ind] = nval;
	}
	
	_this.Vec3ToIndex = function(pos) {
		return pos.z * _this.LayerSize + pos.y * _this.GdSize.x + pos.x;
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
		return crd[2] * _this.LayerSize + crd[1] * _this.GdSize.x + crd[0];
	};
	
	//build coordinate buffers
	var ind = 0;
	for(var k = 0; k < _this.GdSize.z; k++) {
		for(var j = 0; j < _this.GdSize.y; j++) {
			for(var i = 0; i < _this.GdSize.x; i++) {
				_this.CoordsX[ind] = i;
				_this.CoordsY[ind] = j;
				_this.CoordsZ[ind] = k;
				_this.Val[ind] = _this.InitialVal(_this.IndexToCoord(ind));
				_this.Type[ind] = _this.InitialType(_this.IndexToCoord(ind));
				_this.ValOoP[ind] = _this.Val[ind];
				_this.TypeOoP[ind] = _this.Type[ind];
				
				_this.Bounds[ind] = ((i == 0) ? 1 : 0) | ((i == (_this.GdSize.x - 1)) ? 2 : 0) | ((j == 0) ? 4 : 0) | ((j == (_this.GdSize.y - 1)) ? 8 : 0) | ((k == 0) ? 16 : 0) | ((k == (_this.GdSize.z - 1)) ? 32 : 0);
				
				ind++;
			}
		}
	}
	
};