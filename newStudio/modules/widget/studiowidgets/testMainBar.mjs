import studioEvents from "../../eventEmitter/StudioEvents.mjs";
import JsonManager from "../../jsonManager/JsonManager.mjs";
import AutoComplete from "../../autocomplete/AutoComplete.mjs";
import labels from "../classes/labels.mjs";
import baseClassesWrapper from "../classes/baseClassesWrapper.mjs";
import PseudoButton from "../classes/pseudoButton.mjs";

import addElement from "../addElement.mjs";

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

        this.buildNextJsonButton(container);

        // save button
        this.buildSaveJson(container);

        this.buildLoadFile(container);

        this.updateJsonGui();
     
    }

    buildSaveJson(container)
    {
        this.saveToDiskButton = new PseudoButton(container, "💾");

        this.saveToDiskButton.addClass(AutoComplete.cssSelectors.classes.emojiContent);

        this.saveToDiskButton.setOnClick(this.saveBlob);
    }

    buildPrevJsonButton(container)
    {
        this.prevRoom = new baseClassesWrapper.PseudoButton(container, labels.labelPrevJson);

        this.prevRoom.addClass(AutoComplete.cssSelectors.classes.buttonStyleA);

        this.prevRoom.setOnClick(this.backtrackJson);
    }

    buildNextJsonButton(container)
    {
        this.nextRoom = new baseClassesWrapper.PseudoButton(container, labels.labelNextJson);

        this.nextRoom.addClass(AutoComplete.cssSelectors.classes.buttonStyleA);

        this.nextRoom.setOnClick(this.advanceJson);
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
        this.labelThing = new baseClassesWrapper.TextField(container, "---");

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

        this.updateJsonGui();

        // this.updateJsonLabel();

        // studioEvents.emitter.emit(studioEvents.events.roomChanged);
    }

    advanceJson = () => {

        JsonManager.nextJson();

        this.updateJsonGui();

    }

    updateJsonGui = () => {

        this.updateJsonLabel();

        studioEvents.emitter.emit(studioEvents.events.roomChanged);

    }

    saveBlob()
    {
        const originalData = JsonManager.currentJson;
        
        const fileName = `rawR${JsonManager.jsonCursor}.json`; // rawR0

        console.log("%c%ARGUMENTS SAVE:", "background-color:green;", [...arguments]);

        const a = document.createElement("a");

        console.log("%c%Saving:", "background-color:black;", originalData);

        const uri =  URL.createObjectURL(new Blob([JSON.stringify(originalData, null, 0)], {
            type: "text/plain"
        }));

        a.href = uri;

        a.setAttribute("download", fileName);

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        window.URL.revokeObjectURL(uri);
    }





    onLoadedJSON(event)
    {
        const contents = JSON.parse(event.target.result);

        JsonManager.studioJSONs[JsonManager.jsonCursor] = contents;
        
        studioEvents.emitter.emit(studioEvents.events.roomChanged);
    }

    readSingleFile = (event) =>
    {
        const file = event.target.files[0];

        if (!file)
        {
            console.warn("Load Error");

            return;
        }

        const reader = new FileReader();

        reader.onload = this.onLoadedJSON; 
        
        reader.readAsText(file);
    }


    buildLoadFile(container)
    {
        // Copy/pasted from MDN

        //input element (hidden), to open file
        const loadJson = addElement('input', container);

        loadJson.setAttribute('type', 'file');

        loadJson.setAttribute('accept', '.json');

        loadJson.classList.add(AutoComplete.cssSelectors.classes.notDisplayed);

        loadJson.addEventListener('change', this.readSingleFile, false);

        this.loadJson = loadJson;


        // dummy Element, but 'stylizable'
        const fileSelect = addElement("b", container, "📂");

        fileSelect.classList.add(AutoComplete.cssSelectors.classes.emojiContent);

        
        fileSelect.addEventListener("click", event => this.loadJson.click(), false);

        //     (e) => {
        //         console.log("HERE!")
        //         // if (fileElem)
        //         // {
                    
        //         // }
        //     },
        //     false
        // );
    }

}
