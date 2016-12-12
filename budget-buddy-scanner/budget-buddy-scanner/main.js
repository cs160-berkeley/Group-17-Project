/*
 *     Copyright (C) 2010-2016 Marvell International Ltd.
 *     Copyright (C) 2002-2010 Kinoma, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */
 
import { 
	Button,
	ButtonBehavior
} from 'buttons'; 

let whiteSkin = new Skin ({fill: 'white'});
let greenSkin = new Skin ({fill: 'green'});
let blueSkin = new Skin ({fill: 'blue'});
let redSkin = new Skin ({fill: 'red'});

let bigText = new Style({ font: "bold 48px", color: "#333333" });

let images = ["chex", "mug", "eggs", "milk", "bread", "ketchup", "cereal", "oj", "toothpaste", "hotdog"];

let ButtonTemplate = Button.template($ => ({
	top: 10, bottom: 10, left: 10, right: 10, name: $.name, height: 60,
	contents: [
		Text($, {left: 0, right: 0, height: 55, string: $.textForLabel, style: bigText})
	],
	Behavior: class extends ButtonBehavior {
		onTap(button) {
			Pins.invoke("/" + button.name + "/write", 1); 
		}
	}
}));

let MainContainer = Container.template($ => ({
    left: 0, right: 0, top: 0, bottom: 0, skin: whiteSkin,
    contents: [
    	
    ]
}));

let foodImage = new Picture({top: 10, height: 100});

let Pins = require("pins");

class AppBehavior extends Behavior {
	onLaunch(application) {
		application.shared = true;
		Pins.configure({
			scanner: {
				require: "Digital",
				pins: {
                    //power: {pin:51, voltage: 3.3, type: "Power"},
					ground: {pin:52, type: "Ground"},
					digital: {pin: 53, direction: "output"}//, type: "Digital"},
				}
			},
			barcode: {
				require: "Analog", 
				pins: {
					analog: {pin: 54},
				}
			},
			checkout: {
				require: "Digital",
				pins: {
                    //power: { pin: 55, voltage: 3.3, type: "Power"},
					ground: { pin: 56, type: "Ground" },
					digital: { pin: 57, direction: "output"}//, type: "Digital"},
				}
			}
		}, function(success) {
			if(!success) {
				trace("Failure in configuration!");
			}
			else {
				Pins.share("ws", {zeroconf: true, name: "scannerPins"});
				trace("Pins shared \n");
				Pins.repeat("/barcode/read", 300, function(result) {
					if (result) {
						trace(result);
						trace(result*10);
						foodImage.url = "assets/" + images[Math.floor(result*10)] + ".png";
					}
				});
			}
		});		
	}
}

// Interface, needs a scan button and a checkout button.
let buttons = new Column({
	left: 0, right: 0, top: 0, bottom: 0, skin: whiteSkin,
	contents: [
		foodImage,
		new ButtonTemplate({ textForLabel: "Scan", name: "scanner", }),
		new ButtonTemplate({ textForLabel: "Checkout", name: "checkout", }),
	]
});

let mainContainer = MainContainer();
mainContainer.add(buttons);
application.add(mainContainer);

application.behavior = new AppBehavior();