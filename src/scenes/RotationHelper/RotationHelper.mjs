import Phaser from "phaser"

import { directionsMap, ARC, cardinalsPoints } from "./RotationConstants.mjs"

class RotationHelper
{
    constructor(scene)
    {
        // hmm...
        this.scene = scene

        this.wholeCircumference = cardinalsPoints.length

        this.lastElementIndex = this.wholeCircumference - 1
    
        this.halfCircumference = this.wholeCircumference / 2
    }

    minDistance(startingDirectionAcronym, goalDirectionAcronym)
    {
      const start = cardinalsPoints.indexOf(startingDirectionAcronym)
      const end = cardinalsPoints.indexOf(goalDirectionAcronym)

      //vars for result
      let resDistance, resIsCW

      //
      const rawDistance = end - start

      //arc A
      const distanceA = Math.abs(rawDistance)

      //baits
      if (distanceA < 2 || distanceA == this.lastElementIndex) { return false }

      if (distanceA == this.halfCircumference)
      {
        resDistance = distanceA
        resIsCW = Math.random() > 0.5 ? true : false
      }
      else
      {
        const isClockwiseA = 0 < rawDistance

        //now let's get arc B
        const distanceB = this.wholeCircumference - distanceA
        //const isClockwiseB = !isClockwiseA

        //which is the minor?
        if (distanceB > distanceA)
        {
          resDistance = distanceA, resIsCW = isClockwiseA
        }
        else
        {
          resDistance = distanceB, resIsCW = !isClockwiseA
        }
      }

      //test skip
      return { resDistance, resIsCW, goalDirectionAcronym, startingDirectionAcronym }
      
    } //end miDistance

    static checkRotation(actor, startCoords, endCoords)
    {
      // console.log('CheckRotation:')
      const { name, direction, action, frameNumber } = actor.getInfo()
  
      const endAcronym = RotationHelper.getRelativeCardinal(actor, endCoords)
  
      const rot = this.minDistance(direction, endAcronym)
  
      //is a rotation necessary?
      if(rot)
      {
  
        const startAcronym = rot.startingDirectionAcronym
        const realEnd = rot.goalDirectionAcronym
        //      let startAcronym, realEnd
        //  
        //      if (rot.resDistance == 2)
        //      {
        //        startAcronym = rot.startingDirectionAcronym
        //        realEnd = rot.goalDirectionAcronym
        //      }
        //      else
        //      {
        //        startAcronym = rot.adjustedStart
        //        realEnd = rot.adjustedEnd
        //      }
  
  
        log("Ani start/end:", startAcronym, realEnd, rot.resDistance)
        //...forse...
  
        const rotAnim = this.scene.anims.get('rotate')
        const rotFrames = rotAnim.frames
        const stopFrame = this.getAniFrameByName(rotFrames, this.buildNameByAcronym(realEnd))
        const startFrame = rotFrames.indexOf(this.getAniFrameByName(rotFrames, this.buildNameByAcronym(startAcronym)))
  
        if(rot.resIsCW)
        {
          actor.play({ key: 'rotate', startFrame }) //, delay: rot.resDistance == 2? 500: 1})
        }
        else
        {
          actor.playReverse({ key: 'rotate', startFrame }) //, delay: rot.resDistance == 2? 500: 1})
        }
  
        actor.anims.stopOnFrame(stopFrame)
        actor.once('animationstop', () =>
        {
          actor.play('walk' + endAcronym);
          actor.walk.start()
        })
  
      }
      else
      //just walk
      {
        actor.play('walk' + endAcronym)
        actor.walk.start()
      }
  
    } //end checkRotation
  

    static getRelativeCardinal(actor, endCoords)
    {
      console.log("Now is STATIC!")
      const { x, y } = actor
      const { x: endX, y: endY } = endCoords
      const angle = Phaser.Math.Angle.Between(x, y, endX, endY)
      const snapped = Phaser.Math.Snap.To(angle,  ARC)  // Phaser.Math.Snap.To(angle, ARC)
      return directionsMap.get(Phaser.Math.Snap.To(Phaser.Math.Angle.Between(actor.x, actor.y, endCoords.x, endCoords.y), ARC)) // (snapped)
    }
}

export default RotationHelper
