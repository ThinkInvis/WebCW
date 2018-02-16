WebCW.CreeperGame.Substance = function(args) {
	var_this = this;
	_this.OptionalArgs = {
		Interactions: {},
		DisplayName: _this.IDName,
		Material: _this.undefSubstMtl
	};
	_this.RequiredArgs = ["IDName", "Class", "Density"];
	initArgs(_this, args);
	
	
	_this.checkInteractions = function(cell, deltaTime) {
		var RetProps = {};
		for(var jac in cell) {
			for(var iac in _this.Interactions) {
				if(jac.Class == iac) {
					_this.Interactions[iac](jac, cell[jac], deltaTime, RetProps);
				}
			}
		}
		return RetProps;
	};
};