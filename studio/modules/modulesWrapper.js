//import conditions from "./byhand/conditions.js";
//import r1Frames from "./byhand/r1_frame_names.js";

import Studio from "/studio/modules/phasergame.js"
//import {StudioGui} from "/modules/htmlGui.js"

//for Phaser
const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.NONE,
        parent: 'gamediv',
        width: 256,
        height: 128,
        zoom: 2
    },

    backgroundColor: '#2d2d2d',
    scene: [ Studio ]
};

//main

window.game = new Phaser.Game(config)

console.log("%c modulesWrapper.js: ", "background-color: blue; color: cyan;", "running!")

