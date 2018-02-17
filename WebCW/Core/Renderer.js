if(isUndef(WebCW.Modules.Gfx)) WebCW.Modules.Gfx = {};

WebCW.Modules.Gfx.WebGLRenderer = function(args) {
	var _this = this;
	_this.DefaultArgs = {
		Container: document.body,
		GlobalMaterials: {},
		GlobalGeoms: {},
		GlobalObjects: {},
		DrawCalls: [],
		UpdateCalls: [],
		ResizeCalls: [],
		addStats: false
	};
	
	_this.DftGenArgs = {
		Loop: function(obj, args) {
			return new FixedTimestepLoop({Callback: _this.Update, FrameCallback: _this.Draw});
		},
		Scene: function(obj, args) {
			var scn = new THREE.Scene();
			scn.background = new THREE.Color(0x000000);
			var light = new THREE.AmbientLight( 0xffffff );
			scn.add( light );
			light = new THREE.DirectionalLight( 0xffffff, 2.0 );
			light.position.set(0, 0.25, 0.75);
			scn.add( light );
			return scn;
		},
		Context: function(obj, args) {
			var trnd = new THREE.WebGLRenderer({antialias: false, transparency: THREE.OrderIndependentTransperancy});
			trnd.setPixelRatio(window.devicePixelRatio);
			console.log(_this.Container);
			_this.ViewportWidth = _this.Container.offsetWidth;
			_this.ViewportHeight = _this.Container.offsetHeight;
			trnd.setSize(_this.ViewportWidth, _this.ViewportHeight);
			_this.ViewportSize = new THREE.Vector2(_this.ViewportWidth, _this.ViewportHeight);
			
			_this.Container.appendChild(trnd.domElement);
			window.addEventListener( 'resize', function() {
				_this.ViewportWidth = _this.Container.offsetWidth;
				_this.ViewportHeight = _this.Container.offsetHeight;
				_this.ViewportSize.set(_this.ViewportWidth, _this.ViewportHeight);
				_this.Context.setSize(_this.ViewportWidth, _this.ViewportHeight);
				for(var i = 0; i < _this.ResizeCalls.length; i++) {
					_this.ResizeCalls[i](_this, _this.ViewportWidth, _this.ViewportHeight);
				}
			});
			return trnd;
		}
	};
	
	
	_this.Draw = function(t, dt, lpargs) {
		if(isDef(_this.Loop.Accum)) {
			var TicksOverdue = Math.floor(_this.Loop.Accum/_this.Loop.RealStep);	
			
			document.getElementById("DebugText").innerHTML = ["WebCW Pre-Alpha (name also WIP)",
			"By ThinkInvisible/Inspired by KnuckleCracker's <em>Creeper World</em>",
			"<a href=\"https://github.com/ThinkInvis/WebCW\">Check out my source on GitHub!</a>|CONTROLS: LMB: Look, RMB: Pan, MWheel/MMB: Zoom",
			"D: Delete Terrain, T: Use Pencil",
				"DEBUG: " + _this.Loop.SimTime.toFixed(3) + "s (" + _this.Loop.Accum.toFixed(3) + "/"+_this.Loop.RealStep.toFixed(3)+"s in accum)" + ((TicksOverdue > 4) ? ("<span class=\"errText\">WARNING! " + TicksOverdue + " TICKS BEHIND</span>") : (""))
			].join("<br />");
			if(_this.RndNoInst) {
				document.getElementById("DebugText").innerHTML += "<br /><span class=\"errText\">ERROR: Your browser, or your computer, does not support GPU-instanced geometry. You will not be able to view graphics on this page without this feature.</span>";
			}
			if(_this.RndNoDep) {
				document.getElementById("DebugText").innerHTML += "<br /><span class=\"errText\">ERROR: Your browser, or your computer, does not support WebGL depth textures. You will not be able to view graphics on this page without this feature.</span>";
			}
		}
		for(var i = 0; i < _this.DrawCalls.length; i++) {
			_this.DrawCalls[i](_this, t, dt, lpargs);
		}
		if(isDef(_this.CurrentCamera) && _this.DoRender) _this.Context.render(_this.Scene, _this.CurrentCamera);
		if(_this.addStats) _this.stats.update();
	};
	_this.Update = function(t, dt, lpargs) {
		for(var i = 0; i < _this.UpdateCalls.length; i++) {
			_this.UpdateCalls[i](_this, t, dt, lpargs);
		}
	};
	initArgs(_this, args);
	
	if(_this.addStats) {
		_this.stats = new Stats();
		_this.Container.appendChild(_this.stats.dom);
	}
	
	
	if (_this.Context.extensions.get( 'ANGLE_instanced_arrays' ) === false ) {
		_this.RndNoInst = true;
	}
	if ( !_this.Context.extensions.get( 'WEBGL_depth_texture' ) ) {
		_this.RndNoDep = true;
	}
	_this.DoRender = true;
};
