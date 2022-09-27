import Phaser from 'phaser';
//import boolsManager from '../plugins/VarsManager/boolsManager.mjs';

// import PMStroll from "../PolyMapStroll/PMStroll.js"

import cardinalsPoints from '../constants/cardinalPoints.mjs';


export default class Preload extends Phaser.Scene
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

        this.cache.addCustom('floors')
        // this.cache.custom.floors.events.on('add', this.countPolyMaps, this)

        // console.log("CacheFloors:", PMStroll.buildSinglePolyMap, this.cache.custom.floors)
    }
    preload()
    {
        console.log('Preload da Preload!')
        this.load.path = "assets_prod/"

        this.load.xml('fontWhiteXML', 'mio_font_tiny_mono.xml')

        this.load.atlas(`atlasChars`, `atlas/atlasCharacters.png`, `atlas/atlasCharacters.json`);

        //const ROOM_PREFIX = 
        let currentSubfolder = "atlas" 
        let fileIndex = 0

        const totalRooms = 2

        //atlas for rooms
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

        //floors?
        this.load.json('floors', `${currentSubfolder}/floors.json`)

        //this.load.once('filecomplete-json-floors', this.buildFloors, this) // (a,b,c) => console.log("Floors:", a, b, c, PMStroll))
        
        //this.load.on('complete', this.loadGame, this)
    }

    create()
    {
        //console.log("Preload scene: create", this.cache)

        // this.add.image(10,8,"atlas0", "room1bg").setOrigin(0)

        // generate Bitmap Text
        Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'fontWhite', 'atlas0', 'mio_font_tiny_mono', 'fontWhiteXML');

        const str = 'Press Z to start';

        this.text = this.add.bitmapText(20, 100, 'fontWhite', str);


        // this.boolsManager.boolsContainer[0] = 37
         let tempIdx = 3

        // this.boolsManager.toggle(tempIdx)

        // this.boolsManager.toggle(tempIdx)

        // this.boolsManager.set(tempIdx)

        //this.boolsManager.clear(tempIdx)

        // this.text.setTintFill(0xababdb)
        // this.text.setCharacterTint(7 - tempIdx, 1, true, 0xff0000)

        // this.text.setText(this.boolsManager.debugChunk() )



        // generating anims (momentarily in this scene, just as test)

        this.anims.on('add', this.testAnim, this)
        this.generateRobotAnims()


        this.add.image(16, 120, 'atlas0', "singlePixel")
          .setOrigin(0)
          .setScale(30)
          .setAlpha(0.7);

          this.add.image(0, 0, 'atlasChars', "__BASE" )
          .setOrigin(0)
          .setAlpha(0.7);

        // test anim as
        this.anims.create({key: 'blinkingButton', frames: [ {
            key: "atlas0",
            frame: "button0",
            duration: 555
          },
          {
            key: "atlas0",
            frame: "button1",
            duration: 222
          }],
          repeat: -1
        });

        //this.add.sprite(20, 280).play('blinkingButton')

        this.input.keyboard.once('keydown-Z', this.pressedZ, this)
    }// end create

    // harcoded
    generateRobotAnims(prefix = 'robot_')
    {
      const { anims, genFrames } = this

      // robot walk anim

      // keys are something like:
      // robot_walk_W
      // robot_walk_SW
      // robot_walk_NE
      // robot_walk_S

      for (const cp of cardinalsPoints)
      {
        anims.create(  {
          key: `${prefix}walk_${cp}`,
          frames: this.genFrames(cp),
          skipMissedFrames: false,
          repeat: -1,
          frameRate: 8
        })

        //test interact anims
        anims.create(  {
          key: `${prefix}interact_${cp}`,
          frames: [
            {key: 'atlas0', frame: `${prefix}${cp}_interactCenter_0`, duration: 60} //,
            // {key: 'atlas0', frame: `${prefix}${cp}_walk_0`, duration:60}
            ],
          skipMissedFrames: false,
          repeat: 0,
          frameRate: 8
        })

      }

      // robot rotation anim
      // key: robot_rotate
      anims.create({
        key: `${prefix}rotate`,
        frames: cardinalsPoints.map(el => ({ key: "atlas0", frame: `${prefix}${el}_walk_0` })),
        skipMissedFrames: false,
        repeat: -1,
        frameRate: 10
      })
    }

    genFrames(cardinal, textureKey = "atlas0", name = "robot_", action = "_walk_")
    {
      const ary = []

      for ( const frNum of Phaser.Utils.Array.NumberArray(0, 3) )
      {
        ary.push({key: textureKey, frame: `${name}${cardinal}${action}${frNum}`})
      }

      return ary
    }

    testAnim(key, animation)
    {
      const {Between} = Phaser.Math
      this.add.sprite(Between(20, 280), Between(30, 100)).play(key)
      // console.log(`Playing: ${key}`)
    }

    pressedZ()
    {
        this.scene.start('Viewscreen')
        this.scene.launch('Inventory')
    }

    onDestroy()
    {
        this.boolsManager = undefined
    }

    // buildFloors(a, b, aryFloors)
    // {
    //   for (const floorData of aryFloors)
    //   {
    //     console.log(floorData.nome, floorData, floorData.coords)
    //     this.cache.custom.floors.add(floorData.nome, PMStroll.buildSinglePolyMap(floorData.coords))
    //   }

    //   console.log(this.cache.custom.floors)
    // }

    // countPolyMaps(a,b,c)
    // {
    //   console.log("Added", a, b, c)
    // }

}//end class
