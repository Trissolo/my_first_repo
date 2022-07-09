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

        this.names = ["obj_card1", "obj_card2", "obj_wrench","obj_wrench","obj_wrench", "obj_wrench","obj_card1", "obj_card2", "obj_wrench","obj_wrench","obj_wrench", "obj_wrench","obj_card1", "obj_card2", "obj_wrench","obj_wrench","obj_wrench", "obj_wrench","obj_card1", "obj_card2", "obj_wrench","obj_wrench","obj_wrench", "obj_wrench","obj_card1", "obj_card2", "obj_wrench","obj_wrench","obj_wrench", "obj_wrench","obj_card1", "obj_card2", "obj_wrench","obj_wrench","obj_wrench", "obj_wrench", "obj_card1"]
        console.log(this.names.length, "LENGTH NAMES")
    }

    create()
    {

      this.gridWidth = 9

      this.gridHeight = 4

      this.gridOffset = 19

      this.cellHeight = 32
      
      this.cameraStep = 16

      this.gridAlignOptions = {
        width: this.gridWidth,
        height: this.gridHeight,
        cellWidth: this.cellHeight,
        cellHeight: this.cellHeight,
        x: this.gridOffset,
        y: this.gridOffset
    }


      this.rectangle = this.add.image(0, 0, "atlas0", "inventory_selected_item")
        .setOrigin(0)
        .setVisible();

      this.arrowUp = this.add.image(286, 0, "atlas0", "inventory_arrow_up_1")
        .setScrollFactor(0)
        .setOrigin(0)
        .setInteractive()
        // .on('pointerdown', this.arrowUpScroll, this)
        .on('pointerdown', this.scrollCamera)
        .setVisible();

      this.arrowDown = this.add.image(286, 32, "atlas0", "inventory_arrow_up_1")
        .setScrollFactor(0)
        .setOrigin(0)
        .setScale(1, -1)
        .setState(1)
        .setInteractive()
        // .on('pointerdown', this.arrowDownScroll, this)
        .on('pointerdown', this.scrollCamera)
        .setVisible();

    
      console.log(this)


      this.tempInventory = new Set([1, 0, 2, 3, 4, 5, 6,7,8,9,10,11,12,13,14,15,16,17,18,19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30])

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
    
      this.showItems()

      this.setArrowsVisibility()

    }

    scrollCamera()
    {
      this.scene.cameras.main.scrollY += this.scene.cellHeight * (this.state === 0 ? -1 : 1)

      console.log(this.state, this.scene.cameras.main.scrollY, this)

      this.scene.setArrowsVisibility()
    }

    setArrowsVisibility()
    {
      this.arrowUp.setVisible(this.cameras.main.scrollY !== 0)
      console.log("Scrolly / cellHeight", this.cameras.main.scrollY / this.cellHeight)
      console.log("Inv size / gridWidth", Math.floor(this.getInv().size / this.gridWidth)-1)
      this.arrowDown.setVisible((this.cameras.main.scrollY / this.cellHeight) < (Math.floor(this.getInv().size / this.gridWidth) -1))
    }

    placeCamera()
    {
      console.log("PREV:", this.cameras.main.scrollY, (Math.floor(this.getInv().size / this.gridWidth) - 1))

      if (this.getInv().size > this.gridWidth + this.gridWidth)
      {
        this.cameras.main.scrollY = Math.max(
          (Math.floor(this.getInv().size / this.gridWidth) - 1) * this.cellHeight, 0
        )
      }
      else
      {
        this.cameras.main.scrollY = 0
      }
      console.log("Dopo CAMERAY:", this.cameras.main.scrollY)

      this.setArrowsVisibility()

    }

    showItems()
    {
      this.disableAll()
      
      //prepare renderable items array
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

      this.alignItems()

      this.placeCamera()

    }

    alignItems()
    {
      Phaser.Actions.GridAlign(this.renderableItems, this.gridAlignOptions);
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


      this.disableAll()
      // //clear all items... It'is right? And this is the correct place?
      // this.itemGroup.children.iterate(function (item)
      // {
      //   // group.killAndHide(thing)
      //   item.disableInteractive()
      //     .setActive(false)
      //     .setVisible(false)
      //     // .off('pointerover')//, thing.scene.thingOvered)
      //     // .off('pointerout')//, thing.scene.thingOut)
      //     // .off('pointerdown')
      // })

      this.showItems()
    }

    grab()
    {

    }

    disableAll(hard = true)
    {
      if (hard)
      {
        for (const item of this.renderableItems)
        {
          item
            .disableInteractive()
            .setActive(false)
            .setVisible(false)
       }
      }

      this.renderableItems.length = 0

      return this
    }
}

export default Inventory
