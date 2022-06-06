import Phaser from 'phaser'

export default class Shield extends Phaser.GameObjects.Image
{
  constructor(scene)
  {
    super(scene, 0, 0, "atlas0", "singlePixel")

    this
        .setScale(63, 31)
        // .setAlpha(0.6)
        .setOrigin(0)
        .setDepth(Number.MAX_SAFE_INTEGER)
        .setInteractive({cursor:'url(assets_prod/cursors/over.cur), pointer'})
        .setScrollFactor(0)
        .on("pointerdown", function(pointer, sx, sy, stopProp){ console.log("stopped!"); stopProp.stopPropagation() });
  }

  raise()
  {
    this.setInteractive()
        .setActive(true)
        .setVisible(true)
  }

  hide()
  {
    this.disableInteractive()
        .setActive(false)
        .setVisible(false)
  }
}