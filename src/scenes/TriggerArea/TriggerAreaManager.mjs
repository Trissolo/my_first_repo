import Phaser from 'phaser'
import TriggerArea from './TriggerArea.mjs'
import NumFromString from '../../utils/NumFromString.mjs'

import TriggerAreaEvents  from './TriggerAreaEvents.mjs'
 

import hoverNames from '../../constants/hoverNames.mjs'

class TriggerAreaManager
{
  constructor(scene)
  {
    this.scene = scene

    this.igEvents = scene.igEvents

    this.children = []

    //250ms
    this.timeEvent = scene.time.addEvent({ delay: 40, callback: this.checkRects, callbackScope: this, loop: true, paused: true });

    //this.rects = []

  } // end constructor



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
      // console.log(child)
      child.hoverName = params.hoverName
      child.setVisible(true)
      child.setActive(true)
      child.setInteractive()

      if(!child.listenerCount('pointerover'))
      {
        child.on('pointerdown', this.scene.moveToClick, this.scene)
        child.on('pointerover', this.scene.thingOvered)
        child.on('pointerout', this.scene.thingOut, this.scene)
        child.setName(params.name)
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
      for (const child of this.children)
      {

        child.checkRect = false

        child._areaIsOccupied = false

        child.area.setEmpty()

        child.effectuators.length = 0


        // now the zone...
        child.setVisible(false)
        
        //child.checkZone = false

        child.disableInteractive()

        child.hoverName = null

        child.setName("")


        // remove listeners:

        // area:
        child.off('entertriggerarea')

        child.off('leavetriggerarea')

        // pointer:
        child.off('pointerdown')

        child.off('pointerover')

        child.off('pointerout')


        // lastly...
        //child.removeAllListeners();

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
          if (!triggerArea._areaIsOccupied && triggerArea.area.contains(actor.x, actor.y))// (actor))
          {
            triggerArea._areaIsOccupied = true
            // console.log("%cEntered on", "color:yellow;font-size: 1.8em;", triggerArea.name)
            triggerArea.emit(TriggerAreaEvents.TRIGGERED, triggerArea, actor)

          }

          else if ( triggerArea._areaIsOccupied && !triggerArea.area.contains(actor.x, actor.y))
          {
            triggerArea._areaIsOccupied = false
            // console.log("%cJust left", "color:orange;font-size: 1.8em;", triggerArea.name)
            triggerArea.emit(TriggerAreaEvents.DISENGAGED, triggerArea, actor)
          }
        }
      }
    }
  }

  initializeRects()
  {
    for ( const triggerArea of this.children)
    {
      //console.log(triggerArea)
       if (triggerArea.checkRect)
      {
        for (const actor of triggerArea.effectuators)
        {

          // if (    triggerArea._areaIsOccupied = triggerArea.area.contains(actor.x, actor.y)    ) 
          // {
          //   continue
          // }

          if (triggerArea.area.contains(actor.x, actor.y))
          {
            triggerArea._areaIsOccupied = true
            break
          }


        }
      }
    }
  }

} // end class

export default TriggerAreaManager
