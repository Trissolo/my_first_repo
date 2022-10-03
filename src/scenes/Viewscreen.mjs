import Phaser from 'phaser';

import depthCategories from '../constants/depthCategories.mjs';
import hoverNames from '../constants/hoverNames.mjs';

import PMStroll from "../PolyMapStroll/PMStroll.js"

import TriggerAreaManager from './TriggerArea/TriggerAreaManager.mjs';
import TriggerAreaEvents from './TriggerArea/TriggerAreaEvents.mjs';

import RoomBackground from '../prefabs/roomBackground.mjs';

import BBmText from '../prefabs/BBmText.mjs';

import Player from '../prefabs/Player.mjs';

import Shield from '../prefabs/Shield.mjs';

// import ScriptedActions from '../plugins/ScriptedActions.mjs';

// import RotationHelper from './RotationHelper/RotationHelper.mjs';

import { ViewscreenEvents } from './ViewscreenEvents.mjs';

import {GenericEvents} from '../scenes/GenericEvents.mjs'


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

      //inject igPlug stuff in this scene
      this.plugins.get('inGameManager').installOn(this)

      //input: cursor
      this.input.setDefaultCursor('url(assets_prod/cursors/cross.cur), pointer')

      //PolyMapStroll
      this.pmsManager = new PMStroll(this, true)
      
      this.buildFloors(this.cache.json.get('floors'))


      //test clickable entities
      this.interactiveThings = new Map()

      //test conditions
      
        //0 "doorIsOpen", 
        //1 "wrenchTaken",
        //2 "crateIsOpen",
        //3 "cabinetIsOpen",
        //4 "cardBlueTaken",
        //5 "buttonIsPressed"
        
      //this.boolsManager.set(1)
      this.boolsManager.set(2)
      this.boolsManager.clear(3)
      this.boolsManager.clear(4)

    }

    create()
    {
      //Poly Map Stroll
      this.floors = []

      //this.rotationHelper = new RotationHelper(this)
	
      //actionManager


      //Shield!
       this.shield = new Shield(this)


      //the bg. Also click detector
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

      //Actors (aka players?)
      this.robot = new Player(this, "robot")

      this.greenGuy = new Player(this, "greenGuy")

      //the player
      this.player = this.greenGuy

      //this.dsAry.push(this.player)

      

      // most likely, we also need some blank, generic, all-encompassing movable sprites; and also a timerEvent



      //temp text
      this.text = new BBmText(this, "QWER") //this.add.bitmapText(8, 8, 'fontWhite', this.plugins.get('inGameManager').random).setDepth(10e9);

      //current room script
      this.rs = null //this.igPlug.roomScripts.grab(this.actualRoomID)

      //for deepthsort
      this.events.on('prerender', this.sortSprites, this)

      // console.log(this.text, "TEXT!!!!")
      // this.events.on('prerender', this.showDescription, this.text)


      // TEST! TEST! TEST! TEST!

      //press Q key for test

      // test starting room
      this.quickChangeRoom(0, 140, 65, "SW", "fl00")
      this.drawRoom()


      /////////////////////////////
      // this.input.keyboard.on('keydown-O', () => {this.triggerAreas.stopRectChecking();this.interactiveThings.forEach(el => console.log(el)); this.triggerAreas.children.forEach(el => console.log(el)) })
      //
      //this.input.on('pointermove', function(pointer) {this.player.x = pointer.worldX; this.player.y = pointer.worldY}, this)
      /////////////////////////////
      


    }// end create

    // active inventory Item
    // Maybe this getter must be installed by the igPlug...
    get item()
    {
      return this.igPlug.activeInventoryItem
    }


    // getter to take the right room configuration
    get roomData()
    {
      return this.cache.json.get(`room${this.actualRoomID}data`)
    }

    get actualRoomID()
    {
      return this.igPlug.pendingRoom.id
    }

    // hmmm: by this time this setActualRoom method is weird:
    setActualRoom(roomId = 0)
    {
      // test:
      // this.igPlug.setPendingRoomId(roomId) //actualRoomID=1//++

      // this.actualRoomID++
      
      // if (this.actualRoomID > 1) { this.actualRoomID = 0 }
      
      // end test

      // real code:

      // this.actualRoomID = roomId

      // get roomScripts!
      this.rs = this.igPlug.roomScripts.grab(this.actualRoomID)
    }
    

    clearRoom()
    {
      //stop checking rects
      this.triggerAreas.stopRectChecking()

      // testing disabling and reenabling input
      this.input.enabled = false

      // Now Recylce!
      // reset entities: background (1/6)...
      this.background.hide()
      
      // ...sprites(2/6)...
      this.disableGroupChildren(this.ppGroup)
      
      // ...and trigger areas(3/6).
      this.triggerAreas.disableChildren()
      
      //reset Deepthsort Array(4/6);
      this.dsAry.length = 0
      
      // reset player/actors (5/6);
      this.player.hide()
    
      // reset floors
      this.resetRoomFloors()
      // this.floors.length = 0
      // this.igPlug.pendingRoom.playerFloor = null

      // interactiveThings(6/6). Debug
      this.interactiveThings.clear()

      // 'onClearRoom' event
      // Add something like this.igPlug.emit("onClearRoom", this)
      this.igEvents.emit(ViewscreenEvents.ROOM_CLEARED, this)

    } //end clearRoom


    produceActualRoom()
    {
      //console.dir(this.roomData)
      const {atlas, background, things} = this.roomData

      this.background.revamp(atlas, background)

      this.grabFloors()
      // console.log("Floors grabbed:", this.floors)

      // now room's things!
      // console.log("Start drawing...")

      for (const thing of things)
      {

        //first of all check for skipCondition!
        if ( thing.skipCond && this.boolsManager.boolCondIsSatisfied(thing.skipCond) )
        {
          continue
        }

        // do we have a Trigger Zones?
        if (thing.depth === "tz")
        {
          const tz = this.triggerAreas.get(thing)

          tz.setName(thing.name)

          tz.checkRect = true

          // MONSTROUSLY HARDCODED: A REFACTOR OF THE SCHEMA IS ABSOLUTELY NECESSARY!
          tz.on(TriggerAreaEvents.TRIGGERED, this.rs[thing.name], this)//('entertriggerarea', this.rs[thing.name], this)

          if (this.rs[thing.name + "leave"])
          {
            tz.on(TriggerAreaEvents.DISENGAGED, this.rs[thing.name + "leave"], this)//'leavetriggerarea', this.rs[thing.name + "leave"], this)
          }

        }
        else
        {

          // prepare coords:
          const [x, y] = thing.coords.split("_")         
          
          // the constant 'name' is used to determine the name of the frame, and also the interaction function.
          const name = thing.frame || thing.frameStem
          
          // Get (or create) one group child
          const roomThing = this.ppGroup.get(+x, +y)
            .setTexture("atlas" + atlas, thing.frame || thing.frameStem + this.boolsManager.bitStatus(+thing.frameSuffix))
            .setActive(true)
            .setVisible(true)

          // keep track of all interactive objects
          .setName(name)
          this.interactiveThings.set(name, roomThing)

          // deepthSorted is different!
          if (thing.depth === "ds")
          {
            roomThing.setOrigin(0.5, 1)
            this.dsAry.push(roomThing)
          }
          else
          {
            roomThing.setOrigin(0)
              .setDepth(depthCategories[thing.depth])
          }


          //Handle input:

          if (thing.noInput)
          {
            //  this oddity/quirk is mandatory until the Triggerarea Class is refactorized
            // if (roomThing.input)
            // {
              roomThing.disableInteractive()
            // }

            continue
          }

          // set hover name and enable mouse hovering:
          roomThing.hoverName = thing.hoverName
 
          // if (!roomThing.listenerCount('pointerover'))
          // {
            roomThing.on('pointerover', this.thingOvered)
            roomThing.on('pointerout', this.thingOut, this)
          // }

          //enable interactive!
          roomThing.setInteractive()

          // input mega test

          roomThing.on('pointerdown', this.rs[roomThing.name])

        }

      } // end things loop
    
      //the floors:

      // this.grabFloors()

      //all room things are ready, so:
      this.igEvents.emit(ViewscreenEvents.ROOM_THINGS_SET, this, this.interactiveThings)

    }

    // Gross: it must be rewritten at all costs!
    grabFloors()
    {
      const {floors} = this.cache.custom

      for (const floorName of floors.getKeys())
      {
        // console.log("Considering:", 'fl'+ ("" + this.roomData.id).padStart(2, '0'), floorName)
        if (floorName.startsWith('fl'+ ("" + this.roomData.id).padStart(2, '0') ))
        {
          // console.log("Passed:", floorName)

          this.floors.push(floors.get(floorName))
        }
      }
      //this.floor.
      //  console.log("Our floors:", this.floors)
    }

    disableGroupChildren(group = this.thingsGroup)
    {
      group.children.iterate(function (thing)
      {
        // group.killAndHide(thing)
        thing.disableInteractive()
          .setActive(false)
          .setVisible(false)
          .off('pointerover')//, thing.scene.thingOvered)
          .off('pointerout')//, thing.scene.thingOut)
          .off('pointerdown')
      })
    } //end disableGroupChildren


    thingOvered(a)
    {
      // console.log("OVER", this, this.name)
      this.scene.text.setText(hoverNames[this.hoverName])
      this.scene.text.setVisible(true)
    }

    thingOut()
    {
      // this.text.setText("---")
      this.text.setVisible()
    }

    // moveToClick(pointer, relX, relY)
    // {
    //   //  console.log(pointer, relX, relY, this)

    //   const path = this.pmsManager.generatePath(this.player, {x: pointer.worldX, y: pointer.worldY}, this.player.floor)
        
    //   this.player.walk.setPath(path)
    //   //this.player.walk.setPath({x: pointer.worldX, y: pointer.worldY})
    // }

    allowUserInteraction()
    {
      this.text.setText("- - -")

      //  set starting condition for all rects
      this.triggerAreas.initializeRects()

      this.triggerAreas.startRectChecking()

      this.input.enabled = true

      this.shield.lower()

      // to be implemented:
      // this.shield.hide()
    }

    sortSprites(a,b,c,d)
    {
      if (this.dsAry.length)
      {
        for ( const element of this.dsAry.values())
        {
          element.setDepth(element.y)
        }
      }

      //console.dir(a,b,c,d)
      this.text.showDescription.call(this.text, this.input.activePointer)
    }

    drawRoom(roomId)
    {
      this.shield.raise()

      this.clearRoom()

      this.setActualRoom(roomId)

      this.produceActualRoom()

      this.handlePlayer()

      //quick test: onEnterRoom in room script
      if (this.rs.onStart)
      {
        this.rs.onStart.call(this)
      }

      this.allowUserInteraction()
    }

    handlePlayer()
    {
      this.dsAry.push(this.player)
      this.player.place()
        .show()
        .setFloor();
    }

    quickChangeRoom(roomNum = 0, playerX, playerY, facing, floorID = null)
    {
      this.igPlug.resetPending()

      this.igPlug.setPendingRoomId(roomNum)

      if (typeof playerX === "number" )
      {
        this.igPlug.setPendingRoomPlayerX(playerX)
      }

      if (typeof playerY === "number")
      {
        this.igPlug.setPendingRoomPlayerY(playerY)
      }

      if (typeof facing === "string")
      {
        this.igPlug.setPendingRoomFacingDir(facing)
      }

      //hmmm playerFloor...
      if (floorID)
      {
        this.igPlug.setPendingRoomPlayerFloor(floorID)
      }
      // else
      // {
      //   console.log("------------------------------------------quickChangeRoom skips floor pl")
      // }


      // else
      // {
      //   this.igPlug.setPendingRoomPlayerFloor("fl0" + this.igPlug.pendingRoom.id)
      // }


      // must call drawRoom here? i.e.
      // this.drawRoom()

    } // end quickChangeRoom

    buildFloors(aryFloors)
    {
      for (const floorData of aryFloors)
      {
        // console.log(floorData.nome, floorData.coords)
        // console.log("NewFl", this.pmsManager.buildSinglePolyMap(floorData))
        this.cache.custom.floors.add(floorData.nome, this.pmsManager.buildSinglePolyMap(floorData, floorData.nome))
      }

      console.log(this.cache.custom.floors)
    }

    resetRoomFloors()
    {
      this.floors.length = 0
      this.igPlug.pendingRoom.playerFloor = null

      
    }

    toggleFrameAndBool(gameObject, boolID)
    {
      if (Array.isArray(gameObject))
      {
        [ gameObject, boolID ] = gameObject
      }
      // const frameSuffix =  gameObject.frame.name.substring(0, gameObject.frame.name.length - 1);
      gameObject.setFrame(gameObject.frame.name.substring(0, gameObject.frame.name.length - 1) + gameObject.scene.boolsManager.toggle(boolID))
      gameObject.emit(GenericEvents.TOGGLE_FRAME_AND_BOOL, gameObject, boolID)
    }

    setGameObjectFrame(gameObject, frameName)
    {
      if (Array.isArray(gameObject))
      {
        [gameObject, frameName] = gameObject
      }

      gameObject.setFrame(frameName, false, false)

      gameObject.emit(GenericEvents.SPRITE_SET_FRAME, gameObject)
    }

    hideAndSetBool(gameObject, boolID, value = 1)
    {
      if (Array.isArray(gameObject))
      {
        [gameObject, boolID = undefined, value = 1] = gameObject
      }
      
      console.log(gameObject.frame.name, "hiding")

      gameObject.setVisible(false)
      gameObject.setActive(false)

      if (boolID !== undefined)
      {
        if (value)
        {
          gameObject.scene.igPlug.boolsManager.set(boolID)
        }
        else
        {
          gameObject.scene.igPlug.boolsManager.clear(boolID)
        }
      }

      gameObject.emit(GenericEvents.SPRITE_HIDE, gameObject, boolID)
    }

    checkActiveItem(wantedId)
    {
      return this.item && this.item.state === wantedId
    }

    scriptedAction(actionsArray)
    {
      this.igPlug.scrActions.add(actionsArray)
      this.igPlug.scrActions.execute()
    }

}//end class

export default Viewscreen
