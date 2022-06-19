import Phaser from "phaser"
import SEPARATOR from "../../constants/SEPARATOR.mjs"

import { directionsMap, ARC, cardinalsPoints, wholeCircumference, lastElementIndex, halfCircumference } from "./RotationConstants.mjs"

const { GetFirst } = Phaser.Utils.Array

class RotationHelper
{

  // static wholeCircumference = cardinalsPoints.length;
  // static lastElementIndex = RotationHelper.wholeCircumference - 1;
  // static halfCircumference = RotationHelper.wholeCircumference / 2;

    // constructor()
    // {
    //     // hmm...
    //     // this.scene = scene

    //     // this.wholeCircumference = cardinalsPoints.length

    //     // this.lastElementIndex = this.wholeCircumference - 1
    
    //     // this.halfCircumference = this.wholeCircumference / 2
    // }

    static minDistance(startingDirectionAcronym, goalDirectionAcronym)
    {
      const start = cardinalsPoints.indexOf(startingDirectionAcronym)
      const end = cardinalsPoints.indexOf(goalDirectionAcronym)

      //vars for result
      let resDistance;
      let resIsCW;

      //
      const rawDistance = end - start

      //arc A
      const distanceA = Math.abs(rawDistance)

      //bait
      if (distanceA < 2 || distanceA === lastElementIndex)
      {
        return false
      }


      if (distanceA === halfCircumference)
      {
        resDistance = distanceA
        resIsCW = Math.random() > 0.5 ? true : false
      }

      else
      {
        const isClockwiseA = 0 < rawDistance

        //now let's get arc B
        const distanceB = wholeCircumference - distanceA

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
  

    static getRelativeCardinal(actor, endCoords)
    {
      //console.log("Now is STATIC!")
      // const { x, y } = actor
      // const { x: endX, y: endY } = endCoords
      // const angle = Phaser.Math.Angle.Between(x, y, endX, endY)
      // const snapped = Phaser.Math.Snap.To(angle,  ARC)  // Phaser.Math.Snap.To(angle, ARC)
      return directionsMap.get(Phaser.Math.Snap.To(Phaser.Math.Angle.Between(actor.x, actor.y, endCoords.x, endCoords.y), ARC)) // (snapped)
    }

    static checkRotation (actor, startCoords, endCoords)
    {
      // console.log('static CheckRotation:')
      const direction = actor.getCardinalFromFrameName()
  
      const endAcronym = RotationHelper.getRelativeCardinal(actor, endCoords)

      const rot = RotationHelper.minDistance(direction, endAcronym)
  
      //is a rotation necessary?
      if (rot)
      {
  
        // const startAcronym = rot.startingDirectionAcronym
        // const rotAnim = actor.scene.anims.get(actor.getActorNameFromFrameName() + SEPARATOR + 'rotate');
        // const {frames: rotFrames} = rotAnim;

        const rotFrames = actor.scene.anims.get(actor.getActorNameFromFrameName() + SEPARATOR + 'rotate').frames;

        const stopFrame = GetFirst(rotFrames, 'textureFrame', actor.getActorNameFromFrameName() + SEPARATOR + endAcronym + "_walk_0");

        const startFrame = rotFrames.indexOf(GetFirst(rotFrames, 'textureFrame', actor.getActorNameFromFrameName() + SEPARATOR + rot.startingDirectionAcronym + "_walk_0"));

        if (rot.resIsCW)
        {
          actor.play({ key: actor.getActorNameFromFrameName() + SEPARATOR + 'rotate', startFrame })
        }
        else
        {
          actor.playReverse({ key: actor.getActorNameFromFrameName() + SEPARATOR + 'rotate', startFrame })
        }
  
        actor.anims.stopOnFrame(stopFrame)
        actor.once('animationstop', () =>
        {
          // actor.playAnimAndWalk(actor.getActorNameFromFrameName() + SEPARATOR + 'walk' + SEPARATOR + endAcronym)
          actor.playAnimAndWalk(actor.name + SEPARATOR + 'walk' + SEPARATOR + endAcronym)
        })
  
      }
      else
      //just walk
      {
        // actor.playAnimAndWalk(actor.getActorNameFromFrameName() + SEPARATOR + 'walk' + SEPARATOR + endAcronym)
        actor.playAnimAndWalk(actor.name + SEPARATOR + 'walk' + SEPARATOR + endAcronym)
      }
    }
}

export default RotationHelper
