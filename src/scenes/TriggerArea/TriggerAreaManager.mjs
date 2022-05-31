import Phaser from 'phaser'
import TriggerArea from './TriggerArea.mjs'
import NumFromString from '../../utils/NumFromString.mjs'

import hoverNames from '../../constants/hoverNames.mjs'

class TriggerAreaManager
{
  constructor(scene)
  {
    this.scene = scene

    this.igEvents = scene.igEvents

    this.children = []

    //250ms
    this.timeEvent = scene.time.addEvent({ delay: 250, callback: this.checkRects, callbackScope: this, loop: true, paused: true });

    //this.rects = []

  } // end constructor

  addZone(triggerAreaRect)
  {
    const zone = this.scene.add.zone(0, 0, 0, 0)
      //.setActive(false)
      .setVisible(false)
      .setOrigin(0)
      .setDepth(1)//9e9)
      .setInteractive({hitArea: triggerAreaRect, hitAreaCallback: Phaser.Geom.Rectangle.Contains, cursor:'url(assets_prod/cursors/exit.cur), pointer' } )

    return zone
  }

  get(params)
  {
    const {children} = this

    if (children.length)
    {
      for (let i = 0; i < children.length; i++)
      {

        if (children[i].available)
        {
          //console.log("CHILD RECYCLED!")
          return this.setChild(children[i], params)
        }
      } // end for

    }

    const ta = new TriggerArea(this)
    this.children.push(ta)
    return this.setChild(ta, params)
  }

  setChild(child, params)
  {
    child.available = false

    child.area.setTo(...NumFromString(params.rect, 0))

    child.checkRect = true

    child._areaIsOccupied = false

    //forced by code! :(
    child.effectuators.push(this.scene.player)



    //maybe "name" is wrong, and some other property needs to be checked instead.
    if (params.name && params.name.startsWith('exit'))
    {
      console.log(child)
      child.zone.hoverName = params.hoverName
      child.zone.setVisible(true)
      child.zone.setActive(true)
      child.zone.setInteractive()

      if(!child.zone.listenerCount('pointerover'))
      {
      child.zone.on('pointerover', this.scene.thingOvered)
      child.zone.on('pointerout', this.scene.thingOut, this.scene)
      child.zone.setName(params.name)
      }
    }

    //console.log("CHILD SETTED:", child)
    return child
  }

  disableChildren()
  {
    // const {children} = this
    if (this.children.length)
    {
      for (const child of this.children)  // (let i = 0, child; i < children.length; i++)
      {
        // child = children[i]
        

        child.checkRect = false

        child._areaIsOccupied = false

        child.area.setEmpty()

        child.effectuators.length = 0


        // now the zone...
        child.zone.setVisible(false)
        
        child.checkZone = false

        child.zone.disableInteractive()

        child.zone.hoverName = null

        child.zone.setName("")


        // lastly...
        child.removeAllListeners();

        child.available = true
      }
    }
  }

  startRectChecking()
  {
    this.timeEvent.paused = false
  }

  stopRectChecking()
  {
    this.timeEvent.paused = true
  }

  checkRects()
  {
    for ( const triggerArea of this.children)
    {
      //console.log(triggerArea)
      if (triggerArea.checkRect)
      {
        for (const actor of triggerArea.effectuators)
        {
          if (1 > 0)
          {

          }
        }
      }
    }
  }

} // end class

export default TriggerAreaManager