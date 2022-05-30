import Phaser from 'phaser';

export default class RoomBackground extends Phaser.GameObjects.Image {

    constructor(scene)
    {
        super(scene, 0, 0, "__DEFAULT");

        this.setActive(false)
        this.setVisible(false)

        this.clickWorldCoords = new Phaser.Math.Vector2()
        this.setInteractive({cursor:'url(assets_prod/cursors/wait.cur), pointer'})
        this.on('pointerdown', this.bgClicked, this)

        scene.add.existing(this)
    
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
        this.scene.igEvents.emit('bgClicked', this.clickWorldCoords)
        console.log("Background:", this)
    }


    
    // preUpdate (time, delta)
    // {
    //     super.preUpdate(time, delta);

    //     this.rotation += 0.01;
    // }

}  //end background class