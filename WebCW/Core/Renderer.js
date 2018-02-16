if(isUndef(WebCW.CreeperGame.Modules.Gfx)) WebCW.CreeperGame.Modules.Gfx = {};

WebCW.CreeperGame.Modules.Gfx.WebGLRenderer = function(args) {
	var _this = this;
	_this.DefaultArgs = {
		Container: document.body,
		GlobalMaterials: {},
		GlobalGeoms: {},
		GlobalObjects: {},
		DrawCalls: [],
		UpdateCalls: []
	};
	_this.DftGenArgs = {
		Loop: function(obj, args) {
			return new FixedTimestepLoop({Callback: _this.Update, FrameCallback: _this.Draw});
		},
		Scene: function(obj, args) {
			var scn = new THREE.Scene();
			scn.background = new THREE.Color(0x000000);
			var light = new THREE.AmbientLight( 0xaaaaaa );
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
			
			_this.Container.appendChild(trnd.domElement);
			window.addEventListener( 'resize', function() {
				_this.ViewportWidth = _this.Container.offsetWidth;
				_this.ViewportHeight = _this.Container.offsetHeight;
				_this.Context.setSize(_this.ViewportWidth, _this.ViewportHeight);
			});
			return trnd;
		}
	};
	
	_this.Draw = function(t, dt, lpargs) {
		if(isDef(_this.Loop.Accum)) {
			var TicksOverdue = Math.floor(_this.Loop.Accum/_this.Loop.RealStep);	
			
			document.getElementById("DebugText").innerHTML = ["WebCW Pre-Alpha (name also WIP)",
			"By ThinkInvisible/Inspired by KnuckleCracker's <em>Creeper World</em>",
			"<a href=\"https://github.com/ThinkInvis/WebCW\">Check out my source on GitHub!</a>",
			"D: Delete Terrain, T: Add Terrain, E: Explosion, C: Creeper, N: Nuke, V: CreepNuke",
				"DEBUG: " + _this.Loop.SimTime.toFixed(3) + "s (" + _this.Loop.Accum.toFixed(3) + "/"+_this.Loop.RealStep.toFixed(3)+"s in accum)" + ((TicksOverdue > 4) ? ("<span class=\"errText\">WARNING! " + TicksOverdue + " TICKS BEHIND</span>") : (""))
			].join("<br />");
		}
		for(var i = 0; i < _this.DrawCalls.length; i++) {
			_this.DrawCalls[i](_this, t, dt, lpargs);
		}
		if(isDef(_this.CurrentCamera)) _this.Context.render(_this.Scene, _this.CurrentCamera);
	};
	_this.Update = function(t, dt, lpargs) {
		for(var i = 0; i < _this.UpdateCalls.length; i++) {
			_this.UpdateCalls[i](_this, t, dt, lpargs);
		}
	};
	initArgs(_this, args);
};