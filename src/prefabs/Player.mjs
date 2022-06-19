import Phaser from 'phaser'

import WalkComponent from './walkComponent/walkComponent.mjs'
import WalkEvents from './walkComponent/walkEvents.mjs'

import SEPARATOR from '../constants/SEPARATOR.mjs'

import RotationHelper from '../scenes/RotationHelper/RotationHelper.mjs'

// methods are needed to get sprite information from frameName
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

    //this.setWalkEventsFacing() // setJustWalk()

    this.setWalkEventsRotateBefore()


  }

  hide()
  {
    this.setActive(false)
      .setVisible(false)

    // console.log("PL WALK", this.walk)
    this.walk.setIdle()
    this.anims.stop()
    
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

  // checkRotation(actor, startCoords, endCoords)
  //   {
  //     // console.log('CheckRotation:')
  //     const direction = actor.getCardinalFromFrameName()
  
  //     const endAcronym = RotationHelper.getRelativeCardinal(actor, endCoords)
  
  //     const rot = RotationHelper.minDistance(direction, endAcronym)
  
  //     //is a rotation necessary?
  //     if(rot)
  //     {
  
  //       const startAcronym = rot.startingDirectionAcronym
  //       const realEnd = rot.goalDirectionAcronym
  //       //      let startAcronym, realEnd
  //       //  
  //       //      if (rot.resDistance == 2)
  //       //      {
  //       //        startAcronym = rot.startingDirectionAcronym
  //       //        realEnd = rot.goalDirectionAcronym
  //       //      }
  //       //      else
  //       //      {
  //       //        startAcronym = rot.adjustedStart
  //       //        realEnd = rot.adjustedEnd
  //       //      }
  
  
  //       log("Ani start/end:", startAcronym, realEnd, rot.resDistance)
  //       //...forse...
  
  //       const rotAnim = actor.scene.anims.get('rotate');
  //       const {frames: rotFrames} = rotAnim;//.frames;
  //       const stopFrame = GetFirst(rotFrames, 'textureFrame', this.buildNameByAcronym(realEnd));
  //       const startFrame = rotFrames.indexOf(this.getAniFrameByName(rotFrames, this.buildNameByAcronym(startAcronym)))
  
  //       if(rot.resIsCW)
  //       {
  //         actor.play({ key: 'rotate', startFrame }) //, delay: rot.resDistance == 2? 500: 1})
  //       }
  //       else
  //       {
  //         actor.playReverse({ key: 'rotate', startFrame }) //, delay: rot.resDistance == 2? 500: 1})
  //       }
  
  //       actor.anims.stopOnFrame(stopFrame)
  //       actor.once('animationstop', () =>
  //       {
  //         actor.play('walk' + endAcronym);
  //         actor.walk.start()
  //       })
  
  //     }
  //     else
  //     //just walk
  //     {
  //       actor.play('walk' + endAcronym)
  //       actor.walk.start()
  //     }
  
    // } //end checkRotation

}
