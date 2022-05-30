import Phaser from 'phaser'

export default class Player extends Phaser.GameObjects.Sprite
{
  constructor(scene, name = "robot")
  {
    super(scene, 0, 0, "__DEFAULT")

    this.addToDisplayList()
    this.hide()

    this.setName(name)
  }

  hide()
  {
    this.setActive(false)
      .setVisible(false)
    
    return this
  }

  show()
  {
    this.setActive(true)
    .setVisible(true)
    .setTexture('atlas0', "robot_E_walk_0")
    .setOrigin(1, 0.5)

    return this
  }

  place(x, y)
  {
    const {Between} = Phaser.Math

    this.setPosition(Between(20, 256), Between(20, 100))

    //this.scene.dsAry.push(this)
    return this
  }

}