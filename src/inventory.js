var bg_color = "#ccc";
var border_color = "#444";
var slot_color = "#aaa";
var padding = 80;
var height = 80;
var border = 2;
var inner_padding = 10;

var InventoryView = Spineless.View.extend({
	template: "inventory",

	init: function () {
		InventoryView.super(this, "init", arguments);

		//if child clicks deselect all
		this.on("dom:*", function (e, obj) {
			this.deselectQuick();
			Inventory._selected = obj.model.index;
		});
	},

	selectQuick: function (index) {			
		this.deselectQuick();
		this.children[index].select();
	},

	deselectQuick: function () {
		for (var i = 0; i < this.children.length; ++i) {
			this.children[i].deselect();
		}
	}
});

var ItemView = Spineless.View.extend({
	defaults: {
		index: 0
	},

	template: [
		{id: "placeholder", className: "placeholder", children: [
			{id: "icon", className: "icon"}
		]}
	],

	events: {
		"click placeholder": "select"
	},

	select: function (e) {
		this.placeholder.classList.add("active");
		e && e.stopPropagation();
		return false;
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
			this._placeholder[x] = new ItemView({
				index: x
			});

			inventory.addChild(this._placeholder[x]);
		}

		this.selectQuick(this._selected);
	},

	/**
	* Add an item to the inventory
	* 1. See if the item exists in the quick bar and less than max and stackable
	* 		a. increase quantity
	* 2. See if empty slot in quick bar
	*		a. add 1 item to slot
	* 3. Find first stack in backpack to hold quantity
	*		a. increase quantity
	* 4. Find empty slot
	* 		a. add 1 item to slot
	* 5. Inventory full
	*/
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
