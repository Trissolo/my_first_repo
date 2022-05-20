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
      //console.log(this.cache.json.get("room0data"))

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
          //console.log("Created:", thing)
          thing.setInteractive({cursor: 'url(assets_prod/cursors/over.cur), pointer'})
        }
      })
      
      this.ppGroup = this.add.group({createCallback: function (thing)
        {
          thing.setInteractive({cursor: 'url(assets_prod/cursors/over.cur), pointer', pixelPerfect: true})
        }
      })

      this.dsAry =[]

      this.player = this.add.sprite(0, 0, "atlas0", "robot_E_walk_0").setOrigin(0.5, 1)
      this.dsAry.push(this.player)

      this.input.on('pointermove', function(pointer) {this.player.x = pointer.worldX; this.player.y = pointer.worldY}, this)

      this.drawWithGroups()

      //press Q key for test
      this.input.keyboard.on('keydown-Q', this.pressedQ, this)

      //this.input.keyboard.on('keydown-O', () => { const obj = this.thingsGroup.children.entries[0]; console.log(obj.frame, obj.input.hitArea, obj.eventNames(), obj.listenerCount('pointerover'))}, this)
      /////////////////////////////


      //temp text
      this.text = this.add.bitmapText(8, 8, 'fontWhite', this.plugins.get('inGameManager').random).setDepth(10e9);

      //for deepthsort
      this.events.on('prerender', this.sortSprites, this)

    }// end create

    get roomData()
    {
      return this.cache.json.get(`room${this.actualRoomID}data`)
    }

    pressedQ()
    {
      //get actual Room
      this.actualRoomID ++
      if (this.actualRoomID > 1) { this.actualRoomID = 0 }

      //reset entities
      this.disableGroupChildren(this.ppGroup)

      //reset Deeptsort Ary
      this.dsAry.length = 0
      this.dsAry.push(this.player)

      //drawRoom
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

          //prepare coords:
          const [x, y] = thing.coords.split("_")
          
          //Get or create one group child
          //const roomThing = this.thingsGroup.get(+x, +y)
          const roomThing = this.ppGroup.get(+x, +y)
          .setTexture("atlas" + atlas, thing.frame || thing.frameStem + this.boolsManager.bitStatus(+thing.frameSuffix))
          .setActive(true)
          .setVisible(true)

          //deepthSorted is different!
          if(thing.depth === "ds")
          {
            roomThing.setOrigin(0.5, 1)
            this.dsAry.push(roomThing)
          }
          else
          {
            roomThing.setOrigin(0).setDepth(depthCategories[thing.depth])
          }

          //testing Foreground... 
          if(thing.depth === "fg")
          {
            roomThing.setDepth(depthCategories.fg)
          }

          //input!
          //console.log(roomThing.input)
          roomThing.hoverName = thing.hoverName
          //roomThing.input.hitArea.setSize(roomThing.width, roomThing.height)
          roomThing.setInteractive()
          if (!roomThing.listenerCount('pointerover'))
          {
            roomThing.on('pointerover', this.thingOvered)
            roomThing.on('pointerout', this.thingOut, this)
          }

        }
      } // end things loop
      
    }

    disableGroupChildren(group = this.thingsGroup)
    {
      group.children.iterate(function (thing)
      {
        group.killAndHide(thing)
        thing.disableInteractive()
          .off('pointerover', thing.scene.thingOvered)
          .off('pointerout', thing.scene.thingOut)
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

    } //end setBackGround


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
      if (this.dsAry.length)
      {
        for ( const element of this.dsAry.values())
        {
          element.setDepth(element.y)
        }
      }
    }

}//end class

export default Viewscreen
