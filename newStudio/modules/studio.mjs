import testWidget from "./widget/testWidget.mjs";
import MainBar from "./widget/classes/testMainBar.mjs";

import StudioPhaser from "./phaserGame/phaserGame.mjs";
console.log("TESTPH", Phaser)
const config = {
    type: Phaser.WEBGL,
    parent: "gameContainer",
    pixelArt: true,
    backgroundColor: '#320822',
    disableContextMenu: true,
    scale:
    {
        mode: Phaser.Scale.NONE,
        //autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 256,
        height: 200,
        zoom: 3
    },
    // loader:
    // {
    //    baseURL: 'https://gist.githubusercontent.com/Trissolo/f8639b8123ec4288ef6ce36e2e7189e0/raw/f4094594cb869208cc150427eb101cc49908720b',
    //    crossOrigin: 'anonymous'
    // },
    input:
    {
        touch: false
    },
        
    scene: StudioPhaser
  }

window.game = new Phaser.Game(config)

const qqq = new testWidget();

const mainBar = new MainBar();
