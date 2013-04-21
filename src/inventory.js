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

		Input.on("scroll", function (delta) {
			var inc = delta < 0 ? 1 : -1;
			
			Inventory._selected += inc;

			Inventory.selectQuick(Inventory._selected);
		}.bind(this));
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
		index: 0,
		icon: "",
		quantity: 0
	},

	template: [
		{id: "placeholder", className: "placeholder", children: [
			{id: "icon", className: "icon"}
		]}
	],

	events: {
		"click placeholder": "select"
	},

	select: function () {
		this.placeholder.classList.add("active");
	},

	deselect: function () {
		this.placeholder.classList.remove("active")	
	},

	render: function () {
		this.icon.className = "icon " + this.model.icon;
		var text = "";
		if (this.model.quantity > 1)
			text = this.model.quantity;

		this.icon.textContent = text;
	}
});

var inventory = new InventoryView();

Inventory = {
	_backpack: [],
	_quick: [],
	_slots: 10,
	_backpackSlots: 20,
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
		var len = this._slots;
		var index = -1;
		var empty = -1;
		var i = 0;
		var tile = Tile.get(item);
		var stack = tile.stack || MAX_STACK;
		var slot;

		//loop through quick bar
		for (; i < len; ++i) {
			slot = this._quick[i];

			//no item in the quick bar
			if (!slot) {
				//save this position as empty slot
				if (empty === -1) {
					empty = i;
				}
				continue;
			}

			//check if the item matches
			if (slot.item === item && slot.quantity < stack) {
				index = i;
				break;
			}
		}

		if (index !== -1) {
			return this.addItemAtIndex(index, item, quantity);
		}

		if (empty !== -1) {
			return this.addItemAtIndex(empty, item, quantity);
		}
		
		//loop through backpack
		len = this._backpackSlots;
		for (i = 0; i < len; ++i) {
			slot = this._backpack[i];

			if (!slot) {
				if (empty === -1) {
					empty = i + this._slots;
				}
				continue;
			}

			if (slot.item === item && slot.quantity < stack) {
				index = i + this._slots;
				break;
			}
		}

		if (index !== -1) {
			return this.addItemAtIndex(index, item, quantity);
		}

		if (empty !== -1) {
			return this.addItemAtIndex(empty, item, quantity);
		}
	},

	addItemAtIndex: function (index, item, quantity) {
		var inv = this._quick;

		if (index >= this._slots) {
			index -= this._slots;
			inv = this._backpack;
		}
		
		//if it exists, increase the quantity
		if (inv[index]) {
			inv[index].quantity++;

			this._placeholder[index].set("quantity", inv[index].quantity)
		} else {
			//else, create item
			inv[index] = {
				item: item,
				quantity: 1
			};

			this._placeholder[index].set({
				icon: Tile.getName(item).toLowerCase(),
				quantity: 1
			});
		}
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
