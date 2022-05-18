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

        //testing...
        const {dir, log, clear} = console
        clear()
        const myColor = "color:#33f; background-color:#aaa;"

        dir(this.boolsManager)

        log(this.boolsManager.boolsContainer)

        this.boolsManager.boolsContainer[0] = 37
        let tempIdx = 5

        
        log(this.boolsManager.debugChunk())
        log("Checking...", tempIdx)

        log(this.boolsManager.bitStatus(tempIdx))
        log(this.boolsManager.debugChunk())

        log(this.boolsManager.toggle(tempIdx))
        log(this.boolsManager.debugChunk())

        log(this.boolsManager.toggle(tempIdx))
        log(this.boolsManager.debugChunk())

        log(this.boolsManager.clear(tempIdx))
        log(this.boolsManager.debugChunk())

        log(this.boolsManager.clear(tempIdx))
        log(this.boolsManager.debugChunk())

        log(this.boolsManager.set(tempIdx))
        log(this.boolsManager.debugChunk())

    }

    getRandom()
    {
        return this.random
    }

} //End myGlobalPlugin

export default inGameManager