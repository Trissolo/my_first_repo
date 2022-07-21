import Phaser from 'phaser';

import { RoomBackgroundEvents } from './RoomBackgroundEvents.mjs';

export default class RoomBackground extends Phaser.GameObjects.Image {

    constructor(scene)
    {
        super(scene, 0, 0, "__DEFAULT");

        this.setActive(false)
        this.setVisible(false)

        this.clickWorldCoords = new Phaser.Math.Vector2()
        this.setInteractive({cursor:'url(assets_prod/cursors/cross.cur), pointer'}) // {cursor:'url(assets_prod/cursors/wait.cur), pointer'})
        this.on('pointerdown', this.bgClicked, this)

        scene.add.existing(this)

        //.pmsManager.generatePath(this.player, this.dest, this.testMap)
        scene.igEvents.on(RoomBackgroundEvents.Background_Clicked, this.manageUserClick, this)
    
    }

    //wrong place here?
    manageUserClick(clickCoords)
    {
        // if some ScriptedAction is currently executed, stop it!
        this.scene.igPlug.scrActions.forceBreak = true

        const path = this.scene.pmsManager.generatePath(this.scene.player, clickCoords, this.scene.player.floor)

        // this.scene.player.walk.setPath(path)
        this.scene.player.walkTo(this.scene.pmsManager.generatePath(this.scene.player, clickCoords, this.scene.player.floor))
    }

    revamp(atlasNum, background)
    {
        this.setTexture("atlas" + atlasNum, background)
          .setOrigin(0)
          .setDepth(-10)//depthCategories.bg)
        
          this.input.hitArea.setSize(this.width, this.height)

        this.setActive(true)
          .setVisible(true)
    }

    hide()
    {
        this.setActive(false)
        this.setVisible(false)
    }

    bgClicked(pointer, localX, localY, prevent)
    {
        this.clickWorldCoords.setTo(pointer.worldX, pointer.worldY)
        this.scene.igEvents.emit(RoomBackgroundEvents.Background_Clicked, this.clickWorldCoords)
        // console.log("Background:", this)
    }


    
    // preUpdate (time, delta)
    // {
    //     super.preUpdate(time, delta);

    //     this.rotation += 0.01;
    // }

}  //end background class
