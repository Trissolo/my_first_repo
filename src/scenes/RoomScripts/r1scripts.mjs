import * as AllEvents from "../../plugins/AllEvents.mjs"

import { crazyCodingHelper } from "../../utils/crazyCodingHelper.mjs"


import GenerateSingleAction from "../../utils/GenerateSingleAction.mjs"


AllEvents.RoomBackgroundEvents.Background_Clicked
class RS1
{

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
        this.scene.scriptedAction(
            [
                GenerateSingleAction(this.scene.player, 'walkTo', AllEvents.walkEvents.WALK_COMPLETE, {x: 85, y:98 }),
                GenerateSingleAction(this.scene.shield, 'raise', AllEvents.ShieldEvents.RAISE),
                GenerateSingleAction(this.scene.player, "play", "animationcomplete", {key:"robot_interact_NE"/*, repeat: 0, duration: 100*/}),
                GenerateSingleAction(this, 'hideAndSetBool', AllEvents.GenericEvents.SPRITE_HIDE, [this, 4, 1], this.scene),
                GenerateSingleAction(this.scene.player, "temporaryAddItem", AllEvents.GenericEvents.ADD_INVENTORY_ITEM, 0),
                GenerateSingleAction(this.scene.player, "play", "animationcomplete", {key:"robot_interact_NE"/*, repeat: 0, duration: 90*/}),
                GenerateSingleAction(this.scene.player, 'rotateTo', AllEvents.RotationHelperEvents.RotationComplete, "SE")
            ])
    }

    r2cabinetDoors()
    {
        console.log("Clicked on:", "r2cabinetDoors", this)

        // hardcoded:

        // this.scene.player.once('walkcomplete', () => this.scene.player.rotateTo("NE"));

        // this.scene.player.once('rotationcomplete', () => {this.scene.player.anims.play({key:'robot_interact_NE', repeat:0})})

        // this.scene.player.once('animationcomplete', () => {this.scene.toggleFrameAndBool(this, 3)})


        // // start (hardcoded)
        // this.scene.player.walkTo({x: 85, y:98 })

        // console.log(this.scene.igPlug.scrActions)
        this.scene.scriptedAction(
            [
                // {emitter: this.scene.player, action: 'walkTo', params:[{x: 85, y:98 }], completeWhen: AllEvents.walkEvents.WALK_COMPLETE},
                // {}
                GenerateSingleAction(this.scene.player, 'walkTo', AllEvents.walkEvents.WALK_COMPLETE, {x: 85, y:98 }),

                //  GenerateSingleAction(this.scene.player, 'walkTo', AllEvents.walkEvents.WALK_COMPLETE, {x: 59, y:123 }),

                GenerateSingleAction(this.scene.player, 'rotateTo', AllEvents.RotationHelperEvents.RotationComplete, "NE"),

                GenerateSingleAction(this, 'toggleFrameAndBool', AllEvents.GenericEvents.TOGGLE_FRAME_AND_BOOL, [this, 3], this.scene),

                GenerateSingleAction(this.scene.player, 'play', 'animationcomplete', {key: 'robot_interact_NE', /*repeat: 0, duration: 90*/}), // , duration: 10}),

                GenerateSingleAction(this.scene.player, "setGameObjectFrame", AllEvents.GenericEvents.SPRITE_SET_FRAME, [this.scene.player, "robot_N_walk_0"], this.scene)

                

            ]
        )

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