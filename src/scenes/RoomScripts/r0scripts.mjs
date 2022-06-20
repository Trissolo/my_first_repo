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
      actor.scene.quickChangeRoom(1, 90, 26, "SW", "fl01su")
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
    }

    crateLid()
    {
      console.log("Clicked on:", "crateLid")
        
        const frameSuffix =  this.frame.name.substring(0, this.frame.name.length - 1)
        this.setFrame(frameSuffix + this.scene.boolsManager.toggle(2))
          .setOrigin(0)
      
    }

    crate()
    {
      console.log(this);
    }

    crepa()
    {
      console.log(this);
    }

    button()
    {
      console.log(this);
      console.log("Clicked on:", "button")
        
        const frameSuffix =  this.frame.name.substring(0, this.frame.name.length - 1)
        this.setFrame(frameSuffix + this.scene.boolsManager.toggle(5))
          .setOrigin(0)
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
      const frameSuffix =  this.frame.name.substring(0, this.frame.name.length - 1)
      this.setFrame(frameSuffix + this.scene.boolsManager.toggle(0))
        .setOrigin(0)
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
