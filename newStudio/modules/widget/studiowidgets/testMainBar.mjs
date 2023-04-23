import studioEvents from "../../eventEmitter/StudioEvents.mjs";
import JsonManager from "../../jsonManager/JsonManager.mjs";
import AutoComplete from "../../autocomplete/AutoComplete.mjs";
import labels from "../classes/labels.mjs";
import baseClassesWrapper from "../classes/baseClassesWrapper.mjs";

export default class MainBar
{
    constructor()
    {
        const container = document.getElementById(AutoComplete.cssSelectors.ids.GUI_mainbar);

        this.buildPrevThingButton(container);

        this.buildThingTextField(container);

        this.buildNextThingButton(container);

        // Room nav
        this.buildPrevJsonButton(container)
        
        this.buildThingJsonField(container);
        
    }

    buildPrevJsonButton(container)
    {
        this.prevRoom = new baseClassesWrapper.PseudoButton(container, labels.labelPrevJson);
        this.prevRoom.addClass(AutoComplete.cssSelectors.classes.buttonStyleA);
        this.prevRoom.setOnClick(this.backtrackJson);
    }

    buildPrevThingButton(container)
    {
        this.prevThing = new baseClassesWrapper.PseudoButton(container, labels.labelPrevThing);
        // this.prevThing.addClass(AutoComplete.cssSelectors.classes.pseudoButton);
        this.prevThing.addClass(AutoComplete.cssSelectors.classes.buttonStyleB);

        this.prevThing.setOnClick(this.backtrackThing)
    }

    advanceThing = () => {
        JsonManager.nextThing();
        studioEvents.emitter.emit(studioEvents.events.thingChanged);
        // JsonManager.showThing();
    }

    backtrackThing = () => {
        JsonManager.prevThing();
        studioEvents.emitter.emit(studioEvents.events.thingChanged);
    }

    buildNextThingButton(container)
    {
        this.nextThing = new baseClassesWrapper.PseudoButton(container, labels.labelNextThing);
        this.nextThing.addClass(AutoComplete.cssSelectors.classes.buttonStyleB);
        this.nextThing.setOnClick(this.advanceThing);

        //horizontal separation
        this.nextThing.addClass(AutoComplete.cssSelectors.classes.marginRight);
    }

    buildThingTextField(container)
    {
        this.labelThing = new baseClassesWrapper.TextField(container, "---")
        this.labelThing.addClass(AutoComplete.cssSelectors.classes.textFieldB);
        studioEvents.emitter.on(studioEvents.events.thingChanged, this.updateThingsLabel, this);
    }

    buildThingJsonField(container)
    {
        this.labelJson = new baseClassesWrapper.TextField(container, "--mnmn-");

        this.labelJson.addClass(AutoComplete.cssSelectors.classes.textFieldB);

        // studioEvents.emitter.on(studioEvents.events.thingChanged, this.updateThingsLabel, this);
    }

    // arrow methods
    updateThingsLabel = () => this.labelThing.setText(`Thing[${JsonManager.thingsCursor}]/${JsonManager.things.length - 1}`)

    updateJsonLabel = () => this.labelJson.setText(`Room[${JsonManager.jsonCursor}]/${JsonManager.studioJSONs.length - 1}`);
    //json room
    backtrackJson = () => {
        
        JsonManager.prevJson();

        this.updateJsonLabel();

        studioEvents.emitter.emit(studioEvents.events.roomChanged);
    }

}
