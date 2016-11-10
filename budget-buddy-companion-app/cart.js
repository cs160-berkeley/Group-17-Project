import {     Button,    ButtonBehavior } from 'buttons';

import {
    VerticalScroller,
    VerticalScrollbar,
    TopScrollerShadow,
    BottomScrollerShadow
} from 'scroller';

//********************* Skins and Styles ********************//let budgetbuddySkin = new Skin({ fill : "#F3F5C4" });let shoppingbuttonSkin = new Skin({ fill : "#2D9CDB" });let startshoppingbuttonSkin = new Skin({ fill : "#93EDD4" });let shoppingbarSkin = new Skin({ fill : "#56CCF2" });let checkoutSkin = new Skin({ fill : "Blue" });let shoppinglistSkin = new Skin({ fill : "#F9CB8F" });

// Budget color indicators
let greenSkin = new Skin ({fill: '#92FF24'});
let redSkin = new Skin ({fill: '#FF4824'});
let yellowSkin = new Skin ({fill: "yellow"});
let orangeSkin = new Skin ({fill: 'orange'});
let textStyle = new Style({ font: "bold 20px", color: "black" });let grayTextStyle = new Style({ font: "bold 20px", color: "gray" });let blackTextStyle = new Style({ font: "bold 20px", color: "black" });let whiteTextStyle = new Style({ font: "bold 20px", color: "white" });

let darkGraySkin = new Skin({ fill: "#202020" });
let titleStyle = new Style({ font: "20px", color: "white" });

//********************* Data ********************//
let store = [{item: "Chex Mix Bold", cost: 2}, {item: "Root Beer", cost: .79}, {item: "12 Eggs XLRG AA", cost: 3.49}, {item: "1 gal 2% Milk", cost: 4.29}, {item: "Oroweat Whole Wheat", cost: 2.99}];
let cartContents = [];
let budget = {total: 0, budget: 0, remaining: 0, id: 0};

//-- Helps display a nice dollar amount --//
let roundDollars = function(num) {
	return Math.floor(num*100)/100.0;
}

//********************* Templates ********************//

