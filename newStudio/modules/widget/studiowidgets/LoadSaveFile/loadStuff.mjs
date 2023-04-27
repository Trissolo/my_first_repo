import addElement from "../../addElement.mjs";

import AutoComplete from "../../../autocomplete/AutoComplete.mjs";

import JsonManager from "../../../jsonManager/JsonManager.mjs";

import studioEvents from "../../../eventEmitter/StudioEvents.mjs";


export default class LoadJSONSeparate
{

    reader = new FileReader();

    loadJson;

    fileSelect;

    constructor(container)
    {
        const loadJson = addElement('input', container);

        loadJson.setAttribute('type', 'file');

        loadJson.setAttribute('accept', '.json');

        loadJson.classList.add(AutoComplete.cssSelectors.classes.notDisplayed);

        loadJson.addEventListener('change', this.loadJsonFromHdd, false);

        
        // dummy Element, but 'stylizable'
        const fileSelect = addElement("b", container, "📂");
        
        fileSelect.classList.add(AutoComplete.cssSelectors.classes.emojiContent);
        
        fileSelect.addEventListener("click", event => this.loadJson.click(), false);

        // hmmmm...
        this.loadJson = loadJson;

        this.fileSelect = fileSelect;

        this.reader.addEventListener("load", this.onLoadedJSON);
    }
    

    loadJsonFromHdd = (event) =>
    {
        const file = event.target.files[0];

        if (!file)
        {
            console.warn("Load Error");

            return;
        }

        this.reader.readAsText(file);
    }

    onLoadedJSON(event)
    {
        const contents = JSON.parse(event.target.result);

        JsonManager.studioJSONs[JsonManager.jsonCursor] = contents;
        
        studioEvents.emitter.emit(studioEvents.events.roomChanged);
    }

}
