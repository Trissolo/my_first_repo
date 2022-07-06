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
        .setOrigin(0).setVisible()

        console.log(this)
        this.inventoryItems = []

        this.item = null


        for (let i = 0; i < 17; i++)
        {
            const obj = this.add.image(0, 0, "atlas0", this.names[Phaser.Math.Between(0, 2)])
            .setOrigin(0)
            .setInteractive()
            .on('pointerdown', this.placeRect)

            this.inventoryItems.push(obj)
        }

        Phaser.Actions.GridAlign(this.inventoryItems, {
            width: 9,
            height: 2,
            cellWidth: 32,
            cellHeight: 32,
            x: 19,
            y: 19
        });
    }

    placeRect(pointer,relX,relY, stopPropagation)
    {
        // console.log(pointer,relX,relY, stopPropagation)
        // console.log(this.frame.name)

        if(this.scene.noActiveItem())
        {
          this.scene.rectangle.setPosition(this.x, this.y).setVisible(true)
          this.scene.item = this
        }

        else if (this.scene.item === this)
        {
          this.scene.rectangle.setVisible(false)
          this.scene.item = null
        }

        else
        {
          console.log(`${this.frame.name} + ${this.scene.item.frame.name} = ??\nCombine Items not implemented yet.`)

          //select item
          this.scene.rectangle
            .setPosition(this.x, this.y)
            .setVisible(true);

          this.scene.item = this
        }


        // console.log("no sel:", this.scene.noActiveItem())
        // if (pointer.leftButtonDown())
        // {
        //   console.log("Left Clicked")
        // }

        // else if (pointer.rightButtonDown())
        // {
        //   console.log("Right Clicked")
        // }
    }

    noActiveItem()
    {
      return !this.item
    }

    getInv()
    {
      return this.inventoryItems
    }

    add()
    {

    }

    remove()
    {

    }

    grab()
    {

    }
}

export default Inventory