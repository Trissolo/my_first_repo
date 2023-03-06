import studioEvents from "../../eventEmitter/StudioEvents.mjs";
import JsonManager from "../../jsonManager/JsonManager.mjs";
import AutoComplete from "../../autocomplete/AutoComplete.mjs";
import labels from "./labels.mjs";
import baseClassesWrapper from "./baseClassesWrapper.mjs";

export default class MainBar
{
    constructor()
    {
        const container = document.getElementById(AutoComplete.cssSelectors.ids.GUI_mainbar);

        this.buildPrevThingButton(container);
        this.buildThingTextField(container);
        this.buildNextThingButton(container);

        // this.prevThing = new baseClassesWrapper.PseudoButton(container, labels.labelPrevThing);
        // this.prevThing.addClass(AutoComplete.cssSelectors.classes.buttonStyleA);

        // this.labelThing = new baseClassesWrapper.TextField(container, "---")

        // this.nextThing = new baseClassesWrapper.PseudoButton(container, labels.labelNextThing);
        // this.nextThing.addClass(AutoComplete.cssSelectors.classes.buttonStyleA);

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
        // this.nextThing.addClass(AutoComplete.cssSelectors.classes.pseudoButton);
        this.nextThing.addClass(AutoComplete.cssSelectors.classes.buttonStyleB);
        this.nextThing.setOnClick(this.advanceThing)
    }

    buildThingTextField(container)
    {
        this.labelThing = new baseClassesWrapper.TextField(container, "---")
        this.labelThing.addClass(AutoComplete.cssSelectors.classes.textFieldB);
        studioEvents.emitter.on(studioEvents.events.thingChanged, this.moDove, this);
    }

    moDove = ()=> this.labelThing.setText(`Thing[${JsonManager.thingsCursor}]/${JsonManager.things.length - 1}`)

}
