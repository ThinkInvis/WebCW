WEBCW : DESIGN/BRAINSTORMING DOCUMENT

MISC NOTES:
	Proximity Alarm?
	Send orders from orbit as packets too; fast propagation, but still propagation
		Sep. net type?
	Add a "radar screen" when entering level to determine initial CN drop zone, add limited view gamemode where player must view world through several cameras (placeable and on CNs)
	
RESOURCES:
	IRON [Fe]
		Used to build most structures.
		Mined from the earth anywhere.
		Miners consume terrain space.
	ELECTRICITY [e+]
		Used to power most structures, and also energy weapons?
		Collected by solar panels? Hydroponics?
		Consumes terrain space if the latter; not if the former
	WATER [H2O]
		Can be hydrolyzed into hydrogen and oxygen, as well as relocated to assist in terrain-based tactics.
		Erodes terrain?
		Collected from the atmosphere by a structure (Condensator) or siphoned from on-map sources.
	HYDROGEN [H]
		Used to power energy weapons (plasma ammo).
		Can be hydrolyzed from water? Collected from the ground/atmosphere?
	Lead [Pb]
		Used to power ballistic weapons (mass drivers).
		Or Osmium/Tungsten?
		Mined; may require special survey setup (only on certain parts of the map)
	Tungsten [W]
		Used to construct heat-resistant structures. Heat-ray weapon? Lava substance? May also be more resistant to creeper due density?
		Mined; may require special survey setup (only on certain parts of the map)
	? [?]
		Used to power ballistic weapons (explosive ammo).
		Mined; may require special survey setup (only on certain parts of the map)
	SILICON [Si]
		Used to create Nanotech and advanced computing structures.
		Mined from Si deposits.
		Nanotech includes Anticreep, repair drones.
		
TERRAIN/FLUID TYPES:
	CREEPER [Crp]
		Type: Fluid
		A viscous solution of nanobots that spreads out to consume everything it can.
		Deals damage to structures and some terrain types.
		Has an electronic signature that is auto-targeted by the player's weapons.
		Emitted by many "natural" enemy structures.
		Interactions:
			Annihilates with Anticreeper.
			Converts Water to Creeper.
			Damages player structures.
	ANTICREEPER [Acrp]
		Type: Fluid
		A viscous solution of nanobots that spreads to coat, but otherwise leave alone, everything it can. Annihilates with Creeper.
		Can be upgraded to spread faster, lubricate your weapons/vehicles, and more.
		Generated by some player structures; built from silicon.
		Interactions:
			Annihilates with Creeper.
			Receives/propagates its own upgrade transmissions. Isolated pools will not be upgraded.
			Can assist player structures when upgraded.
	WORLD BARRIER [Barr]
		Type: Static
		Represents the "boundary condition" of the map. Prevents all modification; holds fluids in.
		May provide pass-through from other Sectors.
	DIRT [Dirt]
		Type: Solid
		Not very cohesive; thin layers/ledges won't support structures.
		Required to set the Hydroponics structure.
		Mining Yield: Oxygen, Silicon, Aluminum, Iron, Magnesium, Calcium, Sodium, Potassium (highest to lowest), Water (with a Fluid Well)
	STONE [Stn]
		Type: Solid
		Sturdy, but not invulnerable. Watch your weight. Can be mined from.
		Mining Yield: SiO_2, Calcium, Carbon
	BEDROCK [Rck]
		Type: Static
		Sturdy. Good for building on top of, or mining out of.
	SAND [Snd]
		Type: Powder
		Watch your step.
		Interactions:
			Water: Absorbs Water, converts to Quicksand.
	QUICKSAND [Qsnd]
		Type: Fluid
		An extremely viscous and extremely vicious liquid. Doesn't flow fast, but traps vehicles and sinks anything denser than water.
	WATER [H2O]
		Type: Fluid
		Useful for hydrolysis and building moats. Also required to run Hydroponics structures efficiently.
		Can be extracted from the atmosphere, drained from the aquifer, or siphoned from on-map sources.
		Interactions:
			Sand: Absorbed into Sand, converts it to Quicksand.
	CLAY
		YIELD:
			Basic Excavator: 
				
			
