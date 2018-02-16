A project based on KnuckleCracker's Creeper World series. Designed for less realistic graphics and more realistic gameplay.
Runs on ThreeJS.

Known major issues/todo (2/15/2018):
- Interaction/propagation logic is faulty (current explosion behavior can be either "explosion gas" gets suppressed if in creeper, or gets converted to absurd amounts of creeper under the wrong circumstances) and a placeholder besides
- Browser stalling due e.g. tabbing out adds a ton of time to the fixed timestep accumulator, should pause game instead if possible
- Various other placeholders, in-place tests, etc. that need to be cleaned up, ESPECIALLY substance interaction and properties
- Debug interaction controls (e.g. place terrain) wrap around to weird coordinates instead of clamping if used on the edges of the map
- Health/power system for structures