import Phaser from 'phaser'

import WalkComponent from './walkComponent/walkComponent.mjs'
import WalkEvents from './walkComponent/walkEvents.mjs'

import SEPARATOR from '../constants/SEPARATOR.mjs'

import RotationHelper from '../scenes/RotationHelper/RotationHelper.mjs'
import { RotationHelperEvents } from '../scenes/RotationHelper/RotationHelperEvents.mjs'

import { GenericEvents } from '../scenes/GenericEvents.mjs'

import ChainedActions from './ChainedActionsComponent/ChainedActions.mjs'

// To be usable, each instance:

// must be active and visible,
// must have the 'x,' 'y' and 'room' properties set,
// must have one own floor.
// And Trigger Areas must have it as an effectuator.

// a 'costume' property, that can be different form 'name' property, is better
// a facing direction set


// methods are needed to get sprite information from frameName
export default class Player extends Phaser.GameObjects.Sprite
{
  constructor(scene, name = "robot", textureId = 0)
  {
    super(scene, 0, 0, 'atlasChars', 'atlas') //+ textureId, "__DEFAULT")

    this.addToDisplayList()
    
    // just a raw test:
    this.setName(name)

    this.walk = new WalkComponent(this)

    this.actions = new ChainedActions(this)

    this.hide()

    //the polygonal Map in which this actor can currently move
    this.floor = null

    //this.setWalkEventsFacing() // setJustWalk()

    this.setWalkEventsRotateBefore()

    //testing rotationComplete event
    this.on(RotationHelperEvents.RotationComplete, () => console.log("Actor: 'rotationcomplete' emitted! ;)"))

    // object containing all info about this Actor position
    this.locationData = {}
  }

  hide()
  {
    this.setActive(false)
      .setVisible(false)

    // console.log("PL WALK", this.walk)
    this.walk.setIdle()
    this.anims.stop()

    this.floor = null
    
    return this
  }

  
  // texture:

  // actorName_
  // CardinalDirection_
  // action_
  // frameNumber

  show()
  {
    this.setActive(true)
    .setVisible(true);

    // console.log("TEST FAC DIR", this.scene.igPlug.pendingRoom.facingDir)
    if (this.scene.igPlug.pendingRoom.facingDir)
    {
      const assembledFrameName = this.name + SEPARATOR + this.scene.igPlug.pendingRoom.facingDir + "_walk_0"

      this.setFrame(assembledFrameName)
    }

    else
    {
      this.setTexture('atlas0', this.name + SEPARATOR + "E_walk_0")
    }

    return this.setOrigin(0.5, 1)

  }

  place()
  {
    const {playerX, playerY, facingDir} = this.scene.igPlug.pendingRoom

    if ( playerX === 0 || playerX)
    {
      this.x = playerX
    }

    if (playerY === 0 || playerY )
    {
      this.y = playerY
    }


    // if (facingDir)
    // {
    //   const assembledFrameName = "robot_" + facingDir + "_walk_0"

    //   console.log("FacingDir:", assembledFrameName)
      
    //   this.setFrame(assembledFrameName)

    //   .setOrigin(0.5, 1);

    //   console.log(this.frame.name)

    // }
    // const {Between} = Phaser.Math

    // this.setPosition(Between(20, 256), Between(20, 100))

    // //this.scene.dsAry.push(this)
    return this
  }

  preUpdate(time, delta)
  {
    super.preUpdate(time, delta)

    if (this.walk.aTargetExists)
    {
      this.walk.update(time, delta)
    }
  }

  clearWalkEvents()
  {
    for (const eventName of Object.values(WalkEvents))
    {
      this.off(eventName)
    }

    return this
  }

  setWalkEventsFacing()
  {
    this.clearWalkEvents()
    
    this.on(WalkEvents.WALK_START, this.playFacingAndWalk, this)//function() { this.walk.aTargetExists = true }, this)

    this.on(WalkEvents.WALK_SUBSTART, this.playFacingAndWalk, this)

    this.on(WalkEvents.WALK_COMPLETE, this.stopWalking, this)
  }

  setWalkEventsRotateBefore()
  {
    this.clearWalkEvents()
    // console.log(RotationHelper, typeof RotationHelper.checkRotation, RotationHelper.checkRotation.toString())

    this.on(WalkEvents.WALK_START, RotationHelper.checkRotation, RotationHelper);
    
    // this.on(WalkEvents.WALK_START, RotationHelper.checkRotation, RotationHelper);//function() { this.walk.aTargetExists = true }, this)

    this.on(WalkEvents.WALK_SUBSTART, this.playFacingAndWalk, this)//function() { this.walk.aTargetExists = true }, this)

    this.on(WalkEvents.WALK_COMPLETE, this.stopWalking, this)
  }

