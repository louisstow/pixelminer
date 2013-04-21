var Tile = {
	getName: function (id) {
		return tileById[id];		
	},

	getId: function (name) {
		return tileByName[name];
	},

	get: function (id) {
		if (typeof id === "number")
			id = tileById[id];

		return TileData[id];
	}
};

var tileByName = {};
var tileById = {};

var TileData = {
	WOOD: {
		solid: true,
		color: {r: 255, g: 88, b: 7},
		strength: 2
	},

	STONE: {
		solid: true,
		color: {r: 150, g: 140, b: 140},
		strength: 6
	},

	DIRT: {
		solid: true,
		dirt: {r: 0, g: 186, b: 0}
	},

	TRUNK: {
		solid: true,
		color: {r: 148, g: 104, b: 28},
		strength: 2
	},

	LEAVES: {
		solid: false,
		color: {r: 37, g: 122, b: 16},
		strength: 0.2
	},

	COAL: {
		solid: true,
		color: {r: 30, g: 20, b: 30},
		strength: 7
	},

	GOLD: {
		solid: true,
		color: {r: 180, g: 170, b: 80},
		strength: 9
	},

	ROSE: {
		color: {r: 224, g: 27, b: 106},
		strength: 0.2
	},

	STEM: {
		color: {r: 57, g: 152, b: 36},
		strength: 0.2
	},

	TULIP: {
		color: {r: 222, g: 242, b: 0},
		strength: 0.2
	}
};

var i = 0;
for (var type in TileData) {
	tileByName[type] = i;
	tileById[i] = type;
	i++;
}