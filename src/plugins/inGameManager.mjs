import boolsManager from "./VarsManager/boolsManager.mjs";
import RoomScript from "../scenes/RoomScripts/RoomScripts.mjs";

import ScriptedActions from "./ScriptedActions.mjs";

//needed just for his length
import conditions from "../constants/conditions.mjs";

class inGameManager extends Phaser.Plugins.BasePlugin
{

    constructor(pluginManager)
    {
        super(pluginManager, 'inGameManager');

        // in-game event emitter
        this.igEvents = new Phaser.Events.EventEmitter()

        this.boolsManager = new boolsManager(conditions.length);

        this.roomScripts = new RoomScript()

        this.pendingRoom = {}

        // this.currentRoom = 0

        this.resetPending()

        this.scrActions = new ScriptedActions()

    }

    init ()
    {
        console.log('myGlobalPlugin is alive')
    }

    //not used
    injectBoolsManager(scene)
    {
        scene.boolsManager = this.boolsManager
    }

    installOn(scene)
    {
        //place this entire plugin into scene
        scene.igPlug = this

        //In Game EventEmitter!
        scene.igEvents = this.igEvents

        //Bools (not yet 'Variables') Manager
        scene.boolsManager = this.boolsManager

        if (scene.scene.key === "Viewscreen")
        {
            this.viewScreen = scene
        }
    }

    resetPending()
    {
        this.pendingRoom.id = null

        this.pendingRoom.playerVisible = true

        this.pendingRoom.playerX = null

        this.pendingRoom.playerY = null

        this.pendingRoom.frameName = false

        this.pendingRoom.actor = "robot"

        this.pendingRoom.facingDir = "E"

        this.pendingRoom.playerFloor = null

        // From frame.name:

        // actorName_
        // cardinalDirection_
        // action_
        // frameNumber
    }

    setPendingRoomId(roomId)
    {
        this.pendingRoom.id = roomId
    }

    setPendingRoomPlayerX(newPlayerX)
    {
        this.pendingRoom.playerX = newPlayerX
    }

    setPendingRoomPlayerY(newPlayerY)
    {
        this.pendingRoom.playerY = newPlayerY
    }

    setPendingRoomActor(actor = "robot")
    {
        this.pendingRoom.actor = actor
    }

    setPendingRoomFacingDir(cardinal)
    {
        this.pendingRoom.facingDir = cardinal
    }

    setPendingRoomPlayerFloor(floorNome)
    {
        this.pendingRoom.playerFloor = floorNome
    }

} //End myGlobalPlugin

export default inGameManager