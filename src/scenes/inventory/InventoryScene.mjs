import Phaser from 'phaser';

class Inventory extends Phaser.Scene
{
    constructor()
    {
      super(
      {
        key: 'Inventory',
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
          y: 136,
          height: 64
        }
      })
    } //end constructor

    init()
    {
        // garbage
        console.log("Inventory Scene here!")

        this.plugins.get('inGameManager').installOn(this)

        this.names = ["obj_card1", "obj_card2", "obj_wrench"]
    }

    create()
    {
        this.rectangle = this.add.image(0, 0, "atlas0", "inventory_selected_item")
        .setOrigin(0)

        console.log(this)
        this.inventory = []

        for (let i = 0; i < 17; i++)
        {
            const obj = this.add.image(0, 0, "atlas0", this.names[Phaser.Math.Between(0, 2)])
            .setOrigin(0)
            .setInteractive()
            .on('pointerdown', this.placeRect)
            // .setScale(-1);

            this.inventory.push(obj)
        }

        Phaser.Actions.GridAlign(this.inventory, {
            width: 9,
            height: 2,
            cellWidth: 32,
            cellHeight: 32,
            x: 19,
            y: 19
        });
    }

    placeRect(a,b,c)
    {
        console.log(a,b,c)
        console.log(this.scene.rectangle)
        this.scene.rectangle.setPosition(this.x, this.y)
    }
}

export default Inventory