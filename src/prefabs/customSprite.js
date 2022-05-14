import Phaser from 'phaser';
export default class customSprite extends Phaser.GameObjects.Sprite {

    constructor (scene, x, y)
    {
        super(scene, x, y);

        this.setTexture('logo');
        this.setPosition(x, y);
        this.setScale(0.161)
        scene.add.existing(this)
    }
    
    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        this.rotation += 0.01;
    }

}