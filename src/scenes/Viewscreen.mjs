import Phaser from 'phaser';

import depthCategories from '../constants/depthCategories.mjs'
import hoverNames from '../constants/hoverNames.mjs'

import TriggerAreaManager from './TriggerArea/TriggerAreaManager.mjs';
import RoomBackground from '../prefabs/roomBackground.mjs';

//mega test
import RoomScript from './RoomScripts/RoomScripts.mjs';

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
          backgroundColor: "#008777",
          height: 128
        }
      })
    } //end constructor

    init(passedObj)
    {
      //console.clear()
      console.log("Scene: %cViewscreen", "color:yellow;font-size: 1.2em;")

      //inject stuff
      this.plugins.get('inGameManager').installOn(this)

      //room to draw
      //console.log(this.cache.json.get("room0data"))

      // actual room ID: hmmm...
      // Do we really need the actualId property?
      // and HERE is the right place?
      this.actualRoomID = 1

      //input: cursor
      this.input.setDefaultCursor('url(assets_prod/cursors/cross.cur), pointer')


      //test clickable entities
      this.interactiveThings = new Map()

      //test conditions
      
        //0 "doorIsOpen", 
        //1 "wrenchTaken",
        //2 "crateIsOpen",
        //3 "cabinetIsOpen",
        //4 "cardBlueTaken",
        //5 "buttonIsPressed"
        
      this.boolsManager.set(2)
      this.boolsManager.clear(3)
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
     
      
      /////////////////////////////
      //testing Recycle using Group:

      // this.thingsGroup = this.add.group({createCallback: function (thing)
      //   {
      //     //console.log("Created:", thing)
      //     thing.setInteractive({cursor: 'url(assets_prod/cursors/over.cur), pointer'})
      //   }
      // })

      //the bg
      this.background = new RoomBackground(this)
      
      //room things
      this.ppGroup = this.add.group({createCallback: function (thing)
        {
          thing.setInteractive({cursor: 'url(assets_prod/cursors/over.cur), pointer', pixelPerfect: true})
        }
      })

      //room trigger areas
      this.triggerAreas = new TriggerAreaManager(this)

      //deepsorted gameObjects
      this.dsAry =[]

      //the player
      this.player = this.add.sprite(0, 0, "atlas0", "robot_E_walk_0").setOrigin(0.5, 1)
      this.dsAry.push(this.player)

      //temp text
      this.text = this.add.bitmapText(8, 8, 'fontWhite', this.plugins.get('inGameManager').random).setDepth(10e9);

      //update rs
      this.rs = this.igPlug.roomScripts.grab(this.actualRoomID)

      //for deepthsort
      this.events.on('prerender', this.sortSprites, this)


      this.drawWithGroups()


      // TEST! TEST! TEST! TEST!

      //press Q key for test
      this.input.keyboard.on('keydown-Q', this.pressedQ, this)

      this.input.keyboard.on('keydown-O', () => {this.interactiveThings.forEach(el => console.log(el)) })
      /////////////////////////////
      

      //this.input.on('pointermove', function(pointer) {this.player.x = pointer.worldX; this.player.y = pointer.worldY}, this)

    }// end create

    get roomData()
    {
      return this.cache.json.get(`room${this.actualRoomID}data`)
    }

    pressedQ()
    {
      // testing disabling and reenabling input
      this.input.enabled = false

      // SET actual Room
      this.actualRoomID++
      if (this.actualRoomID > 1) { this.actualRoomID = 0 }

      //get roomScripts!
      this.rs = this.igPlug.roomScripts.grab(this.actualRoomID)//this.roomScript.grab(this.actualRoomID)

      //interactiveThings Debug
      this.interactiveThings.clear()

   
      // Now Recylce!
      // reset entities: background...
      this.background.hide()

      // ...sprites...
      this.disableGroupChildren(this.ppGroup)

      // ...and trigger areas.
      this.triggerAreas.disableChildren()

      //reset Deeptsort Ary
      this.dsAry.length = 0
      this.dsAry.push(this.player)


      //drawRoom
      this.drawWithGroups()

      this.clearOutput()


      //test! test!


    }

    drawWithGroups()
    {
      const {atlas, background, things} = this.roomData

      this.background.revamp(atlas, background)

      // now room's things!
      console.log("Start drawing...")

      for (const thing of things)
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

        //do we have a Trigger Zones?
        if (thing.depth == "tz")
        {
          const tz = this.triggerAreas.get(thing)

          tz.zone.setName(thing.name)
        }
        else
        {

          //prepare coords:
          const [x, y] = thing.coords.split("_")
          
          //Get (or create) one group child

          // the constant 'name' is used to determine the name of the frame, and also the interaction function.
          const name = thing.frame || thing.frameStem

          const roomThing = this.ppGroup.get(+x, +y)
          .setTexture("atlas" + atlas, thing.frame || thing.frameStem + this.boolsManager.bitStatus(+thing.frameSuffix))
          .setActive(true)
          .setVisible(true)

          //interactive AS
          .setName(name)
          this.interactiveThings.set(name, roomThing)

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

          //Handle input:

          //set hover name and enable mouse hovering:

          roomThing.hoverName = thing.hoverName
 
          if (!roomThing.listenerCount('pointerover'))
          {
            roomThing.on('pointerover', this.thingOvered)
            roomThing.on('pointerout', this.thingOut, this)
          }

          //enable interactive!
          roomThing.setInteractive()

          // input mega test

            roomThing.on('pointerdown', this.rs[roomThing.name])//, this)


        }

      } // end things loop

      this.input.setPollAlways()
      
    }

    disableGroupChildren(group = this.thingsGroup)
    {
      group.children.iterate(function (thing)
      {
        group.killAndHide(thing)
        thing.disableInteractive()
          .off('pointerover', thing.scene.thingOvered)
          .off('pointerout', thing.scene.thingOut)
          .off('pointerdown')
      })
    } //end disableGroupChildren


    thingOvered(a)
    {
      this.scene.text.setText(hoverNames[this.hoverName])
    }

    thingOut()
    {
      this.text.setText("---")
    }

    clearOutput()
    {
      this.text.setText("- - -")
      this.input.setDefaultCursor('url(assets_prod/cursors/cross.cur), pointer')
      this.input.enabled = true
      // this.input.setPollRate(100)
      //testing disabling and reenabling input
      //this.input.setPollRate(-1)
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
