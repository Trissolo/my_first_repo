import Phaser from 'phaser';

class Preload extends Phaser.Scene
{
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
        console.log("Preload scene: create", this.cache)

        this.add.image(10,8,"atlas0", "room1bg").setOrigin(0)
        Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'fontWhite', 'atlas0', 'mio_font_tiny_mono', 'fontWhiteXML');

        const str = '(tEST)WTRPyxv^}{';

        this.add.bitmapText(20, 100, 'fontWhite', str);
    }
}

export default Preload