  setWalkEventsJustWalk()
  {
    this.clearWalkEvents()
       
    this.on(WalkEvents.WALK_START, this.startWalking, this)//function() { this.walk.aTargetExists = true }, this)

    this.on(WalkEvents.WALK_SUBSTART, this.startWalking, this)//function() { this.walk.aTargetExists = true }, this)

    this.on(WalkEvents.WALK_COMPLETE, this.stopWalking, this)
  }

  playFacingAndWalk(actor, startCoords, endCoords)
  {
    actor.playAnimAndWalk(`${actor.name}_walk_` + RotationHelper.getRelativeCardinal(startCoords, endCoords))
    // console.log("testing playFacingAndWalk:", actor)
    //const [actorName, cardinal, action, frame] = this.getInfoFromFrameName()

    //actor.play(`${/*this.getActorNameFromFrameName()*/actor.name}_walk_` + RotationHelper.getRelativeCardinal(startCoords, endCoords))

    // actor.setOrigin(0.5, 1)
    // actor.startWalking() // walk.aTargetExists = true//.start()
  }

  playAnimAndWalk(animKey)
  {
    this.play(animKey)
    this.startWalking()
  }

  walkTo(path, floor)
  {
    if (Array.isArray(path))
    {
      this.walk.setPath(path)
    }
    else
    {
      // if (floor)
      // {

      // }

      this.walk.setPath(this.scene.pmsManager.generatePath(this, path, floor || this.floor))

    }
  }

  startWalking()
  {
      this.walk.aTargetExists = true
  }

  getInfoFromFrameName()
  {
    return this.frame.name.split(SEPARATOR)
  }

  getCardinalFromFrameName()// [actorName, cardinal, action, frame] = this.getInfoFromFrameName())
  {
    // console.log("GetInfo:", cardinal)
    // return cardinal
    return this.getInfoFromFrameName()[1]
  }

  getActorNameFromFrameName()// [actorName, cardinal, action, frame] = this.getInfoFromFrameName())
  {
    // console.log("GetInfo:", cardinal)
    // return cardinal
    return this.getInfoFromFrameName()[0]
  }

  stopWalking()
  {
    this.walk.aTargetExists = false
    this.anims.stop()
    const [actorName, cardinal, action, frame] = this.getInfoFromFrameName()
    this.setFrame(`${actorName}_${cardinal}_${action}_0`)
  }

  setFloor()
  {
    // console.log("Called Player#setFloor")

    //this.floor = null

    if (this.scene.igPlug.pendingRoom.playerFloor)
    {
      this.floor = this.scene.cache.custom.floors.get(this.scene.igPlug.pendingRoom.playerFloor)
      // console.log("Set the specified Player#floor now!", this.floor.debugName)
    }
    else
    {
      // console.log("Fetching player floor")
      for (const floor of this.scene.floors)
      {
          //  console.dir("Pl floor check:", floor, floor.debugName)
          if (floor.polygons[0].contains(this.x, this.y))
          {
            // console.log("Setting floor:", floor)
            this.floor = floor
            break
          }
      }
      console.log("FLOOR ANC:", this.floor)
    }

  } // end setFloor

  rotationIsComplete()
  {
    this.anims.stop()
    console.log("DuoB!")
    this.emit(RotationHelperEvents.RotationComplete, this)
  }

  rotateTo(cardinalAcronym)
  {
    console.log("Player...RotateTo:", cardinalAcronym, this.listeners(RotationHelperEvents.RotationComplete))
    RotationHelper.RotateTo(this, null, cardinalAcronym)
  }

  temporaryAddItem(itemId)
  {

    this.scene.igPlug.inventory.addItem(itemId, this.name)
    this.emit(GenericEvents.ADD_INVENTORY_ITEM, this, itemId)
  }

  temporaryLoseItem(itemId)
  {
    this.scene.igPlug.inventory.removeItem(itemId, this.name)
    this.emit(GenericEvents.LOSE_INVENTORY_ITEM, this, itemId)
  }

  storeLocation(locData = this.locationData)
  {
      locData.id = this.scene.actualRoomID

      ///this.locData.playerVisible = true

      locData.playerX = this.x

      locData.playerY = this.y

      //locData.frameName = false

      // locData.actor = "robot"

      locData.facingDir =  this.frame.name
      
      locData.playerFloor = this.floor
  }

  put(roomId, x, y, facing, floor)
  {
    this.locationData.id = roomId

    this.locationData.playerX = x

    this.locationData.playerY = y

    this.locationData.facingDir =  facing.length < 3 ? this.name + SEPARATOR + facing + "_walk_0" : facing

    this.locationData.playerFloor = floor
  }

  placeFromLocationData()
  {
    if (this.locationData.id === this.scene.actualRoomID)
    {

      this.x = this.locationData.playerX

      this.y = this.locationData.playerY

      this.setFrame(this.locationData.facingDir)

      this.floor = this.locationData.playerFloor
      
    }


  }

}
