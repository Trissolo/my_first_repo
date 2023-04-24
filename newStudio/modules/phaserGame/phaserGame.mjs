import studioEvents from "../eventEmitter/StudioEvents.mjs";

import DepthCategories from "../jsonManager/DepthCategories.mjs";

import roomsAmount from "../jsonManager/roomsAmount.mjs";

import JsonManager from "../jsonManager/JsonManager.mjs";


// test AllVarsManager
import AllVarsManager from "../../../src/plugins/VarsManager/AllVarsManager.mjs";

// Texture management stuff:
const ROOM_TEXTURE_ATLAS_PREFIX = 'atlas';

const getCurrentRoomAtlasKey = (atlasSuffix = JsonManager.currentJson.atlas) => ROOM_TEXTURE_ATLAS_PREFIX + atlasSuffix;

export default class StudioPhaser extends Phaser.Scene
{
    constructor ()
    {
        super();

        // testing
        this.varsManager = AllVarsManager;

        this.varsManager.initialize();

        //remove from here...
        // console.log("varsManager", AllVarsManager);

        // const kind = 3;

        // const varHolder = this.varsManager.varContainers.get(kind);

        // const tyarray = varHolder.typedArray;

        // tyarray[0] = 500278;
        // tyarray[1] = 3021292394;

        // // AllVarsManager.clearContiguous(0, 0, varHolder.varSize, varHolder.bitmask, tyarray);

        // // console.log(tyarray[0], "Calling...");
        // const iterateTest = (max = varHolder.varsPerElement * tyarray.length) => {
        //     for (let i = 0; i < max ; i++)
        //     {
        //         const res = AllVarsManager.betterReadVar(kind, i);
        //         // const res = AllVarsManager.readVar(kind, i);
        //         console.log(`${i}) (Better) ${res.toString(2).padStart(varHolder.varSize, "0")}`)
        //     }
        // }
        
        // iterateTest(3);
        // // AllVarsManager.varContainers.forEach((el, i) => console.dir(i,el));
        // console.log("%cSET VARIABLE:", "color: darkbrown; background-color: maroon;");
        // let editVarIdx = 0;
        
        // // console.log(editVarIdx, AllVarsManager.setVar(kind, editVarIdx, 15));
        // console.log(AllVarsManager.betterReadVar(kind, editVarIdx));
        
        // let altroValore = 1;
        // console.log(`Now set ${altroValore}!`);
        // AllVarsManager.betterSetVar(kind, editVarIdx, altroValore)
        // console.log(AllVarsManager.betterReadVar(kind, editVarIdx));
        // iterateTest(3);

        // altroValore = 2;
        // console.log(`Now set ${altroValore}!`);
        // AllVarsManager.betterSetVar(kind, editVarIdx, altroValore)
        // console.log(AllVarsManager.betterReadVar(kind, editVarIdx));
        // iterateTest(3);

        // altroValore = 0;
        // console.log(`Now set ${altroValore}!`);
        // AllVarsManager.betterSetVar(kind, editVarIdx, altroValore)
        // console.log(AllVarsManager.betterReadVar(kind, editVarIdx));
        // iterateTest(3);



        // editVarIdx = 4;
        // console.log(editVarIdx, AllVarsManager.setVar(kind, editVarIdx, 15));
        
        

        // console.log("Test: set to '0'");
        // for (let i = 0; i < varHolder.varsPerElement * tyarray.length; i++)
        // {
        //     this.varsManager.setVar(kind, i, 0);
        // }
        
        // console.log("toggle");

        // for (let i = 60; i < 64; i++)
        // {
        //     this.varsManager.toggleBit(i);
        //     console.log(`${i}) Toggled`, this.varsManager.readVar(kind, i));

        //     this.varsManager.toggleBit(i);
        //     console.log(`${i}) Toggled`, this.varsManager.readVar(kind, i));


        // }

        // for (let i = 60; i < 64; i++)
        // {
        //     console.log(`${i}) Read now:`, this.varsManager.readVar(kind, i));
        // }

        // iterateTest();
        // ... to here!
    }

