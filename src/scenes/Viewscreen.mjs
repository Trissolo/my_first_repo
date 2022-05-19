import Phaser from 'phaser';

import depthCategories from '../constants/depthCategories.mjs'
import hoverNames from '../constants/hoverNames.mjs'

class Viewscreen extends Phaser.Scene
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
          backgroundColor: "#008777"//,
          //height: 0
        }
      })
    } //end constructor

    init(passedObj)
    {
      console.clear()
      console.log("Scene: %cViewscreen", "color:yellow;font-size: 1.2em;")

      //inject stuff
      this.plugins.get('inGameManager').setupBoolsManager(this)

      //room to draw
      console.log(this.cache.json.get("room0data"))

      this.actualRoomID = 0

      this.roomData = this.cache.json.get(`room${this.actualRoomID}data`)

      this.input.setDefaultCursor('url(assets_prod/cursors/cross.cur), pointer')

      //test porta frame
      this.boolsManager.set(0)
    }

    create()
    {
      //walkManager
	
      //actionManager

      //ClickDetector! --MUST stopPropagation!--
      // this.clickDetector = new ClickDetector(this)

      //groups as layers
      // this. this.add

      //set of ALL interactive objects in this scene
      // this.allInteractive = new Set()

      //Shield!
      // this.shield

      this.coGroup = this.add.layer()
      this.abGroup = this.add.layer()
      this.dsGroup = this.add.layer()
      this.fgGroup = this.add.layer()

      this.drawScene()

      //console.log("coGROUP", this.children.list )
      this.text = this.add.bitmapText(8, 8, 'fontWhite', this.plugins.get('inGameManager').random);

      //this.events.once('prerender', this.sortSprites, this)


      this.input.on('pointerdown', () => console.log(Math.random()))

    }// end create

    drawScene()
    {
      const {atlas, background, things} = this.roomData
      this.background = this.add.image(0, 0, "atlas" + atlas, background)
        .setOrigin(0)
        .setDepth(depthCategories.bg)

        console.log("Building...", this.input)

         for (const thing of things)
         {

          if (thing.depth !== "tz")
          {
            //console.log(thing)
            
            if (thing.skipCond)
            {
              const [varType, index, expected] = thing.skipCond.split("_")
              if (this.boolsManager.bitStatus(+index) === +expected)
              {
                //console.log("Skipping:", thing.frame || thing.frameStem)
                continue
              }
            }

            const [x,y] = thing.coords.split("_")
            const elem = this.add.sprite(+x, +y, "atlas" + atlas, thing.frame || thing.frameStem + this.boolsManager.bitStatus(thing.frameSuffix))       


            if(thing.depth === "ds")
            {
              elem.setOrigin(0.5, 1)
            }

            else
            {
              elem.setOrigin(0)
                .setDepth(depthCategories[thing.depth])
            }

            elem.hoverName = thing.hoverName
            elem.setInteractive({ cursor: 'url(assets_prod/cursors/over.cur), pointer' })
            elem.on('pointerover', this.thingOvered)
            elem.on('pointerout', this.thingOut, this)

            //elem.setAlpha(.4)

            this.input.enableDebug(elem)
            elem.input.hitAreaDebug.setDepth(elem.depth + 1)

            this[thing.depth + "Group"].add(elem)

            
          }

       }
      
      
    }

    thingOvered(a)
    {
      this.scene.text.setText(hoverNames[this.hoverName])
    }

    thingOut()
    {
      this.text.setText("---")
    }

    sortSprites()
    {
      //console.log([...this.dsGroup.getChildren()])
    }

}//end class

export default Viewscreen