//-- Template for My List button on the top left
let myListButtonTemplate = Button.template($ => ({  height: 25, left: 0, top: 0, skin: shoppingbarSkin,    contents: [        Label($, {height: 25, left: 5, top: 0, string: $.text, style: whiteTextStyle})    ],    Behavior: class extends ButtonBehavior {        onTouchEnded(button){            application.remove(currentScreen);            currentScreen = startScreen;	//******** Change this to the "My List" Screen ***********//            application.add(currentScreen);        }    }}));
//delete item "X" buttonlet DeleteItemButtonTemplate = Button.template($ => ({	height: 20, left: 5, name: $.id, skin: shoppinglistSkin,     contents: [
	    Label($, {height: 20, string: "X", style: grayTextStyle})	    ],    Behavior: class extends ButtonBehavior {	    onTouchEnded(button){
	    	removeFromCart(button.name);
	    	updateBudget();        }    }}));

//-- Template for Edit Budget and Checkout buttons
let cartButtonTemplate = Button.template($ => ({	height: 20, left: 5, right: 5, top: 2.5, bottom: 2.5, skin: $.skin,    contents: [
	    Label($, {height: 20, string: $.text, style: blackTextStyle})	    ],    Behavior: class extends ButtonBehavior {	    onTouchEnded(button){
	    	$.buttonFunction();        }    }}));
    
    
//-- Template for items in the shopping cart
var shoppinglistitemContainerTemplate = Container.template($ => ({    top: 2, height: 20, left: 5, right: 5, //skin: shoppinglistSkin,    contents: [        new DeleteItemButtonTemplate({id: $.id}),        Label($, {left: 30, height: 20, string: $.item, style: textStyle}),        Label($, {right: 0, height: 20, string: $.cost, style: textStyle}),    ]}));


//-- Template for each row of the budget information
let budgetTextTemplate = Container.template($ => ({
	height: 15, left: 0, right: 0, top: 1,
	contents: [
		Label($, {left: 5, height: 20, string: $.category, style: blackTextStyle}),
		$.num, //Label($, {right: 5, height: 30, string: $.value, style: blackTextStyle}),
	]
}));

//********************* Shopping cart related things ********************//

/*
let scroller = VerticalScroller({
	active: true, top: 0, bottom: 0, right: 0, left: 0,
	contents: [
		listScreen,
		VerticalScrollbar(),
		TopScrollerShadow(),
		BottomScrollerShadow(),
		]
});
*/

//-- Display of all the items in the cart
let listScreen = new Column({
	top: 0, left: 0, right: 0, //skin: shoppinglistSkin,
	contents: []
});

//-- Function to add item to cart
let addItemToCart = function() {
	let purchasedItem = store[Math.floor(Math.random() * store.length)];
	budget.total += purchasedItem.cost;
	let costItemIndex = {cost: purchasedItem.cost, item: purchasedItem.item, id: budget.id};
	budget.id = budget.id + 1;
	purchasedItem = new shoppinglistitemContainerTemplate(costItemIndex);
	cartContents.push(purchasedItem);
	listScreen.add(purchasedItem);		// Change this if implementing scroller
	updateBudget();		// Update the budget window after adding an item
}

//-- Manual Cart Add Button
let manualCartAddButton = new cartButtonTemplate({skin: checkoutSkin, text: "+ Manually Add Item", buttonFunction: addItemToCart});

//-- Removes an item from the cart
let removeFromCart = function(id) {
	let itemToDelete, index;
	// Find item to delete based on name
	for(var i = 0; i < cartContents.length; i++) {
		if (cartContents[i].first.name == id) {
			itemToDelete = cartContents[i];
			index = i;
		}
	}
	listScreen.remove(itemToDelete);	// Possibly change this if implementing scroller
	cartContents.splice(index, 1);
}

//-- The window comprised of the add button and the list screen
let cartWindow = new Column({
	top: 2, left: 5, right: 5, //skin: shoppinglistSkin,
	contents: [
		listScreen,
		manualCartAddButton,
	]
});

//********************* Navigation Bar related things ********************//

//-- Nav Bar creation.
let navBar = new Container({    top: 0, height: 25, left: 0, right: 0, skin: shoppingbarSkin,    contents: [
    	new myListButtonTemplate({"text": "My List"}),
    	new Label({height: 30, string: "Shopping Cart", style: blackTextStyle}),
    ]});

//********************* Budget Area related things ********************//

//-- Labels for the values on the right of the budget, directly change to manipulate values
let valueLabel = new Label({right: 5, height: 20, string: budget.total, style: blackTextStyle});
let budgetLabel = new Label({right: 5, height: 20, string: budget.budget, style: blackTextStyle});
let differenceLabel = new Label({right: 5, height: 20, string: budget.budget-budget.total, style: blackTextStyle});

//-- Function that runs when the editBudget is pressed. Can also result in keyboard input in which case change budget dictionary values.
let editBudget = function() {
	budget.budget = Math.floor(Math.random() * 10000) / 100.0	// Generate random new budget between $0-100
	updateBudget();
};

//-- Function that determines the background color of the budget section based on % spent.
let budgetStatus = function() {
	let percent = budget.total / budget.budget;
	if (percent < .75) {
		return greenSkin;
	} else if (percent < .90) {
		return yellowSkin;
	} else if (percent < 1) {
		return orangeSkin;
	} else {
		return redSkin;
	}
}

//-- Updates the budget numbers based on current budget dictionary values
let updateBudget = function() {
	budgetWindow.skin = budgetStatus();
	valueLabel.string = "$"+roundDollars(budget.total).toString();
	budgetLabel.string = "$"+roundDollars(budget.budget).toString();
	differenceLabel.string = "$"+roundDollars(budget.budget - budget.total).toString();
}

//-- Creates initial budget area
let drawBudget = function() {
	let budgetSkin = budgetStatus();
	budgetWindow = new Column({
		top: 145, bottom: 25, left: 5, right: 5, skin: budgetSkin,
		contents: 
		[
			new cartButtonTemplate({ "skin": checkoutSkin, "text": "Edit Budget", "buttonFunction": editBudget }),
			new budgetTextTemplate({"category": "Total:", "value": budget.total, "num": valueLabel,}),
			new budgetTextTemplate({"category": "Budget:", "value": budget.budget, "num": budgetLabel,}),
			new budgetTextTemplate({"category": "Amount Left:", "value": budget.budget - budget.total, "num": differenceLabel,}),
		],
	});
	updateBudget();
};

//********************* Initialize screen related things ********************//

//-- Creating the edit budget and checkout buttons
let budgetEditButton = new cartButtonTemplate({ "skin": checkoutSkin, "text": "Edit Budget", "buttonFunction": editBudget });
let checkoutButton = new cartButtonTemplate({ "skin": checkoutSkin, "text": "Checkout", "buttonFunction": null });	// show final payment screen function

//-- Creating and initializing the budget area
var budgetWindow;
drawBudget();

//-- Putting windows and buttons into a container to position them
let navBarPosition = new Container({
	top: 0, left: 0, right: 0, bottom: 0,
	contents: navBar
});
let cartWindowPosition = new Container({
	top: 30, left: 5, right: 5, bottom: 100, skin: shoppinglistSkin,
	contents: cartWindow
});
let checkoutButtonPosition = new Container({
	top: 215, left: 0, right: 0, bottom: 1,
	contents: checkoutButton
});
let budgetWindowPosition = new Container({
	top: 90, left: 0, right: 0, bottom: 25,
	content: budgetWindow,
});

//This is the screen template. Creates a column object with the navBar, budget window, checkout button, and cart list.export var cartScreenTemplate = Container.template($ => ({    top: 0, bottom: 0, left: 0, right: 0, skin: budgetbuddySkin,    contents: [
    	navBarPosition,
    	cartWindowPosition,
    	budgetWindow, 
    	checkoutButtonPosition,    ]}));

var cartScreen = new cartScreenTemplate();
application.add(cartScreen);