//Handles all keyboard/mouse IO; should be passed to any other module that requires such inputs instead of giving them their own binds
WebCW.BrowserInterface = function(args) {
	var _this = this;
	_this.DefaultArgs = {
		BlockedKeys: [],
		keyDownHandlers: [],
		keyUpHandlers: [],
		keyTickHandlers: [],
		mouseMoveHandlers: []
	};
	initArgs(_this, args);
	
	////Input Handling
	//https://stackoverflow.com/questions/1772179/get-character-value-from-keycode-in-javascript-then-trim
	_this.KeyMap = [
		"", // [0]
		"", // [1]
		"", // [2]
		"CANCEL", // [3]
		"", // [4]
		"", // [5]
		"HELP", // [6]
		"", // [7]
		"BACK_SPACE", // [8]
		"TAB", // [9]
		"", // [10]
		"", // [11]
		"CLEAR", // [12]
		"ENTER", // [13]
		"ENTER_SPECIAL", // [14]
		"", // [15]
		"SHIFT", // [16]
		"CONTROL", // [17]
		"ALT", // [18]
		"PAUSE", // [19]
		"CAPS_LOCK", // [20]
		"KANA", // [21]
		"EISU", // [22]
		"JUNJA", // [23]
		"FINAL", // [24]
		"HANJA", // [25]
		"", // [26]
		"ESCAPE", // [27]
		"CONVERT", // [28]
		"NONCONVERT", // [29]
		"ACCEPT", // [30]
		"MODECHANGE", // [31]
		"SPACE", // [32]
		"PAGE_UP", // [33]
		"PAGE_DOWN", // [34]
		"END", // [35]
		"HOME", // [36]
		"LEFT", // [37]
		"UP", // [38]
		"RIGHT", // [39]
		"DOWN", // [40]
		"SELECT", // [41]
		"PRINT", // [42]
		"EXECUTE", // [43]
		"PRINTSCREEN", // [44]
		"INSERT", // [45]
		"DELETE", // [46]
		"", // [47]
		"0", // [48]
		"1", // [49]
		"2", // [50]
		"3", // [51]
		"4", // [52]
		"5", // [53]
		"6", // [54]
		"7", // [55]
		"8", // [56]
		"9", // [57]
		"COLON", // [58]
		"SEMICOLON", // [59]
		"LESS_THAN", // [60]
		"EQUALS", // [61]
		"GREATER_THAN", // [62]
		"QUESTION_MARK", // [63]
		"AT", // [64]
		"A", // [65]
		"B", // [66]
		"C", // [67]
		"D", // [68]
		"E", // [69]
		"F", // [70]
		"G", // [71]
		"H", // [72]
		"I", // [73]
		"J", // [74]
		"K", // [75]
		"L", // [76]
		"M", // [77]
		"N", // [78]
		"O", // [79]
		"P", // [80]
		"Q", // [81]
		"R", // [82]
		"S", // [83]
		"T", // [84]
		"U", // [85]
		"V", // [86]
		"W", // [87]
		"X", // [88]
		"Y", // [89]
		"Z", // [90]
		"OS_KEY", // [91] Windows Key (Windows) or Command Key (Mac)
		"", // [92]
		"CONTEXT_MENU", // [93]
		"", // [94]
		"SLEEP", // [95]
		"NUMPAD0", // [96]
		"NUMPAD1", // [97]
		"NUMPAD2", // [98]
		"NUMPAD3", // [99]
		"NUMPAD4", // [100]
		"NUMPAD5", // [101]
		"NUMPAD6", // [102]
		"NUMPAD7", // [103]
		"NUMPAD8", // [104]
		"NUMPAD9", // [105]
		"MULTIPLY", // [106]
		"ADD", // [107]
		"SEPARATOR", // [108]
		"SUBTRACT", // [109]
		"DECIMAL", // [110]
		"DIVIDE", // [111]
		"F1", // [112]
		"F2", // [113]
		"F3", // [114]
		"F4", // [115]
		"F5", // [116]
		"F6", // [117]
		"F7", // [118]
		"F8", // [119]
		"F9", // [120]
		"F10", // [121]
		"F11", // [122]
		"F12", // [123]
		"F13", // [124]
		"F14", // [125]
		"F15", // [126]
		"F16", // [127]
		"F17", // [128]
		"F18", // [129]
		"F19", // [130]
		"F20", // [131]
		"F21", // [132]
		"F22", // [133]
		"F23", // [134]
		"F24", // [135]
		"", // [136]
		"", // [137]
		"", // [138]
		"", // [139]
		"", // [140]
		"", // [141]
		"", // [142]
		"", // [143]
		"NUM_LOCK", // [144]
		"SCROLL_LOCK", // [145]
		"WIN_OEM_FJ_JISHO", // [146]
		"WIN_OEM_FJ_MASSHOU", // [147]
		"WIN_OEM_FJ_TOUROKU", // [148]
		"WIN_OEM_FJ_LOYA", // [149]
		"WIN_OEM_FJ_ROYA", // [150]
		"", // [151]
		"", // [152]
		"", // [153]
		"", // [154]
		"", // [155]
		"", // [156]
		"", // [157]
		"", // [158]
		"", // [159]
		"CIRCUMFLEX", // [160]
		"EXCLAMATION", // [161]
		"DOUBLE_QUOTE", // [162]
		"HASH", // [163]
		"DOLLAR", // [164]
		"PERCENT", // [165]
		"AMPERSAND", // [166]
		"UNDERSCORE", // [167]
		"OPEN_PAREN", // [168]
		"CLOSE_PAREN", // [169]
		"ASTERISK", // [170]
		"PLUS", // [171]
		"PIPE", // [172]
		"HYPHEN_MINUS", // [173]
		"OPEN_CURLY_BRACKET", // [174]
		"CLOSE_CURLY_BRACKET", // [175]
		"TILDE", // [176]
		"", // [177]
		"", // [178]
		"", // [179]
		"", // [180]
		"VOLUME_MUTE", // [181]
		"VOLUME_DOWN", // [182]
		"VOLUME_UP", // [183]
		"", // [184]
		"", // [185]
		"SEMICOLON", // [186]
		"EQUALS", // [187]
		"COMMA", // [188]
		"MINUS", // [189]
		"PERIOD", // [190]
		"SLASH", // [191]
		"BACK_QUOTE", // [192]
		"", // [193]
		"", // [194]
		"", // [195]
		"", // [196]
		"", // [197]
		"", // [198]
		"", // [199]
		"", // [200]
		"", // [201]
		"", // [202]
		"", // [203]
		"", // [204]
		"", // [205]
		"", // [206]
		"", // [207]
		"", // [208]
		"", // [209]
		"", // [210]
		"", // [211]
		"", // [212]
		"", // [213]
		"", // [214]
		"", // [215]
		"", // [216]
		"", // [217]
		"", // [218]
		"OPEN_BRACKET", // [219]
		"BACK_SLASH", // [220]
		"CLOSE_BRACKET", // [221]
		"QUOTE", // [222]
		"", // [223]
		"META", // [224]
		"ALTGR", // [225]
		"", // [226]
		"WIN_ICO_HELP", // [227]
		"WIN_ICO_00", // [228]
		"", // [229]
		"WIN_ICO_CLEAR", // [230]
		"", // [231]
		"", // [232]
		"WIN_OEM_RESET", // [233]
		"WIN_OEM_JUMP", // [234]
		"WIN_OEM_PA1", // [235]
		"WIN_OEM_PA2", // [236]
		"WIN_OEM_PA3", // [237]
		"WIN_OEM_WSCTRL", // [238]
		"WIN_OEM_CUSEL", // [239]
		"WIN_OEM_ATTN", // [240]
		"WIN_OEM_FINISH", // [241]
		"WIN_OEM_COPY", // [242]
		"WIN_OEM_AUTO", // [243]
		"WIN_OEM_ENLW", // [244]
		"WIN_OEM_BACKTAB", // [245]
		"ATTN", // [246]
		"CRSEL", // [247]
		"EXSEL", // [248]
		"EREOF", // [249]
		"PLAY", // [250]
		"ZOOM", // [251]
		"", // [252]
		"PA1", // [253]
		"WIN_OEM_CLEAR", // [254]
		"", // [255]
		//CUSTOM to this program, above 255 -- used for mouse buttons
		//If any physical input device sends these values to the browser, then shit's messed up, but it's not our fault because things shouldn't be doing that anyways!
		"MOUSE_LEFT",
		"MOUSE_RIGHT",
		"MOUSE_MIDDLE",
		"MOUSE_FORWARD",
		"MOUSE_BACK"
	];

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
	
	_this.onDocumentKeyDown = function( event ) {
		if(!_this.KeyDownArr[event.which]) {
			_this.KeyHoldDuration[event.which] = 0;
			_this.KeyDownArr[event.which] = true;
			_this.KeysToProcess.push([event.which, 1]);
		}
		if(_this.BlockedKeys[event.which]) event.preventDefault();
	};
	
	_this.onDocumentKeyUp = function( event ) {
		if(_this.KeyDownArr[event.which]) {
			_this.KeyDownArr[event.which] = false;
			_this.KeysToProcess.push([event.which, 0]);
		}
		if(_this.BlockedKeys[event.which]) event.preventDefault();
	};
	
	_this.onDocumentMouseMove = function(event) {
		_this.MouseDelta.set(event.screenX - _this.MousePos.x, event.screenY - _this.MousePos.y);
		_this.MousePos.set(event.screenX, event.screenY);
		_this.CliMouseDelta.set(event.clientX - _this.CliMousePos.x, event.clientY - _this.CliMousePos.y);
		_this.CliMousePos.set(event.clientX, event.clientY);
		_this.MouseMoveToProcess.push([new THREE.Vector2().copy(_this.MouseDelta), new THREE.Vector2().copy(_this.MousePos)]);
	};
	
	_this.MouseBtnIndices = [[1,"MOUSE_LEFT",256],[2,"MOUSE_RIGHT",257],[4,"MOUSE_MIDDLE",258],[8,"MOUSE_FORWARD",259],[16,"MOUSE_BACK",260]];
	_this.onDocumentMouseDown = function(event) {
		for(var i = 0; i < _this.MouseBtnIndices.length; i++) {
			if((event.buttons & _this.MouseBtnIndices[i][0]) == _this.MouseBtnIndices[i][0]) {
				var btn = _this.MouseBtnIndices[i][2];
				if(!_this.KeyDownArr[btn]) {
					_this.KeyHoldDuration[btn] = 0;
					_this.KeyDownArr[btn] = true;
					_this.KeysToProcess.push([btn, 1]);
				}
			}
		}
		if((event.buttons & 8) == 8 || (event.buttons & 16) == 16) event.preventDefault(); //hardcoded: prevent mouse back/forward navigation buttons from actually changing browser page
	};
	_this.onDocumentMouseUp = function(event) {
		for(var i = 0; i < _this.MouseBtnIndices.length; i++) {
			if(event.buttons & _this.MouseBtnIndices[i][0] == _this.MouseBtnIndices[i][0]) {
				var btn = _this.MouseBtnIndices[i][2];
				if(!_this.KeyDownArr[btn]) {
					_this.KeyDownArr[btn] = false;
					_this.KeysToProcess.push([btn, 0]);
				}
			}
		}
		if((event.buttons & 8) == 8 || (event.buttons & 16) == 16) event.preventDefault(); //hardcoded: prevent mouse back/forward navigation buttons from actually changing browser page
	};
	document.addEventListener( 'keydown', _this.onDocumentKeyDown, false );
	document.addEventListener( 'keyup', _this.onDocumentKeyUp, false );
	document.addEventListener( 'mousemove', _this.onDocumentMouseMove, false );
	document.addEventListener( 'mousedown', _this.onDocumentMouseDown, false );
	document.addEventListener( 'mouseup', _this.onDocumentMouseUp, false );
	
	_this.HandleInputs = function(t, dt, args) {
		var keydat;
		for(var i = 0; i < _this.KeysToProcess.length; i++) {
			keydat = _this.KeysToProcess.pop();
			if(keydat[1] == 1) {
				for(var j = 0; j < _this.keyDownHandlers.length; j++) {
					_this.keyDownHandlers[j](keydat[0], t, dt, args);
				}
			} else {
				for(var j = 0; j < _this.keyUpHandlers.length; j++) {
					_this.keyUpHandlers[j](keydat[0], t, dt, args);
				}
			}
		}
		for(var i = 0; i < _this.MouseMoveToProcess.length; i++) {
			keydat = _this.MouseMoveToProcess.pop();
			for(var j = 0; j < _this.mouseMoveHandlers.length; j++) {
				_this.mouseMoveHandlers[j](keydat, t, dt, args);
			}
		}
		for(var k in _this.KeyDownArr) { 
			if(_this.KeyDownArr[k]) {
				for(var j = 0; j < _this.keyTickHandlers.length; j++) {
					_this.keyTickHandlers[j](k, t, dt, args);
				}
				_this.KeyHoldDuration[k] += dt;
			}
		}
	};
};