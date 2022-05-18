import boolsManager from "./VarsManager/boolsManager.mjs";

//needed just for his length
import conditions from "../constants/conditions.mjs";

class inGameManager extends Phaser.Plugins.BasePlugin {

    constructor (pluginManager)
    {
        super(pluginManager, 'inGameManager');

        this.boolsManager = new boolsManager(conditions.length);

        this.random = Math.random()
    }

    init ()
    {
        console.log('myGlobalPlugin is alive')
        console.dir("myGlobalPlugin here:", this)
    }

    setupBoolsManager(scene)
    {
        console.log("Adding to", scene)
        scene.boolsManager = this.boolsManager
    }

    getRandom()
    {
        return this.random
    }

} //End myGlobalPlugin

export default inGameManager