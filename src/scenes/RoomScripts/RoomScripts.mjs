import ScriptsAry from "./ScriptsAry.mjs"

class RoomScript
{
    constructor()
    {
        console.log("RoomScriptManager")
    }

    grab(id)
    {
        if (!this[`rs${id}`])
        {
            this[`rs${id}`] = new ScriptsAry[`RS${id}`]()
        }
        return this[`rs${id}`]
    }
}

export default RoomScript