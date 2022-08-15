import Phaser from "phaser";

export default class BBmText // extends Phaser.GameObjects.Sprite
{
    constructor(scene, text, offsetX = 3, offsetY = 4)
    {
        this.offsetX = offsetX

        this.offsetY = offsetY

        this.textBackground = scene.add.image(0, 0, 'atlas0', "singlePixel")
          .setOrigin(0)
          .setVisible(false);

        this.bmText = scene.add.bitmapText(0, 0, 'fontWhite', "qwe")
          .setOrigin(0)
          .setVisible(false)
          .setText(text);
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
}
