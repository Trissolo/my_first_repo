import DepthCategories from '../../not_yet_defined_path/DepthCategories.mjs';
import buildInterface from '../shared/BuildInterface.mjs';

import cssSelectors from '../shared/cssSelectors.mjs';

// 1/3
// get all JSON from Gimp:
import GimpJsonLoader from './GimpJsonLoader.mjs';


// 2/3
// sort the 'things' array
const editableJsons = (() => {
    
    for (const [idx, elem] of GimpJsonLoader.entries())
    {
        elem.things.sort( (a, b) => DepthCategories[a.depth] > DepthCategories[b.depth])
    }

    const jsonsArray = GimpJsonLoader.map( (el, i, ary) => Phaser.Utils.Objects.DeepCopy(el))
    
    return jsonsArray
})()

class JsonManager {
    static oriJSONS = GimpJsonLoader;

    static studioJSONs = editableJsons;

    static jsonCursor = 0;

    static thingsCursor = 0;

    static domThings = document.getElementById(cssSelectors.ids.things_window)

    //whole JSON nav
    static get currentJson() { return this.studioJSONs[this.jsonCursor] }

    static nextJson()
    {
        this.jsonCursor = Math.min(this.jsonCursor + 1, this.studioJSONs.length - 1);
        this.thingsCursor = 0;
        return this.currentJson;
    }

    static prevJson()
    {
        this.jsonCursor = Math.max(this.jsonCursor - 1, 0);
        this.thingsCursor = 0;
        return this.currentJson;
    }

    // manage Things
    static get things() {return this.currentJson.things}
    
    static get currentThing() { return this.things[this.thingsCursor] }

    static prevThing()
    {
        this.thingsCursor = Math.max(this.thingsCursor - 1, 0);
        return this.currentThing;
    }

    static nextThing()
    {
        this.thingsCursor = Math.min(this.thingsCursor + 1, this.things.length - 1);
        return this.currentThing;
    }

    static get originalThing() { return this.oriJSONS[this.jsonCursor].things[this.thingsCursor] }


    static showThing()
    {
        this.domThings.innerHTML = JSON.stringify(this.currentThing, null, 2) // prettyPrintJson.toHtml(this.currentThing)
    }

    static wholeJsonToJson()
    {
        return JSON.stringify(this.currentJson, buildInterface.parseJsonProps, 2)
    }

    static thingToJson()
    {
        return JSON.stringify(this.currentThing, null, 2)
    }

}

export default JsonManager
