import Phaser from "phaser";

const {Clamp} = Phaser.Math

export default class BBmText // extends Phaser.GameObjects.Sprite
{
    constructor(scene, text, offsetX = 3, offsetY = 4)
    {
        this.offsetX = offsetX

        this.offsetY = offsetY

        this.gWidth = scene.scale.gameSize.width

        this.gHeight = scene.scale.gameSize.height

        this.textBackground = scene.add.image(0, 0, 'atlas0', "singlePixel")
          .setOrigin(0)
          .setVisible(false)
          .setDepth(10e7);

        this.bmText = scene.add.bitmapText(0, 0, 'fontWhite', "qwe")
          .setOrigin(0)
          .setVisible(false)
          .setDepth(10e7)
          .setText(text);
        
        // a reference to scene's main camera
        this.cam = scene.cameras.main
    }

    setVisible(value = false)
    {
            this.textBackground.setVisible(value)
            
            this.bmText.setVisible(value)

            return this
    }

    get text()
    {
        return this.bmText._text
    }

    setText(string)
    {
        this.bmText.setText(string)

        return this
    }

    get global()
    {
        return this.bmText.getTextBounds().global
    }

    get scene()
    {
        return this.bmText.scene
    }

    scaleBg()
    {
      const {width, height} = this.global

      this.textBackground.setScale(width + this.offsetX, height + this.offsetY)

      return this
    }

    place(x, y)
    {
      //x = Clamp(x, 0, x - Math.floor(this.textBackground.scaleX / 2))
      //y = Clamp(y, this.global.height, y - Math.floor(this.textBackground.scaleY / 2)) - this.global.height

      //this.bmText.setPosition(x, y)

      //raw way:
      this.bmText.setPosition(
        Clamp(
            x,
            this.cam.scrollX /*- Math.floor(this.textBackground.scaleX / 2)*/,
            /*this.cam.scrollX +*/ this.scene.background.width - this.global.width
          ),
        Clamp(
            y - this.global.height -9,
            this.cam.scrollY,// + this.global.height,
            this.scene.background.height// - this.global.height
          ) 
        //Clamp(y, )
      )
      // console.log(x, y, this.bmText.x, this.bmText.y, this.scene.background.width, this.global.width)//, "shit: ", this.cam.scrollX - Math.floor(this.textBackground.scaleX / 2))

      this
        .scaleBg()
        .textBackground.setPosition(this.bmText.x - 2 /*this.offsetX*/, this.bmText.y)  
    }

    showDescription(pointer)
    {
      // console.log(a,b,c,d)
      if (this.bmText.visible)
      {
        // const {x, y} = pointer
        this.place(pointer.worldX, pointer.worldY)
      }
    }
}

/*
//bmtext bg scale:
this.text.setText("Exit West")
    const
    {
      width, height
    } = this.text.getTextBounds().global
    this.image1.setScale(width + 3, height + 4)
    
    /////////////
    function gag(pointer, a)
{
  console.log("GAG", a, pointer)
  const
  {
    width,
    height
  } = pointer.camera.scaleManager
  //console.log("GAG", width, height)
  pointer.camera.scene.text.setPosition(Math.min(pointer.x, 80), Math.min(pointer.y, 90))
  pointer.camera.scene.image1.setPosition(pointer.camera.scene.text.x - 2, pointer.camera.scene.text.y)
}
*/
