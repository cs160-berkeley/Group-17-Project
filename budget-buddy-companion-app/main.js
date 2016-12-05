//importsimport {     Button,    ButtonBehavior } from 'buttons';import {     RadioGroup,     RadioGroupBehavior} from 'buttons';import {    VerticalScroller,    VerticalScrollbar,    TopScrollerShadow,    BottomScrollerShadow} from 'scroller';import {    FieldScrollerBehavior,    FieldLabelBehavior} from 'field';import {    SystemKeyboard} from 'keyboard';import {     LabeledCheckbox } from 'buttons';import Pins from "pins";//********************* Data ********************//let store = [{item: "Chex Mix Bold", cost: 2}, {item: "Root Beer", cost: .79}, {item: "12 Eggs XLRG AA", cost: 3.49}, {item: "1 gal 2% Milk", cost: 4.29}, {item: "Oroweat Whole Wheat", cost: 2.99}];
let shoppingListContents = [];let cartContents = [];let idToCostMapping = {};let budget = {total: 0, budget: 0, remaining: 0, id: 0};//-- Helps display a nice dollar amount --//let roundDollars = function(num) {	return Math.floor(num*100)/100.0;}//skinslet graySkin = new Skin({ fill : "#C4C4C4" });let budgetbuddySkin = new Skin({ fill : "#DFDCE3" });let shoppingbuttonSkin = new Skin({ fill : "#4ABDAC" });let startshoppingbuttonSkin = new Skin({ fill : "#4ABDAC" });let shoppingbarSkin = new Skin({ fill : "#4F4F4F" });let bluskin = new Skin({ fill : "#4ABDAC" });let shoppinglistSkin = new Skin({ fill : "#4ABDAC" });let shoppingcartSkin = new Skin({ fill : "#DFDCE3" });let greenbudgetSkin = new Skin({ fill: "#7DDB60" });let redbudgetSkin = new Skin({ fill: "#FC4A1A" });let yellowbudgetSkin = new Skin({ fill: "#F7B733" });let checkoutSkin = new Skin({ fill : "#4ABDAC" });// Budget color indicatorslet greenSkin = new Skin ({fill: '#7DDB60'});let redSkin = new Skin ({fill: '#FC4A1A'});let yellowSkin = new Skin ({fill: "#F7B733"});let textStyle = new Style({ font: "bold 20px", color: "black" });let whiteTextStyle = new Style({ font: "bold 20px", color: "white" });let whiteTextStyleBig = new Style({ font: "bold 30px", color: "white" });let grayTextStyle = new Style({ font: "bold 20px", color: "#707070" });let bigStyle = new Style({ font: "bold 48px", color: "black" });let darkGraySkin = new Skin({ fill: "#707070" });let titleStyle = new Style({ font: "20px", color: "white" });let blackTextStyle = new Style({ font: "bold 20px", color: "black" });var listItems = [];var cartItems = ["Lucerne Eggs", "Horizon Milk", "Wonder Bread", "Odwalla Mango Smoothie", "Meow Mix"];var scanned = false;//Top navbar templatelet topbar = Container.template($ => ({    top: 0, height: 50, left: 0, right: 0, skin: shoppingbarSkin,    contents: [    	            Label($, {height: 30, string: "Budget Buddy", style: whiteTextStyleBig})    ]}));//shoppinglist top barlet listtopbar = Container.template($ => ({    top: 0, height: 50, left: 0, right: 0, skin: shoppingbarSkin,    contents: [    	            Label($, {height: 30, string: "Shopping List", style: whiteTextStyleBig})    ]}));//empty checkbox templatelet CheckBoxTemplate = LabeledCheckbox.template($ => ({    active: true, top: 0, bottom: 0, right: 5,    behavior: Behavior({    })}));//This is the blank screen templatevar ScreenTemplate = Column.template($ => ({    top: 0, bottom: 0, left: 0, right: 0, skin: budgetbuddySkin,    contents: [    ]}));//-- CHECKOUT BUTTON FUNCTIONvar goCheckout = function() {	application.remove(currentScreen);	currentScreen = startScreen;	application.add(currentScreen)};//*********************Cart Screen Templates ********************////-- Template for My List button on the top leftlet myListButtonTemplate = Button.template($ => ({  height: 35, left: 0, top: 0, skin: shoppingbarSkin,    contents: [        Label($, {height: 25, left: 5, top: 0, string: $.text, style: whiteTextStyle})    ],    Behavior: class extends ButtonBehavior {        onTouchEnded(button){                application.remove(currentScreen);                application.add(shoppinglistScreen);        }    }}));             //delete item "X" buttonlet DeleteItemButtonTemplate = Button.template($ => ({	height: 20, left: 5, name: $.id, skin: bluskin,     contents: [	    Label($, {height: 20, string: "X", style: grayTextStyle})	    ],    Behavior: class extends ButtonBehavior {	    onTouchEnded(button){	    	removeFromCart(button.name);	    	updateBudget();
	    	button.container.container.remove(button.container);        }    }}));//-- Template for Edit Budget and Checkout buttonslet cartButtonTemplate = Button.template($ => ({	height: 20, left: 5, right: 5, top: 2.5, bottom: 2.5, skin: $.skin,    contents: [	    Label($, {height: 20, string: $.text, style: whiteTextStyle})	    ],    Behavior: class extends ButtonBehavior {	    onTouchEnded(button){	    	$.buttonFunction();        }    }}));        //-- Template for items in the shopping cartvar shoppingcartitemContainerTemplate = Container.template($ => ({     height: 40, left: 5, right: 5, top: 5, skin: bluskin,    contents: [        new DeleteItemButtonTemplate({id: $.id}),        Label($, {left: 30, height: 20, string: $.item, style: textStyle}),        Label($, {right: 0, height: 20, string: $.cost, style: textStyle}),    ]}));//-- Template for each row of the budget informationlet budgetTextTemplate = Container.template($ => ({	height: 25, left: 0, right: 0, top: 1,	contents: [		Label($, {left: 5, height: 20, string: $.category, style: blackTextStyle}),		$.num, //Label($, {right: 5, height: 30, string: $.value, style: blackTextStyle}),	]}));//********************* Shopping cart related things ********************////-- Function to add item to cartlet addItemToCart = function() {	let purchasedItem = store[Math.floor(Math.random() * store.length)];	budget.total += purchasedItem.cost;	idToCostMapping[budget.id] = purchasedItem.cost;	let costItemIndex = {cost: purchasedItem.cost, item: purchasedItem.item, id: budget.id};	budget.id = budget.id + 1;	purchasedItem = new shoppingcartitemContainerTemplate(costItemIndex);	cartContents.push(purchasedItem);	listScreen.add(purchasedItem);		// Change this if implementing scroller	updateBudget();		// Update the budget window after adding an item}//-- Display of all the items in the cartlet listScreen = new Column({	top: 0, left: 10, right: 10, //skin: shoppinglistSkin,	contents: [
	]});//-- Manual Cart Add Buttonlet manualCartAddButton = new cartButtonTemplate({skin: checkoutSkin, text: "+ Manually Add Item", buttonFunction: addItemToCart});
