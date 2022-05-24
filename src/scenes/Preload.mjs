import Phaser from 'phaser';
//import boolsManager from '../plugins/VarsManager/boolsManager.mjs';


class Preload extends Phaser.Scene
{
    constructor()
    {
      super(
      {
        key: 'Preload',
        active: true,
        visible: true,
        plugins: [
          //'Clock',  //this.time
          //'DataManagerPlugin',  //this.data
          'InputPlugin',  //this.input
          'Loader',  //this.load
          //'TweenManager',  //this.tweens
          //'LightsPlugin'  //this.lights
          ],
        cameras:
        {
          backgroundColor: "#dada77",
          height: 0
        }
      })
    } //end constructor

    init(passedObj)
    {
        this.plugins.get('inGameManager').installOn(this)
        //console.log(  "Plugins SETUP:", this  )
        this.events.once("destroy", this.onDestroy, this)
    }
    preload()
    {
        console.log('Preload da Preload!')
        this.load.path = "assets_prod/"

        this.load.xml('fontWhiteXML', 'mio_font_tiny_mono.xml')

        //const ROOM_PREFIX = 
        let currentSubfolder = "atlas" 
        let fileIndex = 0

        const totalRooms = 2

        //atlas
        this.load.atlas(`atlas${fileIndex}`, `${currentSubfolder}/atlas${fileIndex}.png`, `${currentSubfolder}/atlas${fileIndex}.json`);
        

        //rooms
        currentSubfolder = "json"

        //bear in mind: the file name MUST be the same as the key in the json
        for (let i = 0, roomName; i < totalRooms; i++)
        {
            roomName = `room${i}data`//CONSTANTS.ROOM_PREFIX + i
            //this.load.once(`filecomplete-json-${roomName}`, this.processFile, this)
            //console.log(roomName, `json/${roomName}.json`)
            this.load.json(roomName, `${currentSubfolder}/${roomName}.json`)
        }
        
        //this.load.on('complete', this.loadGame, this)
    }

    create()
    {
        //console.log("Preload scene: create", this.cache)

        this.add.image(10,8,"atlas0", "room1bg").setOrigin(0)
        Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'fontWhite', 'atlas0', 'mio_font_tiny_mono', 'fontWhiteXML');

        const str = '(tEST)WTRPyxv^}{! - Wall -';

        this.text = this.add.bitmapText(20, 100, 'fontWhite', this.plugins.get('inGameManager').random+ str);


        // this.boolsManager.boolsContainer[0] = 37
         let tempIdx = 3

        // this.boolsManager.toggle(tempIdx)

        // this.boolsManager.toggle(tempIdx)

        // this.boolsManager.set(tempIdx)

        //this.boolsManager.clear(tempIdx)

        this.text.setTintFill(0xababdb)
        this.text.setCharacterTint(7 - tempIdx, 1, true, 0xff0000)

        this.text.setText(this.boolsManager.debugChunk() )


        this.add.image(16, 120, 'atlas0', "singlePixel")
          .setOrigin(0)
          .setScale(30)
          .setAlpha(0.7)

          this.input.keyboard.on('keydown-Z', this.pressedZ, this)
    }// end create

    pressedZ()
    {
        this.scene.start('Viewscreen')
    }

    onDestroy()
    {
        this.boolsManager = undefined
    }

}//end class

export default Preload