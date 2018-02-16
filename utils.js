//Various utility functions for WebCW.
//DEPENDENCIES: None.

//Terminology for documentation:
//Any variable names are in [].
//Variable types:
//var: Literally any variable.
//var[]: Any array.
//Object: Any JavaScript object.
//Map: An object initialized with the {prop: value, prop: value...} format.
//Below, "fill-in-the-blanks" also follow this format.
//
//Function header:
////[returntype] [functionName]([vartype] [varname], [vartype] [varname]...): [Brief summary]
//[In-depth description of function's behavior]
//[vartype] [varname]: [In-depth description of variable]
//[returntype] [functionName]: [In-depth description of output]

Math.clamp = function(num, min, max) {
	return num <= min ? min : num >= max ? max : num;
};

var UtilSettings = {
	SphrLookupRes: 8 //Controls how many entries there are in the Spherical Coordinates Lookup Table. e.g. 6 means 4096 (2^(6*2)) entries/coord, encompassing 64 (2^6) values of each angular coordinate.
};

//Contains some extra constants and such

var GLOBALS = {
	PiDiv2: Math.PI/2,
	PiMul2: Math.PI*2
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

var StepFloor = function(flt, step) {
	return Math.floor(flt*step)/step;
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

var SphrLookup = function(atheta, aphi) {
	return new THREE.Vector3(Math.cos(atheta)*Math.cos(aphi), Math.sin(atheta)*Math.cos(aphi), Math.sin(aphi));
};

/////////////////////////
//////ARRAY/LOOPING//////
/////////////////////////
////These functions assist in iterating through arrays.

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

/*var indexToCoords = function(ind, gridsize) {
	var cz = Math.floor(ind/gridsize[2]);
	var cy = Math.floor((ind-cz*gridsize[2])/gridsize[1]);
	var cx = ind-cy*gridsize[1]-cz*gridsize[2];
	return [cx, cy, cz];
};*/

var ModulusIndex = function(ind, min, max) {
	var ifrac = (ind-min)/(max-min);
	
	//return 
	//console.log(min + ">" + ind + ">" + max + ": " + ifrac);
	return ((((ifrac%1)+1)%1)) * (max-min) + min;
	//ifrac -= Math.floor(ifrac);
	//if(ifrac < 0) ifrac=1-ifrac;
	//return ifrac*(max-min)+min;
	//return (ind - min) % (max - min);
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

///////////////////////
//////READABILITY//////
///////////////////////
////These functions are "shorthands" for already short-to-medium, oft-repeated snippets.
////These are designed to make code read more naturally to a human mind.

//bool isUndef(var arg): Returns TRUE if [arg] is undefined, and FALSE if it is defined.
var isUndef = function(arg) {
	return (typeof arg === 'undefined');
};
//bool isDef(var arg): Returns TRUE if [arg] is defined, and FALSE if it is undefined.
var isDef = function(arg) {
	return (typeof arg !== 'undefined');
};

/////////////////////////////
//////ARGUMENTS HANDLER//////
/////////////////////////////
////This is "boilerplate" for object constructors. Objects that use these can be initialized with maps with variable names of [RequiredArgs] or [DefaultArgs].
////If the object has a [RequiredArgs] list, then initArgs will iterate through it and throw an exception if one of the names in that list is not also present in the arguments map [Args] that the user provided.
////If the object has a [DefaultArgs] map, then initArgs will iterate through it after the user's [Args] are assigned, and replace any compatible undefined values with those in [DefaultArgs].

//var opArg(var arg, var dft): Returns [dft] if [arg] is undefined, and [arg] otherwise.
var opArg = function(arg, dft) {
	return isUndef(arg) ? dft : arg;
};

var opArgGen = function(arg, dft, dftobj, dftargs) {
	if(isDef(arg)) return arg;
	return dft(dftobj, dftargs);
};
//var noOpArg(var arg): Returns [arg], and throws an exception if [arg] is undefined.
var noOpArg = function(arg, name) {
	if(isUndef(arg)) throw("A function that required a defined value for argument \"" + name + "\" received undefined instead!");
	return arg;
};
//var initArgs(Object obj, Map args): 
var initArgs = function(obj, args) {
	if(isDef(obj.RequiredArgs)) {
		var rqar;
		for(var iarg = 0; iarg < obj.RequiredArgs.length; iarg++) {
			rqar = obj.RequiredArgs[iarg];
			obj[rqar] = noOpArg(args[rqar], rqar);
		}
	}
	if(isDef(obj.DefaultArgs)) {
		for(var dftar in obj.DefaultArgs) {
			obj[dftar] = opArg(args[dftar], obj.DefaultArgs[dftar]);
		}
	}
	if(isDef(obj.DftGenArgs)) {
		for(var dftgar in obj.DftGenArgs) {
			obj[dftgar] = opArgGen(args[dftgar], obj.DftGenArgs[dftgar], obj, args);
		}
	}
	for(var setar in args) {
		obj[setar] = args[setar];
	}
};