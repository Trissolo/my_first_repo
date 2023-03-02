import studioEvents from "../eventEmitter/StudioEvents.mjs";

export default class StudioPhaser extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    // preload ()
    // {
        
    // }

    create()
    {
        this.add.rectangle(10,10,20,80,0x6578a9).setOrigin(0);
    }
}
