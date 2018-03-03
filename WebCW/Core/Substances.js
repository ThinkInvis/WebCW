//just a "structure", with all functions handled in CreeperGame instead of here -- can this be replaced with something else?
WebCW.CreeperGame.Substance = function(args) {
	var _this = this;
	_this.DefaultArgs = {
		Color: [1, 0, 0],
		IsSolid: true, //controls behavior
		IsVisible: true, //direct rendering toggle, does not affect line-of-sight calc (use BlocksLoS)
		GlobalPressure: [0,0,0,0,0,0],
		SpreadLimit: 0,
		EvapLimit: 0.01,
		ConstEvap: 1,
		SpreadRate: 1,
		Class: "Terrain",
		IsClamped: true, //prevents negative pressure
		BlocksLoS: false //blocks turret targeting, etc.
	};
	_this.DftGenArgs = {
		DisplayName: function() {
			return _this.IDName
		}
	};
	_this.RequiredArgs = ["IDName"];
	initArgs(_this, args);
};