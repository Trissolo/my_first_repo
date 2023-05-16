const studioEvents = {

    emitter: new Phaser.Events.EventEmitter(),
    events: {
        thingChanged: "thingchanged",
        roomChanged: "roomchanged",
        pressedPrevJson: "pressedPrevJson",
        pressedNextJson: "pressedNextJson",
        pressedPrevThing: "pressedPrevThing",
        pressedNextThing: "pressedNextThing",
        choosedHoverName: "choosedHoverName",
        updateRenderedThing: 'updateRenderedThing',
        tryNextFrame: "tryNextFrame",

        clearCondition: Symbol(),
        conditionSetKind: Symbol(),
        conditionSetVarIdx: Symbol(),
        conditionSetExpectedVal: Symbol(),
        conditionParsed: Symbol(),
        conditionChangedVarIdx: Symbol(),

        condNewKind: Symbol(),
        condNewVarIdx: Symbol(),
        condNewExpected: Symbol(),
        condClearKind: Symbol(),
        condClearVarIdx: Symbol(),
        condClearExpected: Symbol()


    }
}

export default studioEvents
