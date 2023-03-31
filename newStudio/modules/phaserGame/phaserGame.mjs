import studioEvents from "../eventEmitter/StudioEvents.mjs";

import DepthCategories from "../jsonManager/DepthCategories.mjs";

import roomsAmount from "../jsonManager/roomsAmount.mjs";

import JsonManager from "../jsonManager/JsonManager.mjs";


const ROOM_TEXTURE_ATLAS_PREFIX = 'atlas';
const getCurrentRoomAtlasKey = (atlasSuffix = JsonManager.currentJson.atlas) => ROOM_TEXTURE_ATLAS_PREFIX + atlasSuffix;

export default class StudioPhaser extends Phaser.Scene
{
    constructor ()
    {
        super();
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
        
        studioEvents.emitter.on(studioEvents.events.roomChanged, this.drawRoom, this);
        
        this.drawRoom();
    }

    setBackground()
    {
        this.roomBg
            .setTexture(getCurrentRoomAtlasKey(), JsonManager.currentJson.background)
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
                    .setTexture(getCurrentRoomAtlasKey(), thing.frame)
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
            .setTexture(getCurrentRoomAtlasKey(), currentThing.frame)
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
}
