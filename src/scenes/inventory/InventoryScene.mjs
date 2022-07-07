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

        this.names = ["obj_card1", "obj_card2", "obj_wrench","obj_wrench","obj_wrench", "obj_wrench", "obj_card1"]
    }

    create()
    {

      this.gridWidth = 2

      this.gridHeight = 4

      this.gridOffset = 19

      this.cellHeight = 32
      
      this.cameraStep = 16


      this.rectangle = this.add.image(0, 0, "atlas0", "inventory_selected_item")
        .setOrigin(0)
        .setVisible();

      this.arrowUp = this.add.image(256, 0, "atlas0", "inventory_arrow_up_1")
        .setScrollFactor(0)
        .setOrigin(0)
        .setInteractive()
        .on('pointerdown', this.arrowUpScroll, this)
        .setVisible();

      this.arrowDown = this.add.image(256, 32, "atlas0", "inventory_arrow_up_1")
        .setScrollFactor(0)
        .setOrigin(0)
        .setScale(1, -1)
        .setInteractive()
        .on('pointerdown', this.arrowDownScroll, this)
        .setVisible();

    
      console.log(this)


      this.tempInventory = new Set([0, 2, 1, 3, 4, 5, 6])

      this.tempOwner = "robot"


      this.renderableItems = []

      this.itemGroup = this.add.group({createCallback: function (thing)
        {
          thing.setInteractive({cursor: 'url(assets_prod/cursors/over.cur), pointer'})
          .setTexture("atlas0", "singlePixel")
          // .setFrame()
          .setVisible(false)
          .setOrigin(0)
          .on('pointerdown', this.scene.placeRect)
        }
      })

      this.setArrowsVisibility()

      this.showItems()

      //this.item = null


      // for (let i = 0; i < 17; i++)
      // {
      //     const obj = this.add.image(0, 0, "atlas0", this.names[Phaser.Math.Between(0, 2)])
      //     .setOrigin(0)
      //     .setInteractive()
      //     .on('pointerdown', this.placeRect)

      //     this.tempInventory.push(obj)
      // }

      // Phaser.Actions.GridAlign(this.tempInventory, {
      //     width: 9,
      //     height: 2,
      //     cellWidth: 32,
      //     cellHeight: 32,
      //     x: 19,
      //     y: 19
      // });
    }

    arrowUpScroll()
    {
      this.cameras.main.scrollY -= this.cellHeight

      this.setArrowsVisibility()
      // this.arrowUp.setVisible(this.cameras.main.scrollY !== 0)

      // console.log(this.cameras.main.scrollY / this.cameraStep)
      // console.log(Math.floor(this.tempInventory.size / this.gridWidth))

      // this.arrowDown.setVisible((this.cameras.main.scrollY / this.cameraStep) < (Math.floor(this.tempInventory.size / this.gridWidth) ))
    }

    arrowDownScroll()
    {
      this.cameras.main.scrollY += this.cellHeight

      this.setArrowsVisibility()
      // this.arrowUp.setVisible(this.cameras.main.scrollY !== 0)

      // console.log(this.cameras.main.scrollY / this.cameraStep)
      // console.log(Math.floor(this.tempInventory.size / this.gridWidth))

      
    }

    setArrowsVisibility()
    {
      this.arrowUp.setVisible(this.cameras.main.scrollY !== 0)
      this.arrowDown.setVisible((this.cameras.main.scrollY / this.cameraStep) < (Math.floor(this.tempInventory.size / this.gridWidth) ))
    }

    showItems()
    {
      this.renderableItems.length = 0

      // this.itemGroup.children.iterate(function (thing)
      // {
      //   // group.killAndHide(thing)
      //   thing.disableInteractive()
      //     .setActive(false)
      //     .setVisible(false)
      //     // .off('pointerover')//, thing.scene.thingOvered)
      //     // .off('pointerout')//, thing.scene.thingOut)
      //     // .off('pointerdown')
      // })

      for (const id of this.getInv())
      {
        const item = this.itemGroup.get(0, 0, "atlas0")
        .setFrame(this.names[id])
        .setVisible(true)
        .setActive(true)
        .setInteractive()

        item.input.hitArea.setSize(26, 26)
        // console.log(item.input.hitArea)

        this.renderableItems.push(item)
      }

      console.dir(this.renderableItems)

      
      this.alignItems()

      // this.arrowUp.setVisible(this.cameras.main.scrollY !== 0)

    }

    alignItems()
    {
      Phaser.Actions.GridAlign(this.renderableItems, {
        width: this.gridWidth,
        height: this.gridHeight,
        cellWidth: this.cellHeight,
        cellHeight: this.cellHeight,
        x: this.gridOffset,
        y: this.gridOffset
    });
    }

    placeRect(pointer,relX, relY, stopPropagation)
    {
        // console.log(pointer,relX, relY, stopPropagation)
        console.log("Item:", this.frame.name)

        if(this.scene.noActiveItem())
        {
          this.scene.rectangle
            .setPosition(this.x, this.y)
            .setVisible(true);

          this.scene.item = this
        }

        else if (this.scene.item === this)
        {
          // this.scene.rectangle.setVisible(false)

          // this.scene.item = null
          this.scene.setNoneSelect() // .call(this.scene)
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

    get item()
    {
      return this.igPlug.activeInventoryItem
    }

    set item(value)
    {
      return this.igPlug.activeInventoryItem = value
    }

    noActiveItem()
    {
      return !this.item
    }

    setNoneSelect()
    {
      this.item = null
      this.rectangle.setVisible(false) // visible(false)
    }

    getInv()
    {
      return this.tempInventory
    }

    addItem(id)
    {
      // const item = this.itemGroup.get(0, 0)
      // .setFrame(this.names[id])
      // .setVisible(true)
      // .setActive(true)

      //unselect?
      this.setNoneSelect()

      this.getInv().add(id) // .push(id)

      this.showItems()
    }

    removeItem(id)
    {
      this.setNoneSelect()

      this.getInv().delete(id) // .push(id)


      //clear all items... It'is right? And this is the correct place?
      this.itemGroup.children.iterate(function (thing)
      {
        // group.killAndHide(thing)
        thing.disableInteractive()
          .setActive(false)
          .setVisible(false)
          // .off('pointerover')//, thing.scene.thingOvered)
          // .off('pointerout')//, thing.scene.thingOut)
          // .off('pointerdown')
      })

      this.showItems()
    }

    grab()
    {

    }
}

export default Inventory