const studioEvents = {

    emitter: new Phaser.Events.EventEmitter(),
    events: {
        thingChanged: "thingchanged",
        roomChanged: "roomchanged",
        pressedPrevJson: "pressedPrevJson",
        pressedNextJson: "pressedNextJson",
        pressedPrevThing: "pressedPrevThing",
        pressedNextThing: "pressedNextThing",
        choosedHoverName: "choosedHoverName"

    }
}

export default studioEvents
