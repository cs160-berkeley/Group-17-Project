//REMEMBER THAT THE PROTOTYPE DOESN'T NEED ANY COMPLEX INTERACTIVE FUNCTIONS FOR PRESENTATION 

//Imports

import { 
    Button,
    ButtonBehavior 
} from 'buttons';

import { 
    RadioGroup, 
    RadioGroupBehavior
} from 'buttons';

import {
    VerticalScroller,
    VerticalScrollbar,
    TopScrollerShadow,
    BottomScrollerShadow
} from 'scroller';


import {
    FieldScrollerBehavior,
    FieldLabelBehavior
} from 'field';

import {
    SystemKeyboard
} from 'keyboard';

import { 
    LabeledCheckbox 
} from 'buttons';

import Pins from "pins";


//skins

let graySkin = new Skin({ fill : "#C4C4C4" });
let budgetbuddySkin = new Skin({ fill : "#F3F5C4" });
let shoppingbuttonSkin = new Skin({ fill : "#2D9CDB" });
let startshoppingbuttonSkin = new Skin({ fill : "#93EDD4" });
let shoppingbarSkin = new Skin({ fill : "#56CCF2" });
let shoppinglistSkin = new Skin({ fill : "#F9CB8F" });
let shoppingcartSkin = new Skin({ fill : "#6FCF97" });
let greenbudgetSkin = new Skin({ fill: "#27AE60" });
let redbudgetSkin = new Skin({ fill: "#F2994A" });
let yellowbudgetSkin = new Skin({ fill: "#F2D74C" });

let textStyle = new Style({ font: "bold 20px", color: "black" });
let grayTextStyle = new Style({ font: "bold 20px", color: "gray" });
let bigStyle = new Style({ font: "bold 48px", color: "black" });

var listItems = ["Eggs", "Milk", "Bread"];
var cartItems = ["Lucerne Eggs", "Horizon Milk", "Wonder Bread", "Odwalla Mango Smoothie", "Meow Mix"];

//Top navbar template
let topbar = Container.template($ => ({
    top: 0, height: 25, left: 0, right: 0, skin: shoppingbarSkin,
    contents: [
    //add back button
    ]
}));


//empty checkbox template
let CheckBoxTemplate = LabeledCheckbox.template($ => ({
    active: true, top: 0, bottom: 0, right: 5,
    behavior: Behavior({
    })
}));


//This is the blank screen template
var ScreenTemplate = Column.template($ => ({
    top: 0, bottom: 0, left: 0, right: 0, skin: budgetbuddySkin,
    contents: [
        new topbar(),
    ]
}));


//STARTING SCREEN CREATION

var startScreen = new ScreenTemplate();

    //Mylist button
    let MylistButtonTemplate = Button.template($ => ({
      top:70, height: 100, left: 50, right: 50, skin: shoppingbuttonSkin,
        contents: [
            Label($, {left: 0, right: 0, height: 50, string: "My List", style: bigStyle})
        ],
        Behavior: class extends ButtonBehavior {
            onTouchEnded(button){
                application.remove(currentScreen);
                currentScreen = new ScreenTemplate;
                currentScreen.add(new AdditemButtonTemplate());
                application.add(currentScreen);
            }
        }
    }));

    //Start Shopping button
    let StartShoppingButtonTemplate = Button.template($ => ({
      top:70, height: 100, left: 50, right: 50, skin: shoppingbuttonSkin,
        contents: [
            Label($, {left: 0, right: 0, height: 50, string: "Start Shopping", style: bigStyle})
        ],
        Behavior: class extends ButtonBehavior {
            onTouchEnded(button){
            }
        }
    }));

    startScreen.add(new MylistButtonTemplate());
    startScreen.add(new StartShoppingButtonTemplate());


//SHOPPING LIST PAGE CREATION

    //delete item "X" button
    let DeleteItemButtonTemplate = Button.template($ => ({
      height: 30, left: 5, skin: shoppinglistSkin,
        contents: [
            Label($, {height: 30, string: "X", style: grayTextStyle})
        ],
        Behavior: class extends ButtonBehavior {
            onTouchEnded(button){
                numitems--;
                application.remove(currentScreen);
                currentScreen = new ScreenTemplate();
                //add specific item here
                for (var i = 0; i < numitems; i++) {                    
                    currentScreen.add(new shoppinglistitemContainerTemplate());
                };
                currentScreen.add(new AdditemButtonTemplate());
                application.add(currentScreen);
            }
        }
    }));

    var shoppinglistitemContainerTemplate = Container.template($ => ({
        top: 20, height: 30, left: 20, right: 20, skin: shoppinglistSkin,
        contents: [
            new DeleteItemButtonTemplate(),
            Label($, {left: 30, height: 30, string: "Eggs", style: textStyle}),
            new CheckBoxTemplate({ name: " " })
        ]
    }))
    var numitems = 0;
    var shoppinglistScreenTemplate = new ScreenTemplate();
    //add item button
    let AdditemButtonTemplate = Button.template($ => ({
      top:20, height: 30, left: 20, right: 20, skin: shoppingbuttonSkin,
        contents: [
            Label($, {left: 0, right: 0, height: 50, string: "+ Add item", style: textStyle})
        ],
        Behavior: class extends ButtonBehavior {
            onTouchEnded(button){
                numitems++;
                application.remove(currentScreen);
                currentScreen = new ScreenTemplate();
                //add specific item here
                for (var i = 0; i < numitems; i++) {                    
                    currentScreen.add(new shoppinglistitemContainerTemplate());
                };
                currentScreen.add(new AdditemButtonTemplate());
                application.add(currentScreen);

            }
        }
    }));




//BEGIN PROGRAM BY CREATING START PAGE
let currentScreen = startScreen;
application.add(currentScreen)