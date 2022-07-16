import Phaser from 'phaser';

const ATLAS_NAME = "atlas0"

const TEST_ALL_ITEMS = [
  {
    "id": 0,
    "frameName": "obj_card1",
    "name": "ID Card Lev. A",
    "desc": ""
  },
  {
    "id": 1,
    "frameName": "obj_card2",
    "name": "ID Card Lev. B",
    "desc": ""
  },
  {
    "id": 2,
    "frameName": "obj_wrench",
    "name": "Wrench",
    "desc": ""
  },
  {
    "id": 3,
    "frameName": "GUImusic_off",
    "name": "Icon Note off",
    "desc": ""
  },
  {
    "id": 4,
    "frameName": "GUImusic_on",
    "name": "Icon Note on",
    "desc": ""
  },
  {
    "id": 5,
    "frameName": "GUIsfx_off",
    "name": "Icon Speaker off",
    "desc": ""
  },
  {
    "id": 6,
    "frameName": "GUIsfx_on",
    "name": "Icon Speaker on",
    "desc": ""
  },
  {
    "id": 7,
    "frameName": "inventory_arrows",
    "name": "Arrows",
    "desc": ""
  },
  {
    "id": 8,
    "frameName": "button0",
    "name": "Pulsante spento",
    "desc": ""
  },
  {
    "id": 9,
    "frameName": "button1",
    "name": "Pulsante acceso",
    "desc": "" 
  },
  {
  "id": 10,
  "frameName": "crateLid0",
  "name": "CoperchioAS",
  "desc": ""
  }

]

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

        // this.names = ["obj_card1", "obj_card2", "obj_wrench", "GUImusic_off", "GUImusic_on", "GUIsfx_off", "GUIsfx_on", "inventory_arrows"]//"obj_wrench","obj_wrench", "obj_wrench","obj_card1", "obj_card2", "obj_wrench","obj_wrench","obj_wrench", "obj_wrench","obj_card1", "obj_card2", "obj_wrench","obj_wrench","obj_wrench", "obj_wrench","obj_card1", "obj_card2", "obj_wrench","obj_wrench","obj_wrench", "obj_wrench","obj_card1", "obj_card2", "obj_wrench","obj_wrench","obj_wrench", "obj_wrench","obj_card1", "obj_card2", "obj_wrench","obj_wrench","obj_wrench", "obj_wrench", "obj_card1"]
        
        // console.log("LENGTH NAMES", this.names.length)
    }

    create()
    {

      // items in a row (will be 9)
      this.gridWidth = 4

      // max rows allowed
      this.gridHeight = 4

      // hardcoded grid offset in pixel
      this.gridOffset = 19

      // length of the side (in pixels) of the rectangular area of each item
      this.cellHeight = 32
      
      this.doubleSize = this.gridWidth + this.gridWidth


      this.gridAlignOptions = {
        width: this.gridWidth,
        height: this.gridHeight,
        cellWidth: this.cellHeight,
        cellHeight: this.cellHeight,
        x: this.gridOffset, // + 32,
        y: this.gridOffset//,
        // position: 0
      }

      // marker for selected item, and scroll arrows

      this.marker = this.add.image(0, 0, ATLAS_NAME, "inventory_selected_item")
        .setOrigin(0)
        .setVisible();

      this.arrowUp = this.add.image(286, 0, ATLAS_NAME, "inventory_arrow_up_1")
        .setScrollFactor(0)
        .setOrigin(0)
        .setInteractive()
        .on('pointerdown', this.scrollCamera)
        .setVisible();

      this.arrowDown = this.add.image(286, 32, ATLAS_NAME, "inventory_arrow_up_1")
        .setScrollFactor(0)
        .setOrigin(0)
        .setScale(1, -1)
        .setState(1)
        .setInteractive()
        .on('pointerdown', this.scrollCamera)
        .setVisible();


      // this.tempInventory = new Set([0, 1, 2,
      //                               3, 4, 5,
      //                               6, 7])//, 7, 8,
      //                               // 9 ])// 10,11,12,13,14,15,16,17])//,18,19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30])

      this.owner = "robot"



      this.renderableItems = []

      this.itemGroup = this.add.group({createCallback: function (thing)
        {
          thing.setInteractive({cursor: 'url(assets_prod/cursors/over.cur), pointer'})
          .setTexture(ATLAS_NAME, "singlePixel")
          // .setFrame()
          .setVisible(false)
          .setOrigin(0)
          .on('pointerdown', this.scene.onClickedItem)
        }
      })
    
      this.showItems()

      this.setArrowsVisibility()

    }

    scrollCamera()
    {
      // this.scene.cameras.main.scrollY += this.scene.cellHeight * (this.state === 0 ? -1 : 1)

      this.state === 0 ? this.scene.cameras.main.scrollY -= this.scene.cellHeight : this.scene.cameras.main.scrollY += this.scene.cellHeight

      this.scene.setArrowsVisibility()
    }

    setArrowsVisibility()
    {
      console.log("EXISTING COLS:", this.exceedingColumns, "Size:", this.getInv().size)

      this.arrowUp.setVisible(this.cameras.main.scrollY > 0)

      this.arrowDown.setVisible( (this.getInv().size > this.doubleSize) && (this.cameras.main.scrollY < this.exceedingColumns * this.cellHeight))
      
      // (this.exceedingColumns - 2) * this.cellHeight)//(this.cameras.main.scrollY / this.cellHeight) < (this.exceedingColumns ))
    }

    placeCamera(forceTop = true)
    {
      if (forceTop)
      {
        this.cameras.main.scrollY = 0
      }
      else
      {
        this.cameras.main.scrollY = this.exceedingColumns * this.cellHeight
      }

      this.setArrowsVisibility()
    }

    showItems(forceTop)
    {
      this.disableAll()
      
      //prepare renderable items array
      for (const id of this.getInv())
      {
        const item = this.itemGroup.get(0, 0, ATLAS_NAME)
          // .setFrame(this.names[id])
          .setFrame(TEST_ALL_ITEMS[id].frameName)
          .setState(id)

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

    onClickedItem(pointer,relX, relY, stopPropagation)
    {
        // console.log(pointer,relX, relY, stopPropagation)
        console.log("Item:", TEST_ALL_ITEMS[this.state].name, `-|-  Id: ${this.state}`)

        if (this.scene.noActiveItem())
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

    get exceedingColumns()
    {
      return Math.max(Math.floor( (this.getInv().size - 1) / this.gridWidth ) - 1, 0)
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

    addItem(id, ownerId = this.owner)
    {
      // const item = this.itemGroup.get(0, 0)
      // .setFrame(this.names[id])
      // .setVisible(true)
      // .setActive(true)

      //unselect?
      this.setNoneSelect()

      this.getInv(ownerId).add(id)

      this.showItems(false)
    }

    removeItem(id, ownerId = this.owner)
    {
      this.setNoneSelect()

      this.getInv(ownerId).delete(id)


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
            .setState()
       }
      }

      this.renderableItems.length = 0

      return this
    }
}

export default Inventory
