class inGameManager extends Phaser.Plugins.BasePlugin {

    constructor (pluginManager)
    {
        super(pluginManager, 'inGameManager');

        this.random = Math.random()
    }

    init ()
    {
        console.log('myGlobalPlugin is alive')
        console.dir("myGlobalPlugin here:", this)
    }

    getRandom()
    {
        return this.random
    }

} //End myGlobalPlugin

export default inGameManager