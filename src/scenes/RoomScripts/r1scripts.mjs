 import * as AllEvents from "../../plugins/AllEvents.mjs"
//  console.log("YYAYYYYYYYYYYYYYYYYYYYYYYYY", AllEvents.walkEvents, AllEvents.RotationHelperEvents.RotationComplete)

class RS1 {

    constructor()
    {
        console.log("Script RS-1-")
    }

    test()
    {
        console.log("Called testFunc1")
    }

    exitEst(triggerArea, actor)
    {
        actor.scene.quickChangeRoom(0, 15, false, "SE")//, "fl00")
        actor.scene.drawRoom()
        // console.log("Called exitEst", triggerArea, actor)
    }
    
    exitWest(triggerAra, actor)
    {
        // console.log("Called exitWest", triggerArea, actor)
    }

    ITcardA()
    {
        console.log("Clicked on:", "ITcardA")
    }

    r2cabinetDoors()
    {
        console.log("Clicked on:", "r2cabinetDoors", this)
        //this.player. 85,98

            const path = this.scene.pmsManager.generatePath(this.scene.player, {x:85, y:98}, this.scene.player.floor)
            // console.log("Path:", path)
            this.scene.player.once('walkcomplete', () => this.scene.player.rotateTo("NE"));

         this.scene.player.once('rotationcomplete', () => {this.scene.player.anims.play({key:'robot_interact_NE', repeat:0})})

            this.scene.player.once('animationcomplete', () => {this.scene.toggleFrameAndBool(this, 3)})/*{const frameSuffix =  this.frame.name.substring(0, this.frame.name.length - 1);

                this.setFrame(frameSuffix + this.scene.boolsManager.toggle(3))
                  .setOrigin(0);
                });*/

            this.scene.player.walk.setPath(path)
     
                //this.scene.toggleFrameAndBool(this, 3)

        // const frameSuffix =  this.frame.name.substring(0, this.frame.name.length - 1)
        // this.setFrame(frameSuffix + this.scene.boolsManager.toggle(3))
        //   .setOrigin(0)
    }

    cabinet()
    {
        console.log("Clicked on:", "cabinet")
    }

    otherRoom()
    {
        console.log("Clicked on:", "otherRoom")
    }
}

export default RS1