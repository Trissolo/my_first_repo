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

        this.names = ["obj_card1", "obj_card2", "obj_wrench", "GUImusic_off", "GUImusic_on", "GUIsfx_off", "GUIsfx_on", "inventory_arrows"]//"obj_wrench","obj_wrench", "obj_wrench","obj_card1", "obj_card2", "obj_wrench","obj_wrench","obj_wrench", "obj_wrench","obj_card1", "obj_card2", "obj_wrench","obj_wrench","obj_wrench", "obj_wrench","obj_card1", "obj_card2", "obj_wrench","obj_wrench","obj_wrench", "obj_wrench","obj_card1", "obj_card2", "obj_wrench","obj_wrench","obj_wrench", "obj_wrench","obj_card1", "obj_card2", "obj_wrench","obj_wrench","obj_wrench", "obj_wrench", "obj_card1"]
        console.log(this.names.length, "LENGTH NAMES")
    }

    create()
    {

      // items in a row
      this.gridWidth = 3

      // max rows allowed
      this.gridHeight = 4

      // hardcoded grid offset in pixel
      this.gridOffset = 19

      // length of the side (in pixels) of the rectangular area of each item
      this.cellHeight = 32
      
      // this.cameraStep = 16

      this.doubleSize = this.gridWidth + this.gridWidth


      this.gridAlignOptions = {
        width: this.gridWidth,
        height: this.gridHeight,
        cellWidth: this.cellHeight,
        cellHeight: this.cellHeight,
        x: this.gridOffset,
        y: this.gridOffset,
        position: 0
    }

      // marker for selected item, and scroll arrows

      this.marker = this.add.image(0, 0, "atlas0", "inventory_selected_item")
        .setOrigin(0)
        .setVisible();

      this.arrowUp = this.add.image(286, 0, "atlas0", "inventory_arrow_up_1")
        .setScrollFactor(0)
        .setOrigin(0)
        .setInteractive()
        .on('pointerdown', this.scrollCamera)
        .setVisible();

      this.arrowDown = this.add.image(286, 32, "atlas0", "inventory_arrow_up_1")
        .setScrollFactor(0)
        .setOrigin(0)
        .setScale(1, -1)
        .setState(1)
        .setInteractive()
        .on('pointerdown', this.scrollCamera)
        .setVisible();


      this.tempInventory = new Set([0, 1, 2,
                                    3, 4, 5,
                                    6, 7])//, 7, 8,
                                    // 9 ])// 10,11,12,13,14,15,16,17])//,18,19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30])

      this.owner = "robot"



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

      this.scene.setArrowsVisibility()
    }

    setArrowsVisibility()
    {
      this.arrowUp.setVisible(this.cameras.main.scrollY > 0)

      this.arrowDown.setVisible( (this.getInv(this.owner).size > this.doubleSize) && (this.cameras.main.scrollY < this.existingColumns * this.cellHeight))
      
      // (this.existingColumns - 2) * this.cellHeight)//(this.cameras.main.scrollY / this.cellHeight) < (this.existingColumns ))
    }

    placeCamera(forceTop = true)
    {
      if (forceTop)
      {
        this.cameras.main.scrollY = 0
      }
      else
      {
        this.cameras.main.scrollY = this.existingColumns * this.cellHeight
      }

      this.setArrowsVisibility()
    }

    showItems(forceTop)
    {
      this.disableAll()
      
      //prepare renderable items array
      for (const id of this.getInv(this.owner))
      {
        const item = this.itemGroup.get(0, 0, "atlas0")
          .setFrame(this.names[id])
          .setVisible(true)
          .setActive(true)
          .setInteractive()

        item.input.hitArea.setSize(26, 26)

        this.renderableItems.push(item)
      }

      this.alignItems()

      this.placeCamera(forceTop)

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
          this.scene.marker
            .setPosition(this.x, this.y)
            .setVisible(true);

          this.scene.item = this
        }

        else if (this.scene.item === this)
        {

          this.scene.setNoneSelect()

        }

        else
        {
          console.log(`${this.frame.name} + ${this.scene.item.frame.name} = ??\nCombine Items not implemented yet.`)

          //select item
          this.scene.marker
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

    get existingColumns()
    {
      return Math.max(Math.floor( (this.getInv(this.owner).size - 1) / this.gridWidth ) - 1, 0)
    }

    noActiveItem()
    {
      return !this.item
    }

    setNoneSelect()
    {
      this.item = null
      this.marker.setVisible(false)
    }

    getInv(name = this.owner)
    {
      // return this.tempInventory
      return this.igPlug.characters.get(name).inv
    }

    addItem(id)
    {
      // const item = this.itemGroup.get(0, 0)
      // .setFrame(this.names[id])
      // .setVisible(true)
      // .setActive(true)

      //unselect?
      this.setNoneSelect()

      this.getInv(this.owner).add(id)

      this.showItems(false)
    }

    removeItem(id)
    {
      this.setNoneSelect()

      this.getInv(this.owner).delete(id)


      // this.disableAll()

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
