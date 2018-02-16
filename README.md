A project based on KnuckleCracker's Creeper World series. Designed for less realistic graphics and more realistic gameplay.
Runs on ThreeJS.

Known major issues/todo (2/15/2018):
- Browser stalling due e.g. tabbing out adds a ton of time to the fixed timestep accumulator, should pause game instead if possible
- Various other placeholders, in-place tests, etc. that need to be cleaned up, ESPECIALLY substance interaction and properties
- Debug interaction controls (e.g. place terrain) wrap around to weird coordinates instead of clamping if used on the edges of the map
- Health/power system for structures
- Rendering for transparent but non-fluid substances
- Textured cells? Definitely CEL-SHADING shaders (edge detect, posterized lighting/color)