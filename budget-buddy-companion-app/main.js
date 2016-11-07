//TEEEEEEEESTTTT


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
let bigStyle = new Style({ font: "bold 48px", color: "black" });

//Top navbar template
let topbar = Container.template($ => ({
    top: 0, bottom: 450, left: 0, right: 0, skin: shoppingbarSkin,
    contents: [
    //add back button
    ]
}));

//This is the blank screen template
var ScreenTemplate = Column.template($ => ({
    top: 0, bottom: 0, left: 0, right: 0, skin: budgetbuddySkin,
    contents: [
        new topbar(),
    ]
}));

//first starting screen with start shop button
var startScreenTemplate = new ScreenTemplate();

//startScreenTemplate.add()

//SHOPPING LIST
var shoppinglistScreenTemplate = new ScreenTemplate();

let currentScreen = new ScreenTemplate();
application.add(currentScreen)