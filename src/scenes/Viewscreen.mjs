import Phaser from 'phaser';

import depthCategories from '../constants/depthCategories.mjs'
import hoverNames from '../constants/hoverNames.mjs'

class Viewscreen extends Phaser.Scene
{
    constructor()
    {
      super(
      {
        key: 'Viewscreen',
        active: false,
        visible: false,
        plugins: [
          'Clock',  //this.time
          //'DataManagerPlugin',  //this.data
          'InputPlugin'//,  //this.input
          //'Loader',  //this.load
          //'TweenManager',  //this.tweens
          //'LightsPlugin'  //this.lights
          ],
        cameras:
        {
          backgroundColor: "#008777"//,
          //height: 100
        }
      })
    } //end constructor

    init(passedObj)
    {
      //console.clear()
      console.log("Scene: %cViewscreen", "color:yellow;font-size: 1.2em;")

      //inject stuff
      this.plugins.get('inGameManager').setupBoolsManager(this)

      //room to draw
      console.log(this.cache.json.get("room0data"))

      this.actualRoomID = 1

      //now is a getter
      //this.roomData = this.cache.json.get(`room${this.actualRoomID}data`)

      this.input.setDefaultCursor('url(assets_prod/cursors/cross.cur), pointer')

      //test conditions
      
        //0 "doorIsOpen", 
        //1 "wrenchTaken",
        //2 "crateIsOpen",
        //3 "cabinetIsOpen",
        //4 "cardBlueTaken",
        //5 "buttonIsPressed"
        
      this.boolsManager.set(2)
      this.boolsManager.set(3)
      this.boolsManager.clear(4)
    }

    create()
    {
      //walkManager
	
      //actionManager

      //ClickDetector! --MUST stopPropagation!--
      // this.clickDetector = new ClickDetector(this)

      //groups as layers
      // this. this.add

      //set of ALL interactive objects in this scene
      // this.allInteractive = new Set()

      //Shield!
      // this.shield

      // this.coGroup = this.add.layer()
      // this.abGroup = this.add.layer()
      // this.dsGroup = this.add.layer()
      // this.fgGroup = this.add.layer()

      /////////////////////////////
      // WORKS, BUT DO NOT RECYCLE
      // this.ary = []
      //
      // this.drawScene()
      /////////////////////////////
     
      
      /////////////////////////////
      //testing Recycle using Group:
      this.thingsGroup = this.add.group({createCallback: function (thing)
        {
          console.log("Created:", thing)
          thing.setInteractive({cursor: 'url(assets_prod/cursors/over.cur), pointer'})
        }
      })
      this.addPpGroup = this.add.group()

      this.drawWithGroups()

      //press Q key for test
      this.input.keyboard.on('keydown-Q', this.pressedQ, this)

      this.input.keyboard.on('keydown-O', () => { const obj = this.thingsGroup.children.entries[0]; console.log(obj.frame, obj.input.hitArea, obj.eventNames(), obj.listenerCount('pointerover'))}, this)
      /////////////////////////////


      //temp text
      this.text = this.add.bitmapText(8, 8, 'fontWhite', this.plugins.get('inGameManager').random).setDepth(10e9);

      //for deepthsort
      //this.events.once('prerender', this.sortSprites, this)

      //this.input.on('pointerdown', () => console.log(Math.random()))

    }// end create

    get roomData()
    {
      return this.cache.json.get(`room${this.actualRoomID}data`)
    }

    pressedQ()
    {
      this.actualRoomID ++
      if (this.actualRoomID > 1) { this.actualRoomID = 0 }

      this.disableGroupChildren()

      this.drawWithGroups()

    }