    preload ()
    {
        this.load.setBaseURL('./game_assets/'); // futureFrames');

        // to be removed -> "- 1"
        for (let i = 0; i < roomsAmount - 1; i++)
        {
            this.load.atlas(getCurrentRoomAtlasKey(i), `/newAtlas${i}.png`, `/newAtlas${i}.json`);
        }
    }

    create()
    {

        this.thingsGroup = this.add.group(); // {createCallback: function (thing)
        //     {
        //       //thing.setInteractive({cursor: 'url(assets_prod/cursors/over.cur), pointer', pixelPerfect: true})
        //     }
        //   });

        this.roomBg =  this.add.image(0,0).setOrigin(0).setAlpha(0.8).setVisible(false);

        this.activeThing = this.add.image().setDepth(801);

        this.activeArea = this.add.rectangle(0, 0, 1, 1, 0xffff66).setDepth(801).setOrigin(0).setVisible(false);

        
        studioEvents.emitter.on(studioEvents.events.thingChanged, this.setActiveThing, this);
        
        studioEvents.emitter.on(studioEvents.events.roomChanged, this.setupCurrentRoom, this);
        
        this.setupCurrentRoom();

        //debug remove from here to the end of this function
        // console.log("Studio Event Emitter");
        // const ascaz = studioEvents.events.thingChanged
        // console.log(`Events for ${ascaz}`);

        // console.log(studioEvents.emitter.listeners(ascaz));
    }

    setBackground()
    {
        this.roomBg
            .setTexture(this.atlasKey, JsonManager.currentJson.background)
            .setOrigin(0)
            .setVisible(true);

    }

    drawRoom()
    {

        this.setBackground();

        this.disableGroupChildren();

        for (const thing of JsonManager.things)
        {
            if (thing.depth !== 'ta')
            {
                this.activeArea.setVisible(false);

                const roomThing = this.thingsGroup.get(thing.x, thing.y)
                    .setTexture(this.atlasKey, thing.frame)
                    .setActive(true)
                    .setVisible(true)
                    .setAlpha(0.4)
                    .setDepth(DepthCategories[thing.depth]);

                    if (thing.depth === "ds")
                    {
                        roomThing.setOrigin(0.5, 1);
                    }
                    else
                    {
                        roomThing.setOrigin(0);
                    }

            }

        }

        this.setActiveThing();

    }

    disableGroupChildren(group = this.thingsGroup)
    {
      group.children.iterate(function (thing)
      {
          // group.killAndHide(thing)
          // thing.disableInteractive()
          thing
          .setActive(false)
          .setVisible(false)
        //   .off('pointerover')//, thing.scene.thingOvered)
        //   .off('pointerout')//, thing.scene.thingOut)
        //   .off('pointerdown')
      });
    }

    setActiveThing()
    {
        const {currentThing} = JsonManager;

        if  (currentThing.depth === 'ta')
        {
            this.activeThing.setVisible(false);

            this.activeArea
                    .setVisible(true)
                    .setPosition(currentThing.x, currentThing.y)
                    .setScale(currentThing.width, currentThing.height);
        }
        else
        {
            this.activeThing
            .setTexture(this.atlasKey, currentThing.frame)
            .setPosition(currentThing.x, currentThing.y)
            .setOrigin(currentThing.depth === "ds"? (1, 0.5) : 0)
            .setVisible(true);

            if (currentThing.depth === "ds")
            {
                this.activeThing.setOrigin(0.5, 1);
            }
            else
            {
                this.activeThing.setOrigin(0);
            }

            this.activeArea.setVisible(false);

        }

    }

    setupCurrentRoom()
    {
        this.determineAtlas();

        this.drawRoom();
    }

    determineAtlas()
    {
        this.atlasKey = getCurrentRoomAtlasKey();

        this.frameNames = this.textures.get(this.atlasKey)
            .getFrameNames()
            .sort();

        console.log("atlasKey is:", this.atlasKey);

        console.dir(this.frameNames);

    }
}
