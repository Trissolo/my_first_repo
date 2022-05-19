import Phaser from 'phaser';

import depthCategories from '../constants/depthCategories.mjs'

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
          backgroundColor: "#000077",
          height: 0
        }
      })
    } //end constructor

    init(passedObj)
    {
      console.clear()
      console.log("Scene: %cViewscreen", "color:yellow;font-size: 1.2em;")

      this.plugins.get('inGameManager').setupBoolsManager(this)

      console.log(this.cache.json.get("room0data"))

      this.actualRoomID = 0

      this.roomData = this.cache.json.get(`room${this.actualRoomID}data`)

      //test porta frame
      this.boolsManager.set(2)
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
      this.abGroup = this.add.layer()
      this.dsGroup = this.add.layer()
      this.fgGroup = this.add.layer()

      this.drawScene()

      //console.log("coGROUP", this.children.list )
      this.events.once('prerender', this.sortSprites, this)

    }// end create

    drawScene()
    {
      const {atlas, background, things} = this.roomData
      this.background = this.add.image(0, 0, "atlas" + atlas, background)
        .setOrigin(0)
        .setDepth(depthCategories.bg)

        console.log("Building...")

        for ( const thing of things )
        {
          if (thing.depth !== "tz")
          {
            //console.log(thing)

            
            if (thing.skipCond)
            {
              //console.log(  this.boolsManager.debugChunk() )
              const [varType, index, expected] = thing.skipCond.split("_")
              //console.log("Skip:", this.boolsManager.bitStatus(+index))
              if (this.boolsManager.bitStatus(+index) === +expected)
              {
                //console.log("Skipping:", thing.frame || thing.frameStem)
                continue
              }
            }

            const [x,y] = thing.coords.split("_")
            const elem = this.add.image(x, y, "atlas"+atlas, thing.frame || thing.frameStem + this.boolsManager.bitStatus(thing.frameSuffix))       

            if(thing.depth === "ds")
            {
              //console.log(y)
              elem.setOrigin(0.5, 1)
                //.setDepth(y)
            }

            else
            {
              elem.setOrigin(0)
                .setDepth(depthCategories[thing.depth])
                //console.log("DEPTH:", depthCategories[thing.depth])
            }

            this[thing.depth + "Group"].add(elem)
            


          }
        }
      
      
    }

    sortSprites()
    {
      //console.log([...this.dsGroup.getChildren()])
    }

}//end class

export default Viewscreen