CHEMICALS:
	Silica SiO_2
		SOURCES: Dirt, Stone
		Mined from stone.
		Can be broken down.
		Used to make cement (paving), glass, quartz, fibers.
			Defoamer? Useful for ANYTHING?
	Isoprene C5H8
		SOURCES: Dirt, Synthesis
		Used to insulate wires.
	Silicon Si
		Used to make advanced electronics.
	Copper Cu
		Used to make basic electronics.
		Mined directly (purified by the ACCRU-E's chemical processor array).
	Iron Fe
		Used to make basic structures and steel.
		Mined directly.
	Aluminum Al
		Used to make basic structures and scaffolds.
		Mined directly.
	Carbon C
		SOURCES: Dirt, Stone
		Used to make advanced support/piercing-resistant structures (CF mesh), can be burned as fuel.
		Also used in thermal weapons?
	Lead Pb
		Used to make ammunition for mass-driver weapons.
	Tungsten W
		Used to make dense, creeper-resistant structures.
	Silver Ag
		Used in advanced electronics, and to make LEDs and temperature-resistant batteries (silver oxide/silver zinc).
		Can be mined with survey.
	Gold Au
		Used in advanced electronics (small-signal, low corrosion).
		Can be mined with survey.
	Electrum AgAu
		Used in resilient electronics.
		Alloyed; can be mined with survey.
	Magnesium Mg
		Used in "bright" explosives, e.g. tracer rounds and flares.
		
CHEM RESOURCES:
	Silica Fibers
		Very heat-resistant.
		Used in making fiber-optic cables.
	Carbon Fibers
		Extremely tough fabric. Can be used to suspend/support some structures.
	Carbon Steel
		Used to build basic structures, one tier up from Aluminum.
	Stainless Steel
		Very good at resisting Creeper.
		Used to build C-dams.
	
CHEMICAL PROCESSES BY STRUCTURE:
	ACCRU-E
		Ore Refinement
			Receives mined ore and purifies it into chemicals.
	HYDROPONICS
		Basic structure. Must be placed on Dirt, and have access to atmosphere.
		If not in sunlight:
			Electricity + Atmosphere > Oxygen (~70%) + Carbon (~23%) + Nitrogen (~2%) + Na2CO3/Sodium carbonate/Soda Ash (~5%)
		If in sunlight, Electricity is not required
		Structure provides water+nutrients (hence dirt req)
	BASIC EXCAVATOR
		On Dirt:
			Electricity > Carbon (~10%), Sulfur (~5%), NH4CL Ammonium Chloride (~5%), KNO3 Niter/Saltpeter (~5%), N2H4O3 Ammonium Nitrate (~5%),
			Sodium bicarbonate/Baking Soda/NaHCO3 (~5%)
		On Stone:
	FLUID WELL
		On Dirt:
			Electricity > H2O (~50%), 
		On Stone:
	GAS WELL
		On Dirt:
			Electricity > CH4 (~25%), CO2 (~25%)
	ELECTRIC ARC FURNACE
		Basic structure.
		SiO_2 + 2 C --> Si + 2 CO
		Refines Fe ore, and refines Fe into steel, much faster than the ACCRU-E
		Can be used to reclaim scrap metal
	PLASMA COLLIDER
		Endgame structure.
		Fueled by H (plasma) and Electricity; can break down almost any molecule into its constituent atoms.
	
MECHANICS:
	VIEW
		Mode 1: Free View
			The player has a "freecam" that can phase through terrain and view everything.
		Mode 2: Realistic
			The player must place camera-capable units to view the battlefield.
			The player may only see a basic radar scan from orbit, only sufficient to place an ACCRU-E in a safe spot (only high concentrations of creeper are indicated, vaguely).
	METRICS
		DISTANCE
			In-world grid squares are 0.5 meters to a side
	REALISTIC CHEMICAL PROCESSES
		Inspired by the game SpaceChem.
		Chemicals are directly mined from the terrain, and must be converted by player structures.
		Much more abstracted than SpaceChem, especially w.r.t. player effort.
		RESEARCH:
			Explosions
				https://en.wikipedia.org/wiki/TNT_equivalent
				1 kg TNT equiv --> 1.163 kWh or 4.184 MJ
				1 kg TNT destroys a small vehicle
				0.5 tons TNT destroys ~ 10m x 10m x 10m? Roughly twice the horizontal size of a fighter jet (image result) -- tomahawk missile test
				Cannons should clear around a 0.5m radius
				Estimating 5 MJ req'd for each shot
				
	WEAPON TRADEOFF
		Electric Weapons only require electricity to operate (no hydrogen -- just ionize the air), but a LOT of it.
		Conventional Weapons require several different elements as ammo, but are more effective and only take a little electricity.
	SUBSTANCES
		TYPES
			Fluid: Flows, pressurizes.
			Static: Completely stationary, even if unsupported.
			Solid: Follows material dynamics rules (falls if unsupported, can break?).
			Powder: Falls naturally but is not a fluid, e.g. sand. Cannot be pressurized. Doesn't support structures very well...
		CREEPER
			Cellular Automaton spread, as with the original games.
			Different types? Allow variation per-cell, blend properties like mixing liquids into a solution?
			PROPAGATION PSEUDOCODE:
				For each cell
					Collect the values of the Von Neumann neighbors
					If the value in an adjacent cell is less than the value in this cell, add the difference to a sum
					Use this sum to weight the value of each neighbor
					"Non-viscous" flow amount is equal to the value in this cell minus the difference sum above -- the total amount of "pull" from other nearby cells.
					"Viscous" flow amount is equal to the largest such amount for one single neighbor.
					Blend between non-viscous and viscous flow based on parameters.
					Add any environmental forces to the weighting above.
					Take said flow from this cell and distribute it to the others using the final weighting.
		ANTICREEPER
			Made of nanobots. Annihilates with Creeper and does not damage structures; acts like Creeper otherwise, besides spreading slightly slower with no upgrades.
			Can receive Upgrades to its firmware:
				Perception: Anticreeper can be set to spread towards nearby Creeper; range increases with level.
				Aggressiveness: Anticreeper spreads faster per level.
				Intelligence: One unit of Anticreeper annihilates more units of Creeper per level.
		TERRAIN
			Terrain possesses different types with different properties. Some terrains may be easier to dig, some may be weak to the creeper, some may be incapable of supporting heavy structures, etc.
	CONSTRUCTION
		The player may construct units in orbit and send them down.
		The player requires a slight amount of [Fe] to build a Scaffold. This requires either orbital line-of-sight or connection to the player's network.
		The player may only construct units if A. they have the proper resources for a 
	VEHICLES
		Vehicle Units are introduced. These are required to e.g. construct building, move resources if no pipelines are set up...
	UPGRADES
		Upgrades are for singular units, but are cheaper.
	WORLD PROGRESSION
		Galaxy > System > World > Sector.
		Galaxies separate different types of gameplay.
		Systems have a larger progression system, possibly involving the warp inhibitors and shield keys of CW3.
		Worlds contain a multitude of Sectors placed on a 2D grid. Further Sectors beyond the initial few may be too overrun by Creeper for the ship's superweapon, or otherwise contain countermeasures; taking the initial sectors opens up adjacent ones (similar to Gemcraft Labyrinth?), whether directly to orbit or through linkages to the previous sectors (which might allow the player to carry over resources from the previous sector!).
		The end goal of a World may vary: claim one or multiple Sectors that act as a turning point for the entire World ("excision mission", e.g. Warp Inhibitors or a very large emitter), claim every Sector on the World ("annihilation mission", e.g. original CW3 portrayal of most worlds), or retrieve an artifact or resource ("retrieval mission", e.g. shield keys). The player may receive credit (as a medal or similar) for another type than the World's intended type, specifically "annihilation" (or "retrieval" for all artifacts on-World).
		
UNITS:
	CORE/ORBITAL
		BASIC
			Player Ship
				TODO: Give it a name!
				Properties:
					Transmits the player's orders to their network.
					Receives resources; can only distribute resources to ACCRU-Es.
					Stores a small amount of resources.
					Possesses a superweapon capable of temporarily clearing a sector of Creeper fluid; INCREDIBLY HIGH charge time, incapable of destroying Emitters and other Creeper units, must also consume internal resources via nuclear processes. This provides lore reason as to why missions start out with no Creeper concentration or resources beyond an ACCRU-E, most of the time.
					Can construct and store up to 9x9x3 space of units at a time.
					Possesses a tractor beam capable of moving visible units.
				Physical:
					Weight: Immense
					Size: Immense
					Health: Immense
				Construction:
					Always owned. Forced to retreat if the sector is lost.
				Upgrades:
					Terrain-mover tractor beam:
						Requires orbital line-of-sight to creeper-free and structure-free areas. Capable of moving the terrain in these areas.
				Generation:
					Electricity 1000 GJ (Integrated Antimatter Reactor)
			ACCRU-E Automatic Creeper-Combat and Reclamation Unit, Model E
				Properties:
					Receives orders from orbit.
					Receives and distributes resources.
					Stores a small amount of resources.
					Provides a player viewpoint.
					Anchored heavily into the ground.
					Hardened against falls and impacts; possesses maneuvering thrusters.
				Physical:
					Weight: Extreme (~40t)
					Size: Extreme (~9x9x3)
					Health: Extreme
				Construction:
					Player receives one from orbit initially, for free.
					Constructing any more *requires* additional resources to be sent to orbit; cannot build in-place.
		ADVANCED
	INFRASTRUCTURE
		BASIC
		ADVANCED
		SUPERWEAPON
	WEAPON
		BASIC
			Cannon
				Properties:
					High rate-of-fire, basic damage -- good all-around frontline weapon.
					Limited by line-of-sight.
					Auto-aims and fires at highest nearby concentration of creeper. (Or "even spread"/"closest" mode?)
			Mortar
				Properties:
					Fires large ballistic explosive rounds.
					Limited by terrain, but does not require line-of-sight. (Require radar upgrade?)
		ADVANCED
		SUPERWEAPON
	ENEMY
		BASIC
		ADVANCED
		SUPERWEAPON