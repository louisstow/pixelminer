var bg_color = "#ccc";
var border_color = "#444";
var slot_color = "#aaa";
var padding = 80;
var height = 80;
var border = 2;
var inner_padding = 10;

var InventoryView = Spineless.View.extend({
	template: "inventory",

	selectQuick: function (index) {
		for (var i = 0; i < this.children.length; ++i) {
			this.children[i].deselect();
		}

		this.children[index].select();
	}
});

var ItemView = Spineless.View.extend({
	template: [
		{id: "placeholder", className: "placeholder", children: [
			{id: "icon", className: "icon"}
		]}
	],

	select: function (index) {
		this.placeholder.classList.add("active")
	},

	deselect: function () {
		this.placeholder.classList.remove("active")	
	}
});

var inventory = new InventoryView();

Inventory = {
	_items: [],
	_quick: [],
	_slots: 10,
	_placeholder: [],
	_selected: 0,

	onItemAdd: null,
	onDropItem: null,

	init: function () {
		for (var x = 0; x < this._slots; ++x) {
			this._placeholder[x] = new ItemView();
			inventory.addChild(this._placeholder[x]);
		}

		this.selectQuick(this._selected);
	},

	addItem: function (item, quantity) {
		
	},

	addItemAtIndex: function (item, index, quantity) {

	},

	dropItem: function (index) {

	},

	dropItemAtIndex: function (item, index) {

	},

	switchItems: function (from, to) {

	},

	selectQuick: function (index) {
		this._selected = index % this._slots;
		if (this._selected < 0) this._selected = this._slots + this._selected;
		inventory.selectQuick(this._selected);
	}
};

Inventory.init();
