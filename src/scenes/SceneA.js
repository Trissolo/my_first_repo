import Phaser from 'phaser';
//import { Math as PhaserMath, Geom as PhGeom}  from "phaser";
//import CustomSprite from '../prefabs/customSprite'
import PMStroll from '../PolyMapStroll/PMStroll'
//import logoImg from './assets/logo.png';

export default class SceneA extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        //this.load.image('logo', '/assets_prod/logo.png')
        this.load.json("polyOne", "assets_prod/poly.json")     
    }
      
    create ()
    {
        //Player
        this.player = this.add.triangle(190, 120, 4, 16, 0, 0, 8, 0, 0x88bb88)//0xdb78ca)
        .setOrigin(0.5, 1)
        .setDepth(2);

        // a circle, just to visualize the end point
        this.dest = this.add.circle(40, 90, 2, 0xea5d7c).setDepth(2)

        //Data for polygonMap:
        const polyTest= this.cache.json.get('polyOne')
        console.dir("Loaded polyData", polyTest)//, polyTest.firstPoly.polyVertices[1])

        //Polygon Map Manager:
        this.pmsManager = new PMStroll(this, true)

        //Poly map test
        this.testMap = this.pmsManager.buildSinglePolyMap(polyTest.firstPoly)

        //debug stuff:
        //print polygonalMap
        this.pmsManager.debug.printPolygonMap(this.testMap)

        //draw polygonalMap
        this.pmsManager.debug.showAsImage(this.testMap)

        this.input.on('pointerdown', this.calcPerc, this)
        
        //Testing Astar
        this.pmsManager.debug.showConcave(this.testMap)
        
    }

    calcPerc(pointer)  //startVector, goalVector, visibilityMap)
    {
        if (this.input.activePointer.middleButtonDown())
        {
            this.player.setPosition(pointer.worldX, pointer.worldY)
            this.pmsManager.debug.graphics.clear()
            console.clear()
        }
        else if (this.input.activePointer.rightButtonDown())
        {
            this.pmsManager.debug.write([pointer.worldX, pointer.worldY])
        }
        else
        {
            this.pmsManager.debug.graphics.clear()
            console.clear()
            this.dest.x = pointer.worldX
            this.dest.y = pointer.worldY
            console.time("CalcPath")
            this.pmsManager.generatePath(this.player, this.dest, this.testMap)
            console.timeEnd("CalcPath")
        }
    }
}