let cartScroller = Container.template($ => ({	top: 85, bottom: 175, right: 0, left: 0,	contents: [
		VerticalScroller($, {
			active: true, top: 0, bottom: 0, 
			contents: [
				$.contentToScroll,
				VerticalScrollbar(),
			]
		}),		//listScreen,		//VerticalScrollbar(),		//]
	]}));
//-- Removes an item from the cartlet removeFromCart = function(id) {	let itemToDelete, index;	// Find item to delete based on name	for(var i = 0; i < cartContents.length; i++) {		if (cartContents[i].first.name == id) {			//itemToDelete = cartContents[i];			budget.total = parseFloat(budget.total) - parseFloat(idToCostMapping[id]);			index = i;		}	}	delete idToCostMapping[id];	// listScreen.remove(itemToDelete);	// Possibly change this if implementing scroller	cartContents.splice(index, 1);}//-- The window comprised of the add button and the list screenlet cartWindow = new Container({	top: 5, left: 5, right: 5, //skin: yellowSkin,	contents: [		//listScreen,		manualCartAddButton,	]});//********************* Navigation Bar related things ********************////-- Nav Bar creation.let navBar = new Container({    top: 0, height: 50, left: 0, right: 0, skin: shoppingbarSkin,    contents: [    	new myListButtonTemplate({"text": "My List"}),    	new Label({height: 50, string: "Shopping Cart", style: whiteTextStyleBig}),    ]});//********************* Budget Area related things ********************////-- Labels for the values on the right of the budget, directly change to manipulate valueslet valueLabel = new Label({right: 5, height: 20, string: budget.total, style: blackTextStyle});let budgetLabel = new Label({right: 5, height: 20, string: budget.budget, style: blackTextStyle});let differenceLabel = new Label({right: 5, height: 20, string: budget.budget-budget.total, style: blackTextStyle});//-- Function that runs when the editBudget is pressed. Can also result in keyboard input in which case change budget dictionary values.let editBudget = function() {	budget.budget = Math.floor(Math.random() * 10000) / 100.0	// Generate random new budget between $0-100	updateBudget();};//-- Function that determines the background color of the budget section based on % spent.let budgetStatus = function() {	let percent = budget.total / budget.budget;	if (percent < .75) {		return greenSkin;	} else if (percent < .90) {		return yellowSkin;	} else if (percent < 1) {		return orangeSkin;	} else {		return redSkin;	}}//-- Updates the budget numbers based on current budget dictionary valueslet updateBudget = function() {	budgetWindow.skin = budgetStatus();	valueLabel.string = "$"+roundDollars(budget.total).toString();	budgetLabel.string = "$"+roundDollars(budget.budget).toString();	differenceLabel.string = "$"+roundDollars(budget.budget - budget.total).toString();}//-- Creates initial budget arealet drawBudget = function() {	let budgetSkin = budgetStatus();	budgetWindow = new Column({		height: 120, bottom: 50, left: 5, right: 5, skin: budgetSkin,		contents:  		[			new cartButtonTemplate({ "height": 30, "skin": shoppingbuttonSkin, "text": "Edit Budget", "buttonFunction": editBudget }),			new budgetTextTemplate({"category": "Total:", "value": budget.total, "num": valueLabel,}),			new budgetTextTemplate({"category": "Budget:", "value": budget.budget, "num": budgetLabel,}),			new budgetTextTemplate({"category": "Amount Left:", "value": budget.budget - budget.total, "num": differenceLabel,}),		],	});	updateBudget();};//********************* Initialize screen related things ********************////-- Creating the edit budget and checkout buttonslet budgetEditButton = new cartButtonTemplate({ "skin": shoppingbarSkin, "text": "Edit Budget", "buttonFunction": editBudget });let checkoutButton = new cartButtonTemplate({ "height": 30, "skin": checkoutSkin, "text": "Checkout", "buttonFunction": goCheckout });	// show final payment screen function//-- Creating and initializing the budget areavar budgetWindow;drawBudget();//-- Putting windows and buttons into a container to position themlet navBarPosition = new Container({	top: 0, left: 0, right: 0, bottom: 0,	contents: navBar});let cartWindowPosition = new Container({	top: 50, left: 5, right: 5, bottom: 400, skin: budgetbuddySkin,	contents: cartWindow});let checkoutButtonPosition = new Container({	left: 0, right: 0, bottom: 1, height: 30,	contents: checkoutButton});let budgetWindowPosition = new Container({	top: 90, left: 0, right: 0, bottom: 50,	content: budgetWindow,});let switchCartButton = Button.template($ => ({    height: 50, right: 0, bottom: 0, skin: budgetbuddySkin,    contents: [        Label($, {height: 20, string: "Cart", style: blackTextStyle})        ],    Behavior: class extends ButtonBehavior {        onTouchEnded(button){            application.remove(shoppinglistScreen);                        application.add(cartScreenTemplate);        }    }}));let switchListButton = Button.template($ => ({    height: 50, right: 0, bottom: 0, skin: bluskin,    contents: [        Label($, {height: 20, string: "List", style: blackTextStyle})        ],    Behavior: class extends ButtonBehavior {        onTouchEnded(button){            application.remove(cartScreenTemplate);                        application.add(shoppinglistScreen);        }    }}));let navigationPosition = new Line({    right: 5, bottom: 0, height: 50,    contents: [        new switchListButton,        new switchCartButton        ]});//This is the screen template. Creates a column object with the navBar, budget window, checkout button, and cart list.var cartScreenTemplate = new Container(({    top: 0, bottom: 0, left: 0, right: 0, skin: budgetbuddySkin,    contents: [
		new cartScroller({contentToScroll: listScreen}),    	cartWindowPosition,    	navBarPosition,    	budgetWindow,         navigationPosition,    ]}));//var cartScreen = new cartScreenTemplate();//application.add(cartScreen);//text fieldlet whiteSkin = new Skin({ fill: "gray" });let nameInputSkin = new Skin({ borders: { left: 2, right: 2, top: 2, bottom: 2 }, stroke: 'gray' });let fieldStyle = new Style({ color: 'gray', font: 'bold 20px', horizontal: 'left',    vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5 });let fieldHintStyle = new Style({ color: '#aaa', font: '15px', horizontal: 'left',    vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5 });let fieldLabelSkin = new Skin({ fill: ['transparent', 'transparent', '#C0C0C0', '#acd473'] });let MyField = Container.template($ => ({     bottom:5, width: 140, height: 40, skin: nameInputSkin, contents: [        Scroller($, {             left: 4, right: 4, top: 4, bottom: 4, active: true,             Behavior: FieldScrollerBehavior, clip: true,             contents: [                Label($, {                     left: 0, top: 0, bottom: 0, skin: fieldLabelSkin,                     style: fieldStyle, anchor: 'NAME',                    editable: true, string: $.name,                    Behavior: class extends FieldLabelBehavior {                        onEdited(label) {                            let data = this.data;                            data.name = label.string;                            if(parseInt(data.name)) {                            	budget.budget = parseInt(data.name);                              }                                               else {                            	budget.budget = 0;                                  }                                                                          }                    },                }),                Label($, {                    left: 4, right: 4, top: 4, bottom: 4, style: fieldHintStyle,                    string: " ", name: "hint"                }),            ]        })    ]}));//STARTING SCREEN CREATIONvar startScreen = new ScreenTemplate();    //Mylist button    let MylistButtonTemplate = Button.template($ => ({      top:70, height: 100, left: 50, right: 50, skin: shoppingbuttonSkin,        contents: [            Label($, {left: 0, right: 0, height: 50, string: "My List", style: whiteTextStyleBig})        ],        Behavior: class extends ButtonBehavior {            onTouchEnded(button){                application.remove(currentScreen);                application.add(shoppinglistScreen);            }        }    }));    //Start Shopping button    //back button for scan qr code page    let scanQRBackButtonTemplate = Button.template($ => ({      height: 30, left: 0, top: -30, skin: shoppingbarSkin,        contents: [            Label($, {height: 30, left: 5, top: 2, string: "Back", style: whiteTextStyle})        ],        Behavior: class extends ButtonBehavior {            onTouchEnded(button){                application.remove(currentScreen);                currentScreen = startScreen;                application.add(currentScreen);            }        }    }));    let StartShoppingButtonTemplate = Button.template($ => ({      top:70, height: 100, left: 50, right: 50, skin: shoppingbuttonSkin,        contents: [            Label($, {left: 0, right: 0, height: 50, string: "Start Shopping", style: whiteTextStyleBig})        ],        Behavior: class extends ButtonBehavior {            onTouchEnded(button){            	application.remove(currentScreen);                currentScreen = new ScreenTemplate;                currentScreen.add(new topbar());                currentScreen.add(new scanQRBackButtonTemplate());                currentScreen.add(new QRCode());                currentScreen.add(new scanText());                                application.add(currentScreen);            }        }    }));	startScreen.add(new topbar());    startScreen.add(new MylistButtonTemplate());    startScreen.add(new StartShoppingButtonTemplate());//Scan Shopping Cart Page Creation	let scanText = Container.template($ => ({	    top: 50, height: 25, left: 0, right: 0,	    contents: [	     new Label({ style: textStyle, 	            string: "Scan Cart QR Code" }),	    ]	}));		let qrUrl = new Texture("assets/qrImage.png");				let QRCode = Button.template($ => ({		    top: 30, height: 130, width: 130, skin: graySkin ,		    contents: [		     new Label({string: "Scan Here" , style: whiteTextStyle }),		    ],		    Behavior: class extends ButtonBehavior {	            onTouchEnded(button){	                application.remove(currentScreen);	                currentScreen = new AddBudgetScreen();	                scanned = true;	                application.add(currentScreen);	            }        }	}));	//let budgetField = new MyField({name: "Enter Budget"});	let AddBudgetScreen = Container.template($ => ({	    top: 0, bottom:0, left: 0, right: 0, skin : budgetbuddySkin,	    contents: [	    	new topbar(),	    	new Container({             top: 100, height: 40, left: 0, right: 0,             style: textStyle,             contents: [            	                new MyField({name: "Enter Budget"}),            ]        }),        new Container({             top: 200, height: 30, width: 100, skin: shoppingbuttonSkin,             style: textStyle,             contents: [            	Label($, { height: 35, width: 100, active: true, string: 'Enter', style: whiteTextStyle,					behavior: Behavior({						onCreate: function(content){		            		this.upSkin = new Skin({		                		fill: "transparent", 		            		});		            		this.downSkin = new Skin({		             		  fill: "#3AFF3E", 		              		  borders: {left: 1, right: 1, top: 1, bottom: 1}, 		              		  stroke: "white"		           			});		            		content.skin = this.upSkin;		        		},		        		onTouchBegan: function(content){		        		  		          		  content.skin = this.downSkin;		        		},		        		onTouchEnded: function(content){		            		content.skin = this.upSkin;		            		SystemKeyboard.hide();		            				            		application.remove(currentScreen);  		            		currentScreen = cartScreenTemplate;  		            		application.add(currentScreen); 		            		updateBudget();		        		},					})				})            ]        }),        new Container({             top: 250, height: 30, width: 100, skin: shoppingbuttonSkin,             style: textStyle,             contents: [            	Label($, { height: 35, width: 100, active: true, string: 'No Budget', style: whiteTextStyle,					behavior: Behavior({						onCreate: function(content){		            		this.upSkin = new Skin({		                		fill: "transparent", 		                				            		});		            		this.downSkin = new Skin({		             		  fill: "#3AFF3E", 		              		  borders: {left: 1, right: 1, top: 1, bottom: 1}, 		              		  stroke: "white"		           			});		            		content.skin = this.upSkin;		        		},		        		onTouchBegan: function(content){		        		  		          		  content.skin = this.downSkin;		        		},		        		onTouchEnded: function(content){		            		content.skin = this.upSkin;		            		SystemKeyboard.hide();			            		application.remove(currentScreen);  		            		currentScreen = cartScreenTemplate;  		            		application.add(currentScreen); 		            		updateBudget();		        		},					})				})            ]        })	    		    ]	}));		//SHOPPING LIST PAGE CREATION //back button for shopping listlet listItemName = "";let shoppingListEntryField = Container.template($ => ({    top: 15, left: 15, width: 200, height: 40, name: "entryField", skin: nameInputSkin, contents: [        Scroller($, {            left: 4, right: 4, top: 4, bottom: 4, active: true, name: "scroller",            Behavior: FieldScrollerBehavior, clip: true,            contents: [                Label($, {                    left: 0, top: 0, bottom: 0, skin: fieldLabelSkin,                    style: fieldStyle, anchor: "shoppingListEntryField", name: "entry",                    editable: true, string: $.name,                    Behavior: class extends FieldLabelBehavior {                        onEdited(label) {                            let data = this.data;                            data.name = label.string;                                    listItemName = data.name;                        }                    },                }),            ]        })    ]})); let shoppingListBackButtonTemplate = Button.template($ => ({  height: 30, left: 5, top: 7.5, skin: shoppingbarSkin,    contents: [        Label($, {height: 30, left: 5, top: 2, string: "Back", style: whiteTextStyle})    ],    Behavior: class extends ButtonBehavior {        onTouchEnded(button){            application.remove(shoppinglistScreen);            currentScreen = startScreen;            application.add(currentScreen);        }    }})); let shoppingListCartButtonTemplate = Button.template($ => ({  height: 30, right: 0, top: -30, skin: shoppingbarSkin,    contents: [        Label($, {height: 30, right: 5, top: 2, string: "Cart", style: whiteTextStyle})    ],    Behavior: class extends ButtonBehavior {        onTouchEnded(button){            if(scanned == true){                              application.remove(shoppinglistScreen);                currentScreen = cartScreenTemplate;                application.add(currentScreen);            }            else{                application.remove(shoppinglistScreen);                currentScreen = new ScreenTemplate;                currentScreen.add(new topbar());                currentScreen.add(new scanQRBackButtonTemplate());                currentScreen.add(new QRCode());                currentScreen.add(new scanText());                                application.add(currentScreen);            }        }    }})); 
 let shoppingList = new Column({    top: 0, left: 0, right: 0, //bottom: 0,    contents: [],});
let shoppingListScroller = Container.template($ => ({
	top: 115, left: 0, right: 0, bottom: 10, 
	contents: [
		VerticalScroller($, {
			active: true, top: 0, bottom:0,
			contents: [
				$.contentToScroll,
				VerticalScrollbar(),
			]
		}),
	]
})); //add item buttonlet AdditemButtonTemplate = Button.template($ => ({  top: 15, height: 40, left: 220, right: 20, skin: shoppingbuttonSkin,    contents: [        Label($, {left: 0, right: 0, height: 50, string: "Add item", style: textStyle})    ],    Behavior: class extends ButtonBehavior {        onTouchEnded(button){                          if (listItemName != "") {                application.remove(shoppinglistScreen);                shoppingList.add(new shoppinglistitemContainerTemplate());                application.add(shoppinglistScreen);
                shoppingListContents.push(listItemName);                button.container.entryField.scroller.entry.string = "";
                listItemName = "";            } else {                // error message here            }        }    }})); let shoppinglistScreen = new Container({    top: 0, left: 0, right: 0, bottom:0, skin: shoppingcartSkin,    contents: [    new shoppingListScroller({contentToScroll: shoppingList}),    new listtopbar(),    new shoppingListBackButtonTemplate(),    //new shoppingListCartButtonTemplate(),    new Container({        top: 50, left: 0, right: 0, skin: shoppingcartSkin,        contents: [            new shoppingListEntryField({name: ""}),            new AdditemButtonTemplate(),        ],    }),    //new AdditemButtonTemplate()]});  let ListField = Container.template($ => ({    left: 0, height: 30, skin: bluskin, contents: [        Scroller($, {            left: 4, right: 4, top: 4, bottom: 4, active: true,            Behavior: FieldScrollerBehavior, clip: true,            contents: [                Label($, {                    left: 2, height: 30, skin: bluskin,                    style: blackTextStyle, anchor: 'NAME',                    editable: true, string: $.name,                    Behavior: class extends FieldLabelBehavior {                        onEdited(label) {                            let data = this.data;                            data.name = label.string;                            label.container.hint.visible = (data.name.length == 0);                            trace(data.name+"\n");                        }                    },                }),                Label($, {                    left: 2, height: 30, style: grayTextStyle,                    string: "New Item", name: "hint"                }),            ]        })    ]}));     //delete item "X" button    let ListDeleteItemButtonTemplate = Button.template($ => ({      height: 30, left: 5, skin: shoppinglistSkin, name: listItemName,        contents: [            Label($, {height: 30, string: "X", style: grayTextStyle, skin: shoppinglistSkin})        ],        Behavior: class extends ButtonBehavior {            onTouchEnded(button){
            	let index = shoppingListContents.indexOf(button.name);
            	if (index > -1) {
            		shoppingListContents.splice(index, 1);
            	}
            	// Only removes first of instance. Does not remove correct index. Solved by unique ID.
            	button.container.container.remove(button.container);
            	//item = shoppingList[button.name];
            	//shoppingList.remove(item);                /*                numitems--;                application.remove(currentScreen);                currentScreen = new ScreenTemplate();                currentScreen.add(new topbar());                currentScreen.add(new shoppingListBackButtonTemplate());                //add specific item here                for (var i = 0; i < numitems; i++) {                                        currentScreen.add(new shoppinglistitemContainerTemplate(i));                };                currentScreen.add(new AdditemButtonTemplate());                application.add(currentScreen);                */            }        }    }));        // Either we change shoppinglistitemNameTemplate to extract name from entry field or we change shopping listitemcontainertemplate    var shoppinglistitemNameTemplate = Container.template($ => ({        left: 30, height: 30,        skin: whiteSkin, active: true,        contents: [            Label($, {left: 0, height: 30, string: listItemName, style: whiteTextStyle, skin: shoppinglistSkin})        ],        Behavior: class extends Behavior {            onTouchEnded(content) {                //SystemKeyboard.hide();               // content.focus();            }        }    }))     var shoppinglistitemContainerTemplate = Container.template($ => ({        top: 15, height: 40, left: 15, right: 20, skin: shoppinglistSkin, name: listItemName,        contents: [            new ListDeleteItemButtonTemplate(),            new shoppinglistitemNameTemplate(),            new CheckBoxTemplate({ name: " " })        ]    }))    var numitems = 0;    //BEGIN PROGRAM BY CREATING START PAGElet currentScreen = startScreen;application.add(currentScreen)