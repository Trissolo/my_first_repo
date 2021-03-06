import Phaser from 'phaser'

import { ShieldEvents } from './ShieldEvents.mjs';

export default class Shield extends Phaser.GameObjects.Image
{
  constructor(scene)
  {
    super(scene, 0, 0, "atlas0", "singlePixel")

    this
        .setScale(scene.cameras.main.width, scene.cameras.main.height)
        .setAlpha(0.3)
        .setDepth(Number.MAX_SAFE_INTEGER)
        .setInteractive({cursor:'url(assets_prod/cursors/wait.cur), pointer'})
        .setScrollFactor(0)
        .on("pointerdown", function(pointer, sx, sy, stopProp){ console.log("stopped!"); stopProp.stopPropagation() })
        .setOrigin(0)
        .addToDisplayList()
  }

  raise()
  {
    this.setInteractive()
        .setActive(true)
        .setVisible(true)
        // .scene.igEvents.emit(ShieldEvents.RAISE, this.scene)
        .emit(ShieldEvents.RAISE, this)
  }

  lower()
  {
    this.disableInteractive()
        .setActive(false)
        .setVisible(false)
        .emit(ShieldEvents.LOWER, this)
  }
}