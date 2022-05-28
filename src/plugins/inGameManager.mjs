import boolsManager from "./VarsManager/boolsManager.mjs";

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

        this.pendingRoom = {}

        this.currentRoom = 0

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

    getRandom()
    {
        return this.random
    }

} //End myGlobalPlugin

export default inGameManager