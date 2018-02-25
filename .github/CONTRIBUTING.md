# Contribution Guidelines

WebCW is a fan project started, and intended for development mostly by, the user named ThinkInvisible; it is hosted on GitHub mostly to make the code available for viewing and learning, and to host the game itself. Contributions will be gladly accepted, but examined and accepted/discarded on the judgement of that single user.
Discussion about WebCW should take place on the [KnuckleCracker Discord](https://discordapp.com/invite/knucklecracker). Note that this is not an "official" use of said discord server, and that WebCW is not an officially-endorsed Creeper World game; restrict discussion of WebCW to the "#fan-contributed-content" channel.

## Submitting changes

Pull request submissions will be examined and accepted on a case-by-case basis. There are (as of yet) no fixed coding conventions for this project, although suggestions are listed below, and neither atomic commits (one change per commit) nor commit descriptions are required (as contributions will be judged based on their code content).

## Coding conventions

Above all else, keep code human-readable and easy to understand. There are no absolute conventions set up (yet), but the following are in heavy use:

	* Use the TAB character to indent, not spaces
	* Use one-line flow formatting -- when writing if, else, for, etc. structures, put brackets on the same line as the structure declaration, and begin code directly after said line. Do not insert a line break e.g. after an if structure but before the opening bracket.
	
The following restrictions on file/folder structure *are* enforced:
	
	* Keep all non-implementation-specific code out of the root folder; content in the root folder should exclusively be for setting up an *instance* of the WebCW game.
	* Use subfolders ([root]/WebCW/[category]/file.js) for specific types of features. For example, if creating units for a new "faction", use e.g. "[root]/WebCW/Units/mynewfaction.js". The "modules" subfolder is for miscellaneous features, e.g. ThreeJS control schemes; this specific subfolder is temporary, pending a better structure.
	* Use the "lib" folder for ANY AND ALL external code libraries.