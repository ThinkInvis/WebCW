//Handles simple fixed-timestep logic, and can call both render (every loop) and physics (uses fixed timestep only) callbacks.
//DEPENDENCIES: WebCW/utils.js

//TODO: Integration logic for dilation?


var FixedTimestepLoop = function(args) {
	//SETUP
	var _this = this;
	_this.DefaultArgs = {
		Step: 0.05, //The amount of time to simulate per tick.
		Callback: function() {}, //The function to call for every simtick. Will be passed the current sim time, the delta time, and the list of additional arguments.
		FrameCallback: function() {}, //The function to call for every loop. Will be passed the current sim time, the real time, the fractional frame (accumulator progress towards next frame), and the list of additional arguments (after any modification by the main callback).
		Cutoff: 5, //Hard cutoff for number of simulation ticks per frame. High values may cause unresponsiveness or complete freezes if one simulation tick takes too long
		Dilation: 1 //Multiplier for simtime relative to realtime.
	};
	initArgs(_this, args);
	
	//PUBLIC VARS
	_this.RealStep = _this.Step;
	_this.SimStep = _this.Step;
	_this.RealTime = 0; //The total real time spent by the accumulator.
	_this.SimTime = 0; //The total time spent by the accumulator, modified by Dilation.
	_this.Accum = 0; //"Accumulates" time. This keeps track of whether the target framerate is being met.
	//_this.Cutoff = opArg(args.Cutoff, 5); 
	_this.Args = {ParentLoop: _this}; //A list of additional arguments that is passed to callbacks.
	
	//PRIVATE VARS
	var LastTime; //Holds the last value of RealTime. Used for delta measurement.
	var LoopContinue = false; //Set to "false" to cancel any current loop and prevent the loop function from being called. Modified by Begin and End functions; use "isRunning" to get value.
	var LoopInProgress = false; //Is set to "true" when the loop starts and to "false" when it ends. Used to prevent multiple loop instances from running at once for one TFTL object instance.
	
	//FUNCTIONS
	//Handles the loop logic. Passed 'timestamp' by the window.requestAnimationFrame function.
	_this.Loop = function(timestamp) {
		if(!LoopContinue || LoopInProgress) return;
		LoopInProgress = true;
		var tsd = timestamp/1000;
		if(isUndef(LastTime)) LastTime = tsd;
		var dt = tsd - LastTime;
		_this.Accum += dt;
		var prog = _this.Accum/dt;
		for(var ind = 0; ind < _this.Cutoff; ind++) {
			if(_this.Accum < _this.Step) break;
			_this.Callback(_this.SimTime, _this.Step * _this.Dilation, _this.Args);
			_this.Accum -= _this.Step;
			_this.RealTime += _this.Step;
			_this.SimTime += _this.Step * _this.Dilation;
		}
		LastTime = tsd;
		_this.FrameCallback(_this.SimTime, _this.Step * _this.Dilation, _this.Args);
		LoopInProgress = false;
		window.requestAnimationFrame(_this.Loop);
	};
	//Sets the "continue" option to true and starts the loop function.
	_this.Begin = function() {
		if(LoopInProgress || LoopContinue) return;
		LoopContinue = true;
		window.requestAnimationFrame(_this.Loop);
	};
	//Sets the "continue" option to false, which will cause the loop function to stop the next time it is called.
	_this.End = function() {
		LoopContinue = false;
	};
	_this.isRunning = function() {
		return LoopContinue;
	};
};

//Variant of FixedTimestepLoop that attempts to send signals for "partial" frames. WORK IN PROGRESS.
var ThrottledFixedTimestepLoop = function(args) {
	//SETUP
	var _this = this;
	_this.DefaultArgs = {
		SimStep: 0.02, //The amount of "physical" time passed per simulation tick.
		RealStep: 0.05, //The ideal maximum amount of real time to spend actually simulating per frame. Handles cutoff logic.
		TerminationMode: 1, //If 0, never stops draining the accumulator early. If 1 or 2, stops draining the accumulator (and e.g. allows a render frame) if SimProgress reaches 100%. If 2, also simulates the rest of the accumulator time as "empty ticks" (increments nothing, just decrements accumulator as close to 0 as possible) when this occurs. Use in order of lowest to highest relative runtime of your callback function (expensive functions should use 2, cheap functions should use 0).
		Callback: function() {},
		FrameCallback: function() {},
		Cutoff: 5,
		Dilation: 1, //Modifies only SimStep. Still useful for keeping track of what the timestep is "supposed" to be.
		SimSplit: 0.1 //The amount of progress increment to allow the callback function. Lower values may cause slowness in simulation; higher values may cause framerate choking.
	};
	initArgs(_this, args);
	
	//PUBLIC VARS
	_this.Accum = 0;
	_this.Args = {ParentLoop: _this};
	_this.RealTime = 0; //Measures actual time consumed by the accumulator.
	_this.SimTime = 0; //Measures simulated time passed to the callback.
	_this.SimProgress = 0; //Between 0 and 1. Handled by loop logic; passed to the callback to tell it how much to simulate.
	
	//PRIVATE VARS
	var LastTime;
	var LoopContinue = false;
	var LoopInProgress = false;
	
	_this.Loop = function(timestamp) {
		if(!LoopContinue || LoopInProgress) return;
		LoopInProgress = true;
		var tsd = timestamp/1000;
		if(isUndef(LastTime)) LastTime = tsd;
		var dt = tsd - LastTime;
		_this.Accum += dt;
		var prog = _this.Accum/dt;
		for(var ind = 0; ind < _this.Cutoff; ind++) {
			if(_this.Accum < _this.Step) break;
			var rstep = (1-_this.SimProgress);
			var isFinal = _this.SimSplit >= rstep;
			var nstep = isFinal ? rstep : _this.SimSplit;
			_this.Args.DoProgress = nstep;
			_this.Args.Finalize = isFinal;
			_this.Callback(_this.SimTime, _this.SimStep * _this.Dilation, _this.Args); //Args: current time, delta time, start sim at, end sim at, finalize flag, extra arg list
			_this.Accum -= _this.RealStep;
			_this.RealTime += _this.RealStep;
			_this.SimProgress += _this.SimSplit;
			if(isFinal) {
				_this.SimProgress = 0;
				_this.SimTime += _this.SimStep * _this.Dilation;
				if(_this.TerminationMode === 2) _this.Accum = _this.Accum % _this.RealStep;
				if(_this.TerminationMode > 0) break;
			}
		}
		LastTime = tsd;
		_this.FrameCallback(_this.SimTime, _this.Step * _this.Dilation, _this.Args);
		LoopInProgress = false;
		window.requestAnimationFrame(_this.Loop);
	};
	_this.Begin = function() {
		if(LoopInProgress || LoopContinue) return;
		LoopContinue = true;
		window.requestAnimationFrame(_this.Loop);
	};
	_this.End = function() {
		LoopContinue = false;
	};
	_this.isRunning = function() {
		return LoopContinue;
	};
};