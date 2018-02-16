//This file contains discarded, not-in-use, or otherwise WIP experiments from other files, which no longer belonged there.


//Originally in utils.js: Spherical Coordinates Lookup Table
var UtilSettings = {
	SphrLookupRes: 8 //Controls how many entries there are in the Spherical Coordinates Lookup Table. e.g. 6 means 4096 (2^(6*2)) entries/coord, encompassing 64 (2^6) values of each angular coordinate.
};

GLOBALS.SphrLookupStep = Math.pow(2,UtilSettings.SphrLookupRes);
GLOBALS.SphrLookupStepDual = Math.pow(2, UtilSettings.SphrLookupRes*2);
GLOBALS.SphrLookupStepSq = Math.pow(GLOBALS.SphrLookupStep, 2);
GLOBALS.SphrLookupX = new Float32Array(GLOBALS.SphrLookupStepDual);
GLOBALS.SphrLookupY = new Float32Array(GLOBALS.SphrLookupStepDual);
GLOBALS.SphrLookupZ = new Float32Array(GLOBALS.SphrLookupStepDual);
//Spherical Coordinates lookup table
var slind = 0;
var sltheta, slphi;
for(var i = 0; i < GLOBALS.SphrLookupStep; i++) {
	for(var j = 0; j < GLOBALS.SphrLookupStep; j++) {
		sltheta = (i/GLOBALS.SphrLookupStep)*GLOBALS.PiMul2;
		slphi = (j/GLOBALS.SphrLookupStep-0.5)*Math.PI;
		GLOBALS.SphrLookupX[slind] = Math.cos(sltheta)*Math.cos(slphi);
		GLOBALS.SphrLookupY[slind] = Math.sin(sltheta)*Math.cos(slphi);
		GLOBALS.SphrLookupZ[slind] = Math.sin(slphi);
		//GLOBALS.SphrLookupTheta[slind] = sltheta;
		//GLOBALS.SphrLookupPhi[slind] = slphi;
		slind++;
	}
}

/*var SphrLookup = function(atheta, aphi) {
	//atheta = Math.clamp(atheta, 0, Math.PI);
	//Theta from 0 to 2PI
	//Phi from -PI/2 to PI/2
	var thetafrac = Math.floor(atheta/GLOBALS.PiMul2*GLOBALS.SphrLookupStepSq);
	var phifrac = Math.floor((aphi+GLOBALS.PiDiv2)/Math.PI*GLOBALS.SphrLookupStep);
	var sphrind = Math.clamp(thetafrac,0,GLOBALS.SphrLookupStepSq-1)+Math.clamp(phifrac,0,GLOBALS.SphrLookupStep-1);
	return new THREE.Vector3(GLOBALS.SphrLookupX[sphrind], GLOBALS.SphrLookupY[sphrind], GLOBALS.SphrLookupZ[sphrind]);
}*/


////var[] arrFilteredIter(var[] arr, function lookupFn, function cbFn): Performs a function on array.filter results.
//Filters the array [arr] by a filtering function [lookupFn], and calls [cbFn] only on those array values which match the filter. Returns the filtered array once complete. Provides an additional "matchedIndex" parameter to the callback function.
//var[] arr: The array to filter.
//function lookupFn: The filter function to use in array.filter.
//function cbFn: The function to iterate over filtered results.
//var[] arrFilteredIter: The result of the normal array.filter function, performed on [arr].
var arrFilteredIter = function(arr, lookupFn, cbFn) {
	var matchedIndex = 0;
	return arr.filter(function(val) {
		if(lookupFn(val)) {
			cbFn(val, matchedIndex);
			matchedIndex++;
			return true;
		} else return false;
	});
};


//High-performance test variant of Iterate3D; also leaves returning/collection to callback and parent funciton
var Iterate3DF = function(arr, rowsize, layersize, totalsize, callback) {
	var i, j, k;
	for(k = 0; k < totalsize; k+=layersize) {
		for(j = 0; j < layersize; j+=rowsize) {
			for(i = 0; i < rowsize; i++) {
				callback(arr[k+j+i], i, j, k);
			}
		}
	}
};

var Iterate3D = function(arr, callback, passthru, lobounds, hibounds) {
	passthru.ParentArray = arr;
	var ibounds = opArgGen(lobounds, function(){return new THREE.Vector3(0, 0, 0);});
	var fbounds = opArgGen(hibounds, function(){return new THREE.Vector3(arr.length, arr[0].length, arr[0][0].length);});
	var iindex = new THREE.Vector3(0, 0, 0);
	passthru.IterIndex = iindex;
	passthru.IterStep = 0;
	passthru.IterStart = ibounds;
	passthru.IterEnd = fbounds;
	var ret = [];
	for(iindex.z=ibounds.z; iindex.z < fbounds.z; iindex.z++) {
		ret.push([]);
		for(iindex.y=ibounds.y; iindex.y < fbounds.y; iindex.y++) {
			ret[ret.length-1].push([]);
			for(iindex.x=ibounds.x; iindex.x < fbounds.x; iindex.x++) {
				ret[ret.length-1][ret[ret.length-1].length-1].push(callback(arr[iindex.x][iindex.y][iindex.z], iindex, passthru));
				passthru.IterStep++;
			}
		}
	}
	return ret;
};