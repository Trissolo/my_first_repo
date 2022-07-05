import Phaser from 'phaser';

class Inventory extends Phaser.Scene
{
    constructor()
    {
      super(
      {
        key: 'Viewscreen',
        active: false,
        visible: false,
        plugins: [
          'Clock',  //this.time
          //'DataManagerPlugin',  //this.data
          'InputPlugin'//,  //this.input
          //'Loader',  //this.load
          //'TweenManager',  //this.tweens
          //'LightsPlugin'  //this.lights
          ],
        cameras:
        {
          backgroundColor: "#008777",
          height: 128
        }
      })
    } //end constructor

    init()
    {

    }

    create()
    {
        
    }
}

export default Inventory