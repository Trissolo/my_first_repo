import {StudioGui} from "./htmlGui.mjs"
//import conditions from "../../src/constants/conditions.mjs";
//import r1Frames from "./byhand/r1_frame_names.mjs";

const roomsAmount = 2;

export default class Studio extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
      this.load.setBaseURL('./assets/')

      for (let i = 0; i < roomsAmount; i++)
      {
        this.load.json(`room${i}Data`, `room${i}_data.json`);

        this.load.atlas('atlas0', 'atlas0.png', 'atlas0.json');
      }

      //this.load.json('room1Data', './assets/room0_data.json');
      //this.load.json('room1Data', './assets/room1_data.json');
    }

    create ()
    {

        console.log("%cby Phaser:", "background-color: darkred; color: yellow", "Phaser Game Here!");
        
        //this.uff.manifest()
        //console.log("Instance:", this.uff )//this.studioInstance);
        //console.log("%cRooms:", "background-color: aqua; color: black", this.cache.json.get('room0Data'), this.cache.json.get('room1Data'))
        this.bg = this.add.image(0, 0, 'atlas0')
            .setOrigin(0)
            .setAlpha(0.8)

        this.dummy = this.add.image(0, 0, 'atlas0', 'vasca')
        
        this.zoneRect = this.add.rectangle(0,0,10,20, 0x3478ab).setOrigin(0)

        this.studio = new StudioGui(this.ourJson(), this)
        //this.rectangle = this.add.rectangle(0,0,10,20, 0x3478ab)
this.events.on('show', this.studioPreviewThing, this, this.dummy, this.studio)
        //this.events.on('show', this.studioPreviewThing, this.studio)
    }

    ourJson(val = 0)
    {
        console.log("%cJson entries:", "background-color:green", this.cache.json.getKeys(), roomsAmount)

        const res = []
          for (let i = 0, name; i < roomsAmount; i++)
          {
            name = `room${i}Data`
            res.push(this.cache.json.get(name))
            //this.load.json(`room${i}Data`, `room${i}_data.json`);
          }

        //const name = `room${val}Data`
        //return this.cache.json.get('room0Data')
        return res
    }

    studioPreviewThing()
    {
        //console.log("Called THIS:", this)
        //console.log("PREVIEW:", this.studio.actualRoom)
        const {bg, zoneRect, dummy} = this
        const thing = this.studio.actualThing
        bg.setFrame(this.studio.actualRoom.background)
        bg.setOrigin(0)
        if (thing.depth === "tz")
        {
            const [x, y, width, height] = thing.rect.split("_")
            zoneRect.setPosition(x, y)
              .setDisplaySize(width, height)
              .setVisible(true)

            dummy.setVisible(false)

        }

        else
        {
            dummy.setPosition(...thing.coords.split("_"))
              .setFrame(thing.frame? thing.frame : thing.frameStem + 1)//(Math.random()>.5? 0: 1))//thing.frameSuffix)
              .setVisible(true)

            zoneRect.setVisible(false)

            if (thing.depth === "ds")
            {
                dummy.setOrigin(0.5, 1)
            }
            else
            {
                dummy.setOrigin(0)
            }
        }

    }

}
