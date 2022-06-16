import Phaser from 'phaser'

import WalkComponent from './walkComponent/walkComponent.mjs'
import WalkEvents from './walkComponent/walkEvents.mjs'

import SEPARATOR from '../constants/SEPARATOR.mjs'

export default class Player extends Phaser.GameObjects.Sprite
{
  constructor(scene, name = "robot", textureId = 0)
  {
    super(scene, 0, 0, 'atlas' + textureId, "__DEFAULT")

    this.addToDisplayList()
    
    // just a raw test:
    this.setName(name)

    this.walk = new WalkComponent(this)

    this.hide()

    this.setWalkEventsFacing() // setJustWalk()

    //this.on(WalkEvents.WALK_START, function() { this.walk.aTargetExists = true }, this)

    //this.on(WalkEvents.WALK_SUBSTART, function() { this.walk.aTargetExists = true }, this)

  }

  hide()
  {
    this.setActive(false)
      .setVisible(false)

    // console.log("PL WALK", this.walk)
    this.walk.setIdle()
    
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


    if (this.scene.igPlug.pendingRoom.facingDir)
    {
      const assembledFrameName = "robot_" + this.scene.igPlug.pendingRoom.facingDir + "_walk_0"

      this.setFrame(assembledFrameName)
    }

    else
    {
      this.setTexture('atlas0', "robot_E_walk_0")
    }

    return this.setOrigin(0.5, 1)

  }

  place(x, y)
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
  }

  setWalkEventsRotateBefore()
  {
    
  }

  setJustWalk()
  {
    this.clearWalkEvents()
       
    this.on(WalkEvents.WALK_START, this.walk.start, this)//function() { this.walk.aTargetExists = true }, this)

    this.on(WalkEvents.WALK_SUBSTART, this.walk.start, this)//function() { this.walk.aTargetExists = true }, this)
  }

  playFacingAndWalk()
  {
    const [actorName, cardinal, action, frame] = this.getInfoFromFrameName()
    console.log(this.originX, this.originY)

    //console.log(actorName, cardinal, action, frame)
    this.play(`${actorName}_walk_` + this.scene.rotationHelper.getRelativeCardinal(this, this.walk.endCoords))

    this.setOrigin(0.5, 1)
    this.walk.aTargetExists = true//.start()
  }

  getInfoFromFrameName()
  {
    return this.frame.name.split(SEPARATOR)
  }

}
