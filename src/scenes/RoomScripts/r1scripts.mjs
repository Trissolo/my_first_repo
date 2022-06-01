class RS1 {

    constructor()
    {
        console.log("Script RS-1-")
    }

    test()
    {
        console.log("Called testFunc1")
    }

    exitEst(a, b)
    {
        console.log("Called exitEst", a, b)
    }

    exitWest(a, b)
    {
        console.log("Called exitWest", a, b)
    }

    ITcardA()
    {
        console.log("Clicked on:", "ITcardA")
    }

    r2cabinetDoors()
    {
        console.log("Clicked on:", "r2cabinetDoors")
        
        const frameSuffix =  this.frame.name.substring(0, this.frame.name.length - 1)
        this.setFrame(frameSuffix + this.scene.boolsManager.toggle(3))
          .setOrigin(0)
    }

    cabinet()
    {
        console.log("Clicked on:", "cabinet")
    }

    otherRoom()
    {
        console.log("Clicked on:", "otherRoom")
    }
}

export default RS1