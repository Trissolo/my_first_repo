import Phaser from 'phaser'

import WalkComponent from './walkComponent/walkComponent.mjs'
import WalkEvents from './walkComponent/walkEvents.mjs'

export default class Player extends Phaser.GameObjects.Sprite
{
  constructor(scene, name = "robot")
  {
    super(scene, 0, 0, "__DEFAULT")

    this.addToDisplayList()
    this.hide()

    this.setName(name)

    this.walk = new WalkComponent(this)
    this.on(WalkEvents.WALK_START, function() { this.walk.aTargetExists = true }, this)
    this.on(WalkEvents.WALK_SUBSTART, function() { this.walk.aTargetExists = true }, this)

  }

  hide()
  {
    this.setActive(false)
      .setVisible(false)
    
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
    .setVisible(true)
    .setTexture('atlas0', "robot_E_walk_0")
    .setOrigin(0.5, 1)

    return this
  }

  place(x, y)
  {
    const {Between} = Phaser.Math

    this.setPosition(Between(20, 256), Between(20, 100))

    //this.scene.dsAry.push(this)
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

}