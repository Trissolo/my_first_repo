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

        this.boolsManager.boolsContainer[0] = 8

        // log( `%c ${this.boolsManager.readBit(0 , 0)} `, myColor)
        // log( `%c ${this.boolsManager.readBit(1 , 0)} `, myColor)
        // log( `%c ${this.boolsManager.readBit(2 , 0)} `, myColor)
        // log( `%c ${this.boolsManager.readBit(3 , 0)} `, myColor)
        // log( `%c ${this.boolsManager.readBit(4 , 0)} `, myColor)
        log(this.boolsManager.debugChunk())

        this.boolsManager.toggle(3)
        log(this.boolsManager.isActive(3))
        log(this.boolsManager.debugChunk())

        this.boolsManager.toggle(3)
        log(this.boolsManager.isActive(3))
        log(this.boolsManager.debugChunk())

        this.boolsManager.toggle(3)
        log(this.boolsManager.isActive(3))
        log(this.boolsManager.debugChunk())


        // log( `%c ${this.boolsManager.readBit(2 , 0)} `, myColor, 2)
        // log(this.boolsManager.debugChunk())

        // this.boolsManager.setActive(2)
        // this.boolsManager.setToZero(1)
        // log(this.boolsManager.debugChunk())
        // log( `%c ${this.boolsManager.readBit(1 , 0)} `, myColor, 1)
        // log( `%c ${this.boolsManager.readBit(2 , 0)} `, myColor, 2)
        // log(this.boolsManager.boolsContainer[0])

        // log("Testing Toggle:")
        // this.boolsManager.toggle(6)
        // log( `%c ${this.boolsManager.readBit(6 , 0)} `, myColor, 6)
        // log( `%c ${this.boolsManager.bitStatus(6 , 0)} `, myColor, 6)
        // log(this.boolsManager.debugChunk())
        // this.boolsManager.toggle(6)
        // log( `%c ${this.boolsManager.readBit(6 , 0)} `, myColor, 6)
        // log( `%c ${this.boolsManager.bitStatus(6 , 0)} `, myColor, 6)
        // log(this.boolsManager.debugChunk())
        // this.boolsManager.toggle(6)
        // log( `%c ${this.boolsManager.readBit(6 , 0)} `, myColor, 6)
        // log( `%c ${this.boolsManager.bitStatus(6 , 0)} `, myColor, 6)
        // log(this.boolsManager.debugChunk())

/*
        console.log(this.boolsManager.isBitActive(4))
        console.log("Toggle 4", this.boolsManager.toggleBit(4))
        console.log(this.boolsManager.debugChunk())
        console.log("Toggle 4", this.boolsManager.toggleBit(4))
        console.log(this.boolsManager.debugChunk())
        console.log("Toggle 4", this.boolsManager.toggleBit(4))
        console.log(this.boolsManager.debugChunk())
        console.log("Toggle 4", this.boolsManager.toggleBit(4))
        console.log(this.boolsManager.debugChunk())
        
        //console.log(typeof this.boolsManager.toggleBit(4))
        console.log(this.boolsManager.isBitActive(4))
        console.log(this.boolsManager.checkBool("b_4_1"))

        console.log(this.boolsManager.debugChunk())

        console.log(this.boolsManager.isBitActive(2))
        console.log(this.boolsManager.bitStatus(2))
        this.boolsManager.toggleBit(2)
        console.log(this.boolsManager.bitStatus(2))
      */
    }

    getRandom()
    {
        return this.random
    }

} //End myGlobalPlugin

export default inGameManager