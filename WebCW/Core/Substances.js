//just a "structure", with all functions handled in CreeperGame instead of here -- can this be replaced with something else?
WebCW.CreeperGame.Substance = function(args) {
	var _this = this;
	_this.DefaultArgs = {
		Color: [1, 0, 0],
		IsSolid: true,
		IsVisible: true,
		GlobalPressure: [0,0,0,0,0,0],
		SpreadLimit: 0,
		EvapLimit: 0.01,
		ConstEvap: 1,
		SpreadRate: 1,
		Class: "Terrain",
		IsClamped: true, //prevents negative pressure
		BlocksTurrets: false
	};
	_this.DftGenArgs = {
		DisplayName: function() {
			return _this.IDName
		}
	};
	_this.RequiredArgs = ["IDName"];
	initArgs(_this, args);
};