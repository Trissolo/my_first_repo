import Phaser from "phaser"

import { directionsMap, ARC } from "./RotationConstants.mjs"

class RotationHelper
{
    constructor(scene)
    {
        // hmm...
        this.scene = scene
    }

    getRelativeCardinal(actor, endCoords)
    {
      const { x, y } = actor
      const { x: endX, y: endY } = endCoords
      const angle = Phaser.Math.Angle.Between(x, y, endX, endY)
      const snapped = Phaser.Math.Snap.To(angle,  ARC)  // Phaser.Math.Snap.To(angle, ARC)
      console.log("FACING fromSNAPPED ANGLE:", snapped)
      console.log(directionsMap)
      return directionsMap.get(Phaser.Math.Snap.To(Phaser.Math.Angle.Between(actor.x, actor.y, endCoords.x, endCoords.y), ARC)) // (snapped)
    }
}

export default RotationHelper