import * as AllEvents from "../../plugins/AllEvents.mjs"

import { crazyCodingHelper } from "../../utils/crazyCodingHelper.mjs"


import GenerateSingleAction from "../../utils/GenerateSingleAction.mjs"

export default class RS0 {

    constructor()
    {
        console.log("Script RS0")
    }

    onStart()
    {
      console.log("Called %conStart RS0", "color: yellow; font-style: italic; background-color: blue;");

      //this.rs.setupTaRects()

      // this.rs.setupTaRects.call(this)

      //  console.log(this, Object.getPrototypeOf(this))


      for (const ta of this.triggerAreas.children)
      {
        // console.dir(ta)

        // console.log(ta.zone.name, ta.listeners() )//ta.zone.listeners())
      }

    }

    // trigger Area behavor
    stopDoor(triggerArea, actor)
    {
      // console.log("Stop Door", actor.scene.boolsManager.bitStatus(0), typeof actor.scene.boolsManager.bitStatus(0))
      if (!actor.scene.boolsManager.bitStatus(0)) // === 0)
      {
        actor.scene.player.walk.setIdle()


        // hardcoded "separate down"
        actor.scene.player.y = triggerArea.area.y + triggerArea.area.height + 1

        actor.stop()
      }

    }

    // stopDoorleave(triggerArea, actor)
    // {
    //   // console.log("Stop Door LEAVE", triggerArea, actor)
    //   // actor.scene.player.walk.setIdle()

    //   // actor.scene.player.y = triggerArea.area.y + triggerArea.area.width + 1

    // }

    exitNord(triggerArea, actor)
    {
      console.log("exitNord", triggerArea, actor, "testing floor")
      actor.scene.quickChangeRoom(1, 90, 26, "SW")//, "fl01su")
      actor.scene.drawRoom()
    }

    exitWest(triggerArea, actor)
    {
      //console.log("exitWest", triggerArea, actor)
      actor.scene.quickChangeRoom(1, 133, false, "W")
      actor.scene.drawRoom()
    }

    setupTaRects()
    {
      console.log("Called 'setupTaRects'!", this)

      // for (const ta of this.triggerAreas.children)
      // {
      //   console.dir(ta)
      // }
    }
    

    wrench()
    {
      console.log(this);
      // 116, 48
      // this.scene.player.setTint(0x789abd)
      this.scene.scriptedAction(
        [
            GenerateSingleAction(this.scene.player, 'walkTo', AllEvents.walkEvents.WALK_COMPLETE, {x: 116, y:48 }),
            // GenerateSingleAction(this.scene.shield, 'raise', AllEvents.ShieldEvents.RAISE),
            GenerateSingleAction(this.scene.player, "play", "animationcomplete", {key:"robot_interact_NE"/*, repeat: 0, duration: 100*/}),
            GenerateSingleAction(this, 'hideAndSetBool', AllEvents.GenericEvents.SPRITE_HIDE, [this, 1, 1], this.scene),
            GenerateSingleAction(this.scene.player, "temporaryAddItem", AllEvents.GenericEvents.ADD_INVENTORY_ITEM, 2),
            // GenerateSingleAction(this.scene.player, "play", "animationcomplete", {key:"robot_interact_NE"/*, repeat: 0, duration: 90*/}),
            GenerateSingleAction(this.scene.player, 'rotateTo', AllEvents.RotationHelperEvents.RotationComplete, "SE")
        ])
    }

    crateLid()
    {
      console.log("Clicked on:", "crateLid")
        /*
        const frameSuffix =  this.frame.name.substring(0, this.frame.name.length - 1)
        this.setFrame(frameSuffix + this.scene.boolsManager.toggle(2))
          .setOrigin(0)*/
          this.scene.toggleFrameAndBool(this, 2)
      
    }

    crate()
    {
      console.log(this);
      // id, completeWhen, emitter, func, params, context
      console.log(this.scene.player.actions)
      const {makeSingleAction} = this.scene.player.actions
      const randomId = Math.random()

      this.scene.player.actions.add(randomId, [
        makeSingleAction(randomId, AllEvents.walkEvents.WALK_COMPLETE, this.scene.player, 'walkTo', {x: 100, y:54 }),
        makeSingleAction(randomId, "animationcomplete", this.scene.player, "play",  {key:"robot_interact_W"}),
        // getMatching('visible', true)
        makeSingleAction(randomId, AllEvents.GenericEvents.ADD_INVENTORY_ITEM, this.scene.player, "temporaryAddItem", 1),
        makeSingleAction(randomId, AllEvents.RotationHelperEvents.RotationComplete, this.scene.player, 'rotateTo', "SE")
      ])

    }

    crepa()
    {
      console.log(this);
    }

    button()
    {
      console.log(this);
      console.log("Clicked on:", "button")

      if (this.scene.checkActiveItem(0))
      {
        this.scene.scriptedAction(
          [
            GenerateSingleAction(this.scene.player, 'walkTo', AllEvents.walkEvents.WALK_COMPLETE, {x: 166, y:68 }),
            GenerateSingleAction(this.scene.player, 'rotateTo', AllEvents.RotationHelperEvents.RotationComplete, "NE"),
            GenerateSingleAction(this.scene.player, "play", "animationcomplete", {key:"robot_interact_NE"}),
            GenerateSingleAction(this, "toggleFrameAndBool", AllEvents.GenericEvents.TOGGLE_FRAME_AND_BOOL, [this, 5], this.scene),
            GenerateSingleAction(this.scene.player, 'rotateTo', AllEvents.RotationHelperEvents.RotationComplete, "S")

          ])
        // x:166, y:68
      }
        
        // const frameSuffix =  this.frame.name.substring(0, this.frame.name.length - 1)
        // this.setFrame(frameSuffix + this.scene.boolsManager.toggle(5))
        //   .setOrigin(0)
        // this.scene.toggleFrameAndBool(this, 5)
    }

    mensole()
    {
      console.log(this);
    }

    striscia()
    {
      console.log(this);
    }

    porta()
    {
      console.log(this);
      // const frameSuffix =  this.frame.name.substring(0, this.frame.name.length - 1)
      // this.setFrame(frameSuffix + this.scene.boolsManager.toggle(0))
      //   .setOrigin(0)
      this.scene.toggleFrameAndBool(this, 0)
    }

    coso_dietro()
    {
      console.log(this);
    }

    vasca()
    {
      console.log(this);
    }

    tubo()
    {
      console.log(this);
    }

    topDoor()
    {
      console.log(this);
    }
}

//export default RS0