    drawWithGroups()
    {
      const {atlas, background, things} = this.roomData

      this.setBackGround(atlas, background)

      // now room's things!
      console.log("Start drawing...")

      for (const thing of things)
      {
        //avoid all Trigger Zones!
        if (thing.depth !== "tz")
        {
          //first of all check for skipCondition!
          if (thing.skipCond)
          {
            const [varType, index, expected] = thing.skipCond.split("_")
            if (this.boolsManager.bitStatus(+index) === +expected)
            {
              continue
            }
          }

          //get or create one groupMember

          const [x, y] = thing.coords.split("_")

          const roomThing = this.thingsGroup.get(+x, +y)
          .setTexture("atlas" + atlas, thing.frame || thing.frameStem + this.boolsManager.bitStatus(+thing.frameSuffix))
          //.setFrame(thing.frame || thing.frameStem + this.boolsManager.bitStatus(+thing.frameSuffix))
          .setActive(true)
          .setVisible(true)

          //deepthSorted is different!
          if(thing.depth === "ds")
          {
            roomThing.setOrigin(0.5, 1)
          }
          else
          {
            roomThing.setOrigin(0).setDepth(depthCategories[thing.depth])
          }

          //input!
          console.log(roomThing.input)
          roomThing.hoverName = thing.hoverName
          roomThing.input.hitArea.setSize(roomThing.width, roomThing.height)
          roomThing.setInteractive()
          // if (!roomThing.listenerCount('pointerover'))
          // {
            roomThing.on('pointerover', this.thingOvered)
            roomThing.on('pointerout', this.thingOut, this)
          // }

        }
      } // end things loop
      
    }

    disableGroupChildren(group = this.thingsGroup)
    {
      group.children.iterate(function (thing)
      {
        group.killAndHide(thing)
        //console.log(thing.input)
        thing.disableInteractive()
        thing.off('pointerover', thing.scene.thingOvered)
        thing.off('pointerout', thing.scene.thingOut)
      })
    } //end disableGroupChildren

    setBackGround(atlasNum, frame)
    {
      //caveat for bg
      if (this.background)
      {
        this.background
          .setTexture("atlas" + atlasNum)
          .setFrame(frame)
          .setOrigin(0)
          .setDepth(depthCategories.bg)
      }
      else
      {
        this.background = this.add.image(0, 0, "atlas" + atlasNum, frame)
          .setOrigin(0)
          .setDepth(depthCategories.bg)
      }

      console.log(this.children)
    } //end setBackGround

    drawScene()
    {
      const {atlas, background, things} = this.roomData
      this.background = this.add.image(0, 0, "atlas" + atlas, background)
        .setOrigin(0)
        .setDepth(depthCategories.bg)

        console.log("Building...", this.input)

         for (const thing of things)
         {

          if (thing.depth !== "tz")
          {
            //console.log(thing)
            
            if (thing.skipCond)
            {
              const [varType, index, expected] = thing.skipCond.split("_")
              if (this.boolsManager.bitStatus(+index) === +expected)
              {
                //console.log("Skipping:", thing.frame || thing.frameStem)
                continue
              }
            }

            const [x,y] = thing.coords.split("_")
            const elem = this.add.sprite(+x, +y, "atlas" + atlas, thing.frame || thing.frameStem + this.boolsManager.bitStatus(thing.frameSuffix))       


            if(thing.depth === "ds")
            {
              elem.setOrigin(0.5, 1)
            }

            else
            {
              elem.setOrigin(0)
                .setDepth(depthCategories[thing.depth])
            }

            elem.hoverName = thing.hoverName
            
            // if (thing.frame)
            // {
            //   elem.setInteractive({ cursor: 'url(assets_prod/cursors/over.cur), pointer' })
            // }
            // else
            // {
              elem.setInteractive({ cursor: 'url(assets_prod/cursors/over.cur), pointer', pixelPerfect: true })
            // }
            elem.on('pointerover', this.thingOvered)
            elem.on('pointerout', this.thingOut, this)

            //elem.setAlpha(.4)

            //this.input.enableDebug(elem)
            //elem.input.hitAreaDebug.setDepth(elem.depth + 1)

            //this[thing.depth + "Group"].add(elem)
            this.ary.push(elem)

            
          }

       }
      
      
    } //end drawScene

    thingOvered(a)
    {
      this.scene.text.setText(hoverNames[this.hoverName])
    }

    thingOut()
    {
      this.text.setText("---")
    }

    sortSprites()
    {
      //console.log([...this.dsGroup.getChildren()])
    }

}//end class

export default Viewscreen