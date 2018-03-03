//Various utility functions for WebCW.
//DEPENDENCIES: None.

//Terminology for documentation:
//Any variable names are in [].
//Variable types:
//var: Literally any variable.
//var[]: Any array.
//Object: Any JavaScript object.
//Map: An object initialized with the {prop: value, prop: value...} format.
//number: Number-type variables.
//Below, "fill-in-the-blanks" also follow this format.
//
//Function header:
////[returntype] [functionName]([vartype] [varname], [vartype] [varname]...): [Brief summary]
//[In-depth description of function's behavior]
//[vartype] [varname]: [In-depth description of variable]
//[returntype] [functionName]: [In-depth description of output]


////////////////
//////MATH//////
////////////////
////These functions provide basic math functionality.

////number Math.clamp(number num, number min, number max): Limits a number to a certain range.
//If [num] is less than [min], returns [min]. If [num] is greater than [max], returns [max]. Otherwise, returns [num].
//number [num]: The number to perform clamping on.
//number [min]: The minimum bound for the output number.
//number [max]: The maximum bound for the output number.
//number Math.clamp: The result of the clamping operation.
Math.clamp = function(num, min, max) {
	return num <= min ? min : num >= max ? max : num;
};

////number ModulusIndex(number ind, number min, number max): Similar to Math.Clamp; loops instead.
//"Wraps" [num] around between the range [min]-->[max].
//number [num]: The number to perform wrapping on.
//number [min]: The minimum bound for the output number.
//number [max]: The maximum bound for the output number.
//number Math.clamp: The result of the wrapping operation.
var ModulusIndex = function(ind, min, max) {
	var ifrac = (ind-min)/(max-min);
	return ((((ifrac%1)+1)%1)) * (max-min) + min;
};

////Map GLOBALS: Contains useful constants, to avoid extra calculations.
var GLOBALS = {
	PiDiv2: Math.PI/2,
	PiMul2: Math.PI*2
};

var StepFloor = function(flt, step) {
	return Math.floor(flt*step)/step;
}

var SphrLookup = function(atheta, aphi) {
	return new THREE.Vector3(Math.cos(atheta)*Math.cos(aphi), Math.sin(atheta)*Math.cos(aphi), Math.sin(aphi));
};



/////////////////////////
//////ARRAY/LOOPING//////
/////////////////////////
////These functions assist in iterating through arrays.



///////////////////////
//////READABILITY//////
///////////////////////
////These functions are "shorthands" for already short-to-medium, oft-repeated snippets.
////These are designed to make code read more naturally to a human mind.

////bool isUndef(var arg): Returns TRUE if [arg] is undefined, and FALSE if it is defined.
var isUndef = function(arg) {
	return (typeof arg === 'undefined');
};
////bool isDef(var arg): Returns TRUE if [arg] is defined, and FALSE if it is undefined.
var isDef = function(arg) {
	return (typeof arg !== 'undefined');
};

////void estabObjPath(string path): Recursively creates an object path IFF it isn't already defined.
//Some code/inspiration from https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
var estabObjPath = function(path) {
	path = path.split('.');
	var i, len;
	var testMaster = path[0];
	for(i = 1, len = path.length; i < len; i++) {
		testObj = path[i];
		if(isUndef(testMaster[testObj])) {
			testMaster[testObj] = {};
			console.log("added " + testObj + " to " + testMaster);
		}
		testMaster = testMaster[testObj]; 
	}
};

/////////////////////////////
//////ARGUMENTS HANDLER//////
/////////////////////////////
////This is "boilerplate" for object constructors. Objects that use these can be initialized with maps with variable names of [RequiredArgs] or [DefaultArgs].
////If the object has a [RequiredArgs] list, then initArgs will iterate through it and throw an exception if one of the names in that list is not also present in the arguments map [Args] that the user provided.
////If the object has a [DefaultArgs] map, then initArgs will iterate through it after the user's [Args] are assigned, and replace any compatible undefined values with those in [DefaultArgs].

////var opArg(var arg, var dft): Returns [dft] if [arg] is undefined, and [arg] otherwise.
var opArg = function(arg, dft) {
	return isUndef(arg) ? dft : arg;
};

////var opArgGen(var arg, var dft, var dftobj, var dftargs): A "safe" version of opArg that calls an argument-generating function IFF the default is used -- allowing shenanigans with e.g. incrementing global variables for only defaulted args.
var opArgGen = function(arg, dft, dftobj, dftargs) {
	if(isDef(arg)) return arg;
	return dft(dftobj, dftargs);
};

////var noOpArg(var arg): Returns [arg], and throws a browser exception if [arg] is undefined.
var noOpArg = function(arg, name) {
	if(isUndef(arg)) throw("A function that required a defined value for argument \"" + name + "\" received undefined instead!");
	return arg;
};

////var initArgs(Object obj, Map args): 
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