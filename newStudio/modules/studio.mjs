import WidgetHoverNames from "./widget/studiowidgets/WidgetHoverNames.mjs";

import WidgetFrameSuffix from "./widget/studiowidgets/WidgetFrameSuffix.mjs";

import WidgetSkipCondition from "./widget/studiowidgets/skipCondition/WidgetSkip.mjs";


import MainBar from "./widget/studiowidgets/testMainBar.mjs";

import StudioPhaser from "./phaserGame/phaserGame.mjs";

import studioEvents from "./eventEmitter/StudioEvents.mjs";

import JsonManager from "./jsonManager/JsonManager.mjs";

import THINGS_PROPS from "./autocomplete/THINGS_PROPS.mjs";

import studioDatalist from "./widget/classes/studioDatalist.mjs";

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

// const qqq = new WidgetHoverNames(THINGS_PROPS.HOVER_NAME);


class StudioMaybe
{
    // Not needed, but...
    jsonManager = JsonManager;

    studioDatalist = studioDatalist;

    mainBar = new MainBar();

    // Necessary :D
    studioWidgets = new Set();

    constructor()
    {
        // test OhHoverNames dfatalist
        this.studioDatalist.initialize();

        // Manually create our widgets

        this.studioWidgets.add( new WidgetHoverNames(THINGS_PROPS.HOVER_NAME) );
        
        this.studioWidgets.add( new WidgetFrameSuffix(THINGS_PROPS.FRAME_SUFFIX));

        this.studioWidgets.add( new WidgetSkipCondition(THINGS_PROPS.SKIP_CONDITION));

        this.registerListeners();
    }

    registerListeners()
    {
        // same behavior for both 'roomChanged' and 'thingChanged':

        studioEvents.emitter.on(studioEvents.events.thingChanged, this.thingChangedListener, this);

        studioEvents.emitter.on(studioEvents.events.roomChanged, this.thingChangedListener, this);

    }

    refreshAnyWidget()
    {
        for (const widget of this.studioWidgets)
        {

            widget.refresh();

        }
    }

    thingChangedListener()
    {

        this.refreshAnyWidget();

        this.jsonManager.showThing();

    }


} // end StudioMaybe Class def

new StudioMaybe();

studioEvents.emitter.emit(studioEvents.events.thingChanged);
