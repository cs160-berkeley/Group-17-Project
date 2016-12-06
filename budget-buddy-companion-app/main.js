//importsimport {     Button,    ButtonBehavior } from 'buttons';import {     RadioGroup,     RadioGroupBehavior} from 'buttons';import {    VerticalScroller,    VerticalScrollbar,    TopScrollerShadow,    BottomScrollerShadow} from 'scroller';import {    FieldScrollerBehavior,    FieldLabelBehavior} from 'field';import {    SystemKeyboard} from 'keyboard';import {     LabeledCheckbox } from 'buttons';//********************* Pins ********************////import Pins from "pins";var Pins = require("pins");// Split into on off?var remotePins;var checkout;var scanner;class AppBehavior extends Behavior {	onLaunch(application) {		let discoveryInstance = Pins.discover(			connectionDesc => {				if (connectionDesc.name == "scannerPins") {					trace("Connecting to remote pins \n");					remotePins = Pins.connect(connectionDesc);					// interactions if they connect				}			},			connectionDesc => {				if (connectionDesc.name == "scannerPins") {					trace("Disconnecting from remote pins \n");					remotePins = undefined;				}			}		);}}application.behavior = new AppBehavior();//********************* Data ********************//let store = [{item: "Chex Mix Bold", cost: 2}, {item: "Mugg's Root Beer Can", cost: .79}, {item: "12 Eggs XLRG AA", cost: 3.49}, {item: "1 gal 2% Milk", cost: 4.29}, {item: "Oroweat Whole Wheat", cost: 2.99},			 {item: "Heinz Tomato Ketchup", cost: 2.49}, {item: "Frosted Flakes", cost: 2.29}, {item: "Dole Orange Juice", cost: 3.49}, {item: "Crest Whitening Toothpaste", cost: 2.50}, {item: "Oscar Mayer Hot Dogs (12)", cost: 3.98}];let shoppingListContents = [];let cartContents = [];let idToCostMapping = {};let budget = {total: 0, budget: 0, remaining: 0, id: 0};//-- Helps display a nice dollar amount --//let roundDollars = function(num) {	return Math.floor(num*100)/100.0;}//skinslet graySkin = new Skin({ fill : "#C4C4C4" });let budgetbuddySkin = new Skin({ fill : "white" });let shoppingbuttonSkin = new Skin({ fill : "#1ccaff" });let startshoppingbuttonSkin = new Skin({ fill : "#1ccaff" });let shoppingbarSkin = new Skin({ fill : "#4F4F4F" });let bluskin = new Skin({ fill : "#1ccaff" });let shoppinglistSkin = new Skin({ fill : "#1ccaff" });let shoppingcartSkin = new Skin({ fill : "white" });let greenbudgetSkin = new Skin({ fill: "#53AF42" });let redbudgetSkin = new Skin({ fill: "#cc3d3d" });let yellowbudgetSkin = new Skin({ fill: "#EAC746" });let checkoutSkin = new Skin({ fill : "#1ccaff" });// Budget color indicatorslet greenSkin = new Skin ({fill: '#53AF42'});let redSkin = new Skin ({fill: '#cc3d3d'});let yellowSkin = new Skin ({fill: "#EAC746"});let textStyle = new Style({ font: "bold 20px", color: "black" });let whiteTextStyle = new Style({ font: "bold 20px", color: "white" });let whiteTextStyleBig = new Style({ font: "bold 30px", color: "white" });let grayTextStyle = new Style({ font: "bold 20px", color: "#707070" });let biggrayTextStyle = new Style({ font: "bold 24px", color: "#707070" });let bigStyle = new Style({ font: "bold 48px", color: "black" });let darkGraySkin = new Skin({ fill: "#707070" });let titleStyle = new Style({ font: "20px", color: "white" });let blackTextStyle = new Style({ font: "bold 20px", color: "black" });var scanned = false;let cartIcon = new Texture("assets/cart.png");let penIcon = new Texture("assets/pen.png");let listIcon = new Texture("assets/list.png");let backIcon = new Texture("assets/back.png");let cartIconb = new Texture("assets/cartb.png");let penIconb = new Texture("assets/penb.png");let listIconb = new Texture("assets/listb.png");let cartSkinFilled = new Skin({      width: 50, height: 50,      texture: cartIconb,      fill: bluskin,      aspect: "fit"});let cartSkinBlank = new Skin({      width: 50, height: 50,      texture: cartIcon,      fill: budgetbuddySkin,      aspect: "fit"});let penSkinFilled = new Skin({      width: 30, height: 30,      texture: penIconb,      fill: bluskin,      aspect: "fit"});let backSkinFilled = new Skin({      width: 50, height: 50,      texture: backIcon,      fill: bluskin,      aspect: "fit"});let listSkinFilled = new Skin({      width: 50, height: 50,      texture: listIconb,      fill: bluskin,      aspect: "fit"});let listSkinBlank = new Skin({      width: 50, height: 50,      texture: listIcon,      fill: budgetbuddySkin,      aspect: "fit"});//Top navbar templatelet topbar = Container.template($ => ({    top: 0, height: 50, left: 0, right: 0, skin: shoppingbarSkin,    contents: [    	            Label($, {height: 30, string: "Budget Buddy", style: whiteTextStyleBig})    ]}));//shoppinglist top barlet listtopbar = Container.template($ => ({    top: 0, height: 50, left: 0, right: 0, skin: shoppingbarSkin,    contents: [    	            Label($, {height: 30, string: "Shopping List", style: whiteTextStyleBig})    ]}));//empty checkbox templatelet CheckBoxTemplate = LabeledCheckbox.template($ => ({    active: true, top: 0, bottom: 0, right: 5,    behavior: Behavior({    })}));//This is the blank screen templatevar ScreenTemplate = Column.template($ => ({    top: 0, bottom: 0, left: 0, right: 0, skin: budgetbuddySkin,    contents: [    ]}));//-- CHECKOUT BUTTON FUNCTIONvar goCheckout = function() {	application.remove(currentScreen);	currentScreen = startScreen;	application.add(currentScreen)    scanned = false;    checkout.close();    scanner.close();    // Clear the list and the shopping cart here.};//-- Pin Functionlet startConnection = function() {	checkout = remotePins.repeat("/checkout/read", 50, function(result) {		trace(result);		if(result) {			goCheckout();			remotePins.invoke("/checkout/write", 0);		}	});	scanner = remotePins.repeat("/scanner/read", 50, function(result) {		trace(result);		if(result) {			remotePins.invoke("/barcode/read", addItemToCart);			remotePins.invoke("/scanner/write", 0);		}	});}//*********************Cart Screen Templates ********************////-- Template for My List button on the top leftlet myListButtonTemplate = Button.template($ => ({  height: 35, left: 0, top: 0, skin: shoppingbarSkin,    contents: [        Label($, {height: 25, left: 5, top: 0, string: $.text, style: whiteTextStyle})    ],    Behavior: class extends ButtonBehavior {        onTouchEnded(button){                application.remove(currentScreen);                application.add(shoppinglistScreen);        }    }}));     //delete item "X" buttonlet DeleteItemButtonTemplate = Button.template($ => ({	height: 20, left: 5, name: $.id, skin: bluskin,     contents: [	    Label($, {height: 20, string: "X", style: biggrayTextStyle})	    ],    Behavior: class extends ButtonBehavior {	    onTouchEnded(button){	    	removeFromCart(button.name);	    	updateBudget();	    	button.container.container.remove(button.container);        }    }}));//-- Template for Edit Budget and Checkout buttonslet cartButtonTemplate = Button.template($ => ({	height: 30, right: 5, left: 5, top: 2.5, bottom: 2.5, skin: $.skin,    contents: [	    Label($, {height: 20, string: $.text, style: whiteTextStyle})	    ],    Behavior: class extends ButtonBehavior {	    onTouchEnded(button){	    	$.buttonFunction();        }    }}));        //-- Template for items in the shopping cartvar shoppingcartitemContainerTemplate = Container.template($ => ({     height: 40, left: 5, right: 5, top: 5, skin: bluskin,    contents: [        new DeleteItemButtonTemplate({id: $.id}),        Label($, {left: 30, height: 20, string: $.item, style: textStyle}),        Label($, {right: 0, height: 20, string: $.cost, style: textStyle}),    ]}));//-- Template for each row of the budget informationlet budgetTextTemplate = Container.template($ => ({	height: 25, left: 0, right: 0, top: 1,	contents: [		Label($, {left: 5, height: 20, string: $.category, style: blackTextStyle}),		$.num, //Label($, {right: 5, height: 30, string: $.value, style: blackTextStyle}),	]}));//********************* Shopping cart related things ********************////-- Function to add item to cart// Add pin listenerlet addItemToCart = function(barcode) {	//let purchasedItem = store[Math.floor(Math.random() * store.length)];	let purchasedItem = store[Math.floor(barcode*10)];	budget.total += purchasedItem.cost;	idToCostMapping[budget.id] = purchasedItem.cost;	let costItemIndex = {cost: purchasedItem.cost, item: purchasedItem.item, id: budget.id};	budget.id = budget.id + 1;	purchasedItem = new shoppingcartitemContainerTemplate(costItemIndex);	cartContents.push(purchasedItem);	listScreen.add(purchasedItem);		// Change this if implementing scroller	updateBudget();		// Update the budget window after adding an item}//-- Display of all the items in the cartlet listScreen = new Column({	top: 0, left: 10, right: 10, //skin: shoppinglistSkin,	contents: [	]});//-- Manual Cart Add Button// Remove thislet manualCartAddButton = new cartButtonTemplate({skin: checkoutSkin, text: "+ Manually Add Item", buttonFunction: addItemToCart});let cartScroller = Container.template($ => ({	top: 85, bottom: 175, right: 0, left: 0,	contents: [		VerticalScroller($, {			active: true, top: 0, bottom: 0, 			contents: [				$.contentToScroll,				VerticalScrollbar(),			]		}),		//listScreen,		//VerticalScrollbar(),		//]	]}));//-- Removes an item from the cartlet removeFromCart = function(id) {	let itemToDelete, index;	// Find item to delete based on name	for(var i = 0; i < cartContents.length; i++) {		if (cartContents[i].first.name == id) {			//itemToDelete = cartContents[i];			budget.total = parseFloat(budget.total) - parseFloat(idToCostMapping[id]);			index = i;		}	}	delete idToCostMapping[id];	// listScreen.remove(itemToDelete);	// Possibly change this if implementing scroller	cartContents.splice(index, 1);}//-- The window comprised of the add button and the list screenlet cartWindow = new Container({	top: 5, left: 5, right: 5, //skin: yellowSkin,	contents: [		//listScreen,		//manualCartAddButton,	]});//********************* Navigation Bar related things ********************////-- Nav Bar creation.let navBar = new Container({    top: 0, height: 50, left: 0, right: 0, skin: shoppingbarSkin,    contents: [    	//new myListButtonTemplate({"text": "My List"}),    	new Label({height: 50, string: "Shopping Cart", style: whiteTextStyleBig}),    ]});//********************* Budget Area related things ********************////-- Labels for the values on the right of the budget, directly change to manipulate valueslet valueLabel = new Label({right: 5, height: 20, string: budget.total, style: blackTextStyle});let budgetLabel = new Label({right: 5, height: 20, string: budget.budget, style: blackTextStyle});let differenceLabel = new Label({right: 5, height: 20, string: budget.budget-budget.total, style: blackTextStyle});//-- Function that runs when the editBudget is pressed. Can also result in keyboard input in which case change budget dictionary values.let editBudget = function() {	application.remove(cartScreenTemplate);    application.add(AddBudgetScreen2);};//-- Function that determines the background color of the budget section based on % spent.let budgetStatus = function() {	let percent = budget.total / budget.budget;	if (percent < .75) {		return greenSkin;	} else if (percent < 1) {		return yellowSkin;	} else {		return redSkin;	}}//-- Updates the budget numbers based on current budget dictionary valueslet updateBudget = function() {	budgetWindow.skin = budgetStatus();	valueLabel.string = "$"+roundDollars(budget.total).toString();	budgetLabel.string = "$"+roundDollars(budget.budget).toString();	differenceLabel.string = "$"+roundDollars(budget.budget - budget.total).toString();}//-- Creates initial budget arealet editbudgetButton = Button.template($ => ({    width: 30, height: 30, right: 5, top: 5, skin: penSkinFilled,    contents: [        ],    Behavior: class extends ButtonBehavior {        onTouchEnded(button){            editBudget();        }    }}));let drawBudget = function() {	let budgetSkin = budgetStatus();	budgetWindow = new Column({		height: 120, bottom: 50, left: 5, right: 5, skin: budgetSkin,		contents:  		[			new editbudgetButton,            new budgetTextTemplate({"category": "Total:", "value": budget.total, "num": valueLabel,}),			new budgetTextTemplate({"category": "Budget:", "value": budget.budget, "num": budgetLabel,}),			new budgetTextTemplate({"category": "Amount Left:", "value": budget.budget - budget.total, "num": differenceLabel,}),		],	});	updateBudget();};//********************* Initialize screen related things ********************////-- Creating the edit budget and checkout buttonslet budgetEditButton = new cartButtonTemplate({ "skin": penSkinFilled, "text": "Edit Budget", "buttonFunction": editBudget });let checkoutButton = new cartButtonTemplate({ "height": 30, "skin": checkoutSkin, "text": "Checkout", "buttonFunction": goCheckout });	// show final payment screen function//-- Creating and initializing the budget areavar budgetWindow;drawBudget();//-- Putting windows and buttons into a container to position themlet navBarPosition = new Container({	top: 0, left: 0, right: 0, bottom: 0,	contents: navBar});let cartWindowPosition = new Container({	top: 50, left: 5, right: 5, bottom: 400, skin: budgetbuddySkin,	contents: cartWindow});let checkoutButtonPosition = new Container({	left: 0, right: 0, bottom: 1, height: 30,	contents: checkoutButton});let budgetWindowPosition = new Container({	top: 90, left: 0, right: 0, bottom: 50,	content: budgetWindow,});let switchCartButton = Button.template($ => ({    width: 320, height: 50, bottom: 0, skin: cartSkinFilled,    contents: [        ],    Behavior: class extends ButtonBehavior {        onTouchEnded(button){            if(scanned == true)            {                application.remove(shoppinglistScreen2);                            application.add(cartScreenTemplate);                            }            else            {                                application.remove(shoppinglistScreen);                currentScreen = new ScreenTemplate;                currentScreen.add(new topbar());                currentScreen.add(new scanQRBackButtonTemplate());                currentScreen.add(new QRCode());                currentScreen.add(new scanText());                                application.add(currentScreen);            }        }    }}));let switchCartButtonBlank = Button.template($ => ({    width: 160, height: 50, bottom: 0, skin: cartSkinBlank,    contents: [        ],    Behavior: class extends ButtonBehavior {        onTouchEnded(button){        }    }}));let switchListButton = Button.template($ => ({    width: 320, height: 50, bottom: 0, skin: listSkinFilled,    contents: [        ],    Behavior: class extends ButtonBehavior {        onTouchEnded(button){            application.remove(cartScreenTemplate);                       application.add(shoppinglistScreen2);        }    }}));let switchListButtonBlank = Button.template($ => ({    width: 160, height: 50,bottom: 0, skin: listSkinBlank,    contents: [        ],    Behavior: class extends ButtonBehavior {        onTouchEnded(button){        }    }}));let navigationPosition = new Line({    right: 0, bottom: 0, height: 50, skin: bluskin,    contents: [        new switchListButton        ]});//This is the screen template. Creates a column object with the navBar, budget window, checkout button, and cart list.var cartScreenTemplate = new Container(({    top: 0, bottom: 0, left: 0, right: 0, skin: budgetbuddySkin,    contents: [		new cartScroller({contentToScroll: listScreen}),    	cartWindowPosition,    	navBarPosition,    	budgetWindow,         navigationPosition,    ]}));//var cartScreen = new cartScreenTemplate();//application.add(cartScreen);//text fieldlet whiteSkin = new Skin({ fill: "gray" });let nameInputSkin = new Skin({ borders: { left: 2, right: 2, top: 2, bottom: 2 }, stroke: 'gray' });let fieldStyle = new Style({ color: 'gray', font: 'bold 20px', horizontal: 'left',    vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5 });let fieldHintStyle = new Style({ color: '#aaa', font: '15px', horizontal: 'left',    vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5 });let fieldLabelSkin = new Skin({ fill: ['transparent', 'transparent', '#C0C0C0', '#acd473'] });let MyField = Container.template($ => ({     bottom:5, width: 140, height: 40, skin: nameInputSkin, contents: [        Scroller($, {             left: 4, right: 4, top: 4, bottom: 4, active: true,             Behavior: FieldScrollerBehavior, clip: true,             contents: [                Label($, {                     left: 0, top: 0, bottom: 0, skin: fieldLabelSkin,                     style: fieldStyle, anchor: 'NAME',                    editable: true, string: $.name,                    Behavior: class extends FieldLabelBehavior {                        onEdited(label) {                            let data = this.data;                            data.name = label.string;                            if(parseInt(data.name)) {                            	budget.budget = parseInt(data.name);                              }                                               else {                            	budget.budget = 0;                                  }                                                                          }                    },                }),                Label($, {                    left: 4, right: 4, top: 4, bottom: 4, style: fieldHintStyle,                    string: " ", name: "hint"                }),            ]        })    ]}));//STARTING SCREEN CREATIONvar startScreen = new ScreenTemplate();    //Mylist button    let MylistButtonTemplate = Button.template($ => ({      top:70, height: 100, left: 50, right: 50, skin: shoppingbuttonSkin,        contents: [            Label($, {left: 0, right: 0, height: 50, string: "My List", style: whiteTextStyleBig})        ],        Behavior: class extends ButtonBehavior {            onTouchEnded(button){                application.remove(currentScreen);                application.add(shoppinglistScreen);            }        }    }));    //Start Shopping button    //back button for scan qr code page    let scanQRBackButtonTemplate = Button.template($ => ({      height: 50, left: 5, top: -50, skin: backSkinFilled,        contents: [        ],        Behavior: class extends ButtonBehavior {            onTouchEnded(button){                application.remove(currentScreen);                currentScreen = startScreen;                application.add(currentScreen);            }        }    }));    let StartShoppingButtonTemplate = Button.template($ => ({      top:70, height: 100, left: 50, right: 50, skin: shoppingbuttonSkin,        contents: [            Label($, {left: 0, right: 0, height: 50, string: "Start Shopping", style: whiteTextStyleBig})        ],        Behavior: class extends ButtonBehavior {            onTouchEnded(button){            	application.remove(currentScreen);                currentScreen = new ScreenTemplate;                currentScreen.add(new topbar());                currentScreen.add(new scanQRBackButtonTemplate());                currentScreen.add(new QRCode());                currentScreen.add(new scanText());                                application.add(currentScreen);            }        }    }));	startScreen.add(new topbar());    startScreen.add(new MylistButtonTemplate());    startScreen.add(new StartShoppingButtonTemplate());//Scan Shopping Cart Page Creation	let scanText = Container.template($ => ({	    top: 50, height: 25, left: 0, right: 0,	    contents: [	     new Label({ style: textStyle, 	            string: "Scan Cart QR Code" }),	    ]	}));		let qrUrl = new Texture("assets/qrImage.png");				let QRCode = Button.template($ => ({		    top: 30, height: 130, width: 130, skin: graySkin ,		    contents: [		     new Label({string: "Scan Here" , style: whiteTextStyle }),		    ],		    Behavior: class extends ButtonBehavior {	            onTouchEnded(button){	                application.remove(currentScreen);	                currentScreen = new AddBudgetScreen();	                scanned = true;	                application.add(currentScreen);	            }        }	}));	//let budgetField = new MyField({name: "Enter Budget"});	let AddBudgetScreen = Container.template($ => ({	    top: 0, bottom:0, left: 0, right: 0, skin : budgetbuddySkin,	    contents: [	    	new topbar(),	    	new Container({             top: 100, height: 40, left: 0, right: 0,             style: textStyle,             contents: [            	                new MyField({name: "Enter Budget"}),            ]        }),        new Container({             top: 200, height: 30, width: 100, skin: shoppingbuttonSkin,             style: textStyle,             contents: [            	Label($, { height: 35, width: 100, active: true, string: 'Enter', style: whiteTextStyle,					behavior: Behavior({						onCreate: function(content){		            		this.upSkin = new Skin({		                		fill: "transparent", 		            		});		            		this.downSkin = new Skin({		             		  fill: "#3AFF3E", 		              		  borders: {left: 1, right: 1, top: 1, bottom: 1}, 		              		  stroke: "white"		           			});		            		content.skin = this.upSkin;		        		},		        		onTouchBegan: function(content){		        		  		          		  content.skin = this.downSkin;		        		},		        		onTouchEnded: function(content){		            		content.skin = this.upSkin;		            		SystemKeyboard.hide();		            				            		application.remove(currentScreen);  		            		currentScreen = cartScreenTemplate;  		            		application.add(currentScreen); 		            		updateBudget();		            		startConnection();		        		},					})				})            ]        }),        new Container({             top: 250, height: 30, width: 100, skin: shoppingbuttonSkin,             style: textStyle,             contents: [            	Label($, { height: 35, width: 100, active: true, string: 'No Budget', style: whiteTextStyle,					behavior: Behavior({						onCreate: function(content){		            		this.upSkin = new Skin({		                		fill: "transparent", 		                				            		});		            		this.downSkin = new Skin({		             		  fill: "#3AFF3E", 		              		  borders: {left: 1, right: 1, top: 1, bottom: 1}, 		              		  stroke: "white"		           			});		            		content.skin = this.upSkin;		        		},		        		onTouchBegan: function(content){		        		  		          		  content.skin = this.downSkin;		        		},		        		onTouchEnded: function(content){		            		content.skin = this.upSkin;		            		SystemKeyboard.hide();			            		application.remove(currentScreen);  		            		currentScreen = cartScreenTemplate;  		            		application.add(currentScreen); 		            		updateBudget();		            		startConnection();		        		},					})				})            ]        })	    		    ]	}));		    let AddBudgetScreen2 = Container.template($ => ({        top: 0, bottom:0, left: 0, right: 0, skin : budgetbuddySkin,        contents: [            new topbar(),            new Container({             top: 100, height: 40, left: 0, right: 0,             style: textStyle,             contents: [                             new MyField({name: "Enter Budget"}),            ]        }),        new Container({             top: 200, height: 30, width: 100, skin: shoppingbuttonSkin,             style: textStyle,             contents: [                Label($, { height: 35, width: 100, active: true, string: 'Enter', style: whiteTextStyle,                    behavior: Behavior({                        onCreate: function(content){                            this.upSkin = new Skin({                                fill: "transparent",                             });                            this.downSkin = new Skin({                              fill: "#3AFF3E",                               borders: {left: 1, right: 1, top: 1, bottom: 1},                               stroke: "white"                            });                            content.skin = this.upSkin;                        },                        onTouchBegan: function(content){                                                    content.skin = this.downSkin;                        },                        onTouchEnded: function(content){                            content.skin = this.upSkin;                            SystemKeyboard.hide();                                                      application.remove(currentScreen);                              currentScreen = cartScreenTemplate;                              application.add(currentScreen);                             updateBudget();                            startConnection();                        },                    })                })            ]        }),        new Container({             top: 250, height: 30, width: 100, skin: shoppingbuttonSkin,             style: textStyle,             contents: [                Label($, { height: 35, width: 100, active: true, string: 'Back', style: whiteTextStyle,                    behavior: Behavior({                        onCreate: function(content){                            this.upSkin = new Skin({                                fill: "transparent",                                                             });                            this.downSkin = new Skin({                              fill: "#3AFF3E",                               borders: {left: 1, right: 1, top: 1, bottom: 1},                               stroke: "white"                            });                            content.skin = this.upSkin;                        },                        onTouchBegan: function(content){                                                    content.skin = this.downSkin;                        },                        onTouchEnded: function(content){                            content.skin = this.upSkin;                            SystemKeyboard.hide();                              application.remove(currentScreen);                              currentScreen = cartScreenTemplate;                              application.add(currentScreen);                             updateBudget();                            startConnection();                        },                    })                })            ]        })                    ]    }));//SHOPPING LIST PAGE CREATION let listItemName = "";let shoppingListEntryField = Container.template($ => ({    top: 15, left: 15, width: 200, height: 40, name: "entryField", skin: nameInputSkin, contents: [        Scroller($, {            left: 4, right: 4, top: 4, bottom: 4, active: true, name: "scroller",            Behavior: FieldScrollerBehavior, clip: true,            contents: [                Label($, {                    left: 0, top: 0, bottom: 0, skin: fieldLabelSkin,                    style: fieldStyle, anchor: "shoppingListEntryField", name: "entry",                    editable: true, string: $.name,                    Behavior: class extends FieldLabelBehavior {                        onEdited(label) {                            let data = this.data;                            data.name = label.string;                                    listItemName = data.name;                        }                    },                }),            ]        })    ]})); let shoppingListBackButtonTemplate = Button.template($ => ({  height: 50, left: 5, top: 0, skin: backSkinFilled,    contents: [    ],    Behavior: class extends ButtonBehavior {        onTouchEnded(button){            application.remove(shoppinglistScreen);            currentScreen = startScreen;            application.add(currentScreen);        }    }})); let shoppingListCartButtonTemplate = Button.template($ => ({  height: 30, right: 0, top: -30, skin: shoppingbarSkin,    contents: [        Label($, {height: 30, right: 5, top: 2, string: "Cart", style: whiteTextStyle})    ],    Behavior: class extends ButtonBehavior {        onTouchEnded(button){            if(scanned == true){                              application.remove(shoppinglistScreen);                currentScreen = cartScreenTemplate;                application.add(currentScreen);            }            else{                application.remove(shoppinglistScreen);                currentScreen = new ScreenTemplate;                currentScreen.add(new topbar());                currentScreen.add(new scanQRBackButtonTemplate());                currentScreen.add(new QRCode());                currentScreen.add(new scanText());                                application.add(currentScreen);            }        }    }}));  let shoppingList = new Column({    top: 0, left: 0, right: 0, //bottom: 0,    contents: [],});let shoppingList2 = new Column({    top: 0, left: 0, right: 0, //bottom: 0,    contents: [],});let shoppingListScroller = Container.template($ => ({	top: 115, left: 0, right: 0, bottom: 10, 	contents: [		VerticalScroller($, {			active: true, top: 0, bottom:0,			contents: [				$.contentToScroll,				VerticalScrollbar(),			]		}),	]})); //add item buttonlet AdditemButtonTemplate = Button.template($ => ({  top: 15, height: 40, left: 220, right: 20, skin: shoppingbuttonSkin,    contents: [        Label($, {left: 0, right: 0, height: 50, string: "Add item", style: textStyle})    ],    Behavior: class extends ButtonBehavior {        onTouchEnded(button){                          if (listItemName != "") {                application.remove(button.container.container);                shoppingList.add(new shoppinglistitemContainerTemplate());                shoppingList2.add(new shoppinglistitemContainerTemplate());                application.add(button.container.container);                shoppingListContents.push(listItemName);                button.container.entryField.scroller.entry.string = "";                listItemName = "";            } else {                // error message here            }        }    }}));let listnavigationPosition = new Line({    bottom: 0, height: 50, skin: bluskin,    contents: [        new switchCartButton        ]}); let shoppinglistScreen = new Container({    top: 0, left: 0, right: 0, bottom:0, skin: shoppingcartSkin,    contents: [    new shoppingListScroller({contentToScroll: shoppingList}),    new listtopbar(),    new shoppingListBackButtonTemplate(),    //new shoppingListCartButtonTemplate(),    new Container({        top: 50, left: 0, right: 0, skin: shoppingcartSkin,        contents: [            new shoppingListEntryField({name: ""}),            new AdditemButtonTemplate()        ],    }),    //new AdditemButtonTemplate()]});  let shoppinglistScreen2 = new Container({    top: 0, left: 0, right: 0, bottom:0, skin: shoppingcartSkin,    contents: [    new shoppingListScroller({contentToScroll: shoppingList2}),    new listtopbar(),    //new shoppingListBackButtonTemplate(),    //new shoppingListCartButtonTemplate(),    new Container({        top: 50, left: 0, right: 0, skin: shoppingcartSkin,        contents: [            new shoppingListEntryField({name: ""}),            new AdditemButtonTemplate()        ],    }),    //new AdditemButtonTemplate()    listnavigationPosition]}); let ListField = Container.template($ => ({    left: 0, height: 30, skin: bluskin, contents: [        Scroller($, {            left: 4, right: 4, top: 4, bottom: 4, active: true,            Behavior: FieldScrollerBehavior, clip: true,            contents: [                Label($, {                    left: 2, height: 30, skin: bluskin,                    style: blackTextStyle, anchor: 'NAME',                    editable: true, string: $.name,                    Behavior: class extends FieldLabelBehavior {                        onEdited(label) {                            let data = this.data;                            data.name = label.string;                            label.container.hint.visible = (data.name.length == 0);                            trace(data.name+"\n");                        }                    },                }),                Label($, {                    left: 2, height: 30, style: grayTextStyle,                    string: "New Item", name: "hint"                }),            ]        })    ]}));     //delete item "X" button    let ListDeleteItemButtonTemplate = Button.template($ => ({      height: 30, left: 5, skin: shoppinglistSkin, name: listItemName,        contents: [            Label($, {height: 30, string: "X", style: biggrayTextStyle, skin: shoppinglistSkin})        ],        Behavior: class extends ButtonBehavior {            onTouchEnded(button){            	let index = shoppingListContents.indexOf(button.name);            	if (index > -1) {            		shoppingListContents.splice(index, 1);            	}            	// Only removes first of instance. Does not remove correct index. Solved by unique ID.            	button.container.container.remove(button.container);            	//item = shoppingList[button.name];            	//shoppingList.remove(item);                /*                numitems--;                application.remove(currentScreen);                currentScreen = new ScreenTemplate();                currentScreen.add(new topbar());                currentScreen.add(new shoppingListBackButtonTemplate());                //add specific item here                for (var i = 0; i < numitems; i++) {                                        currentScreen.add(new shoppinglistitemContainerTemplate(i));                };                currentScreen.add(new AdditemButtonTemplate());                application.add(currentScreen);                */            }        }    }));        // Either we change shoppinglistitemNameTemplate to extract name from entry field or we change shopping listitemcontainertemplate    var shoppinglistitemNameTemplate = Container.template($ => ({        left: 30, height: 30,        skin: whiteSkin, active: true,        contents: [            Label($, {left: 0, height: 30, string: listItemName, style: whiteTextStyle, skin: shoppinglistSkin})        ],        Behavior: class extends Behavior {            onTouchEnded(content) {                //SystemKeyboard.hide();               // content.focus();            }        }    }))     var shoppinglistitemContainerTemplate = Container.template($ => ({        top: 15, height: 40, left: 15, right: 20, skin: shoppinglistSkin, name: listItemName,        contents: [            new ListDeleteItemButtonTemplate(),            new shoppinglistitemNameTemplate(),            new CheckBoxTemplate({ name: " " })        ]    }))    var numitems = 0;    //BEGIN PROGRAM BY CREATING START PAGElet currentScreen = startScreen;application.add(currentScreen)