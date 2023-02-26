import DepthCategories from '../../not_yet_defined_path/DepthCategories.mjs';
import buildInterface from '../shared/BuildInterface.mjs';

import cssSelectors from '../shared/cssSelectors.mjs';
import THINGS_PROPS from './THINGS_PROPS.mjs';

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
        // this.jsonCursor = Math.min(this.jsonCursor + 1, this.studioJSONs.length - 1);
        this.jsonCursor = ++this.jsonCursor % this.studioJSONs.length;
        this.thingsCursor = 0;
        return this.currentJson;
    }

    static prevJson()
    {
        this.jsonCursor = this.jsonCursor === 0 ? this.studioJSONs.length - 1 : --this.thingsCursor;
        // this.jsonCursor = Math.max(this.jsonCursor - 1, 0);
        this.thingsCursor = 0;
        return this.currentJson;
    }

    // manage Things
    static get things() {return this.currentJson.things}
    
    static get currentThing() { return this.things[this.thingsCursor] }

    static prevThing()
    {
        this.thingsCursor = this.thingsCursor === 0 ? this.things.length - 1 : --this.thingsCursor;
        // this.thingsCursor = Math.max(this.thingsCursor - 1, 0);
        return this.currentThing;
    }

    static nextThing()
    {
        this.thingsCursor = ++this.thingsCursor % this.things.length
        // this.thingsCursor = Math.min(this.thingsCursor + 1, this.things.length - 1);
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

    static removeFrameSuffix()
    {
        delete this.currentThing[THINGS_PROPS.FRAME_SUFFIX];
    }

    static setFrameSuffix(condition)
    {
        this.currentThing[THINGS_PROPS.FRAME_SUFFIX] = condition;
    }

    static removeHoverName()
    {
        delete this.currentThing[THINGS_PROPS.HOVER_NAME];
    }

    static setHoverName(index)
    {
        this.currentThing[THINGS_PROPS.HOVER_NAME] = index;
    }

    static removeFrameSuffix()
    {
        delete this.currentThing[THINGS_PROPS.SKIP_CONDITION];
    }

    static setSkipCondition(condition)
    {
        this.currentThing[THINGS_PROPS.SKIP_CONDITION] = condition;
    }

    static removeNoInput()
    {
        delete this.currentThing[THINGS_PROPS.NO_INPUT];
    }

    static setNoInput()
    {
        this.currentThing[THINGS_PROPS.NO_INPUT] = true;
    }

    static removeAnimationName()
    {
        delete this.currentThing[THINGS_PROPS.ANIMATION_NAME];
    }

    static setAnimationName()
    {
        this.currentThing[THINGS_PROPS.ANIMATION_NAME] = true;
    }
    // *Thing*:

    // x,
    // y,
    // frame,

    // frameSuffix,
    // hoverName,
    // skipCond,
    // noInput,
    // animation
    // rid,

    // *TriggerArea*:

    // x,
    // y,
    // width,
    // height,
    // skipCond,
    // rid,
    // hoverName,
    // actors


}

export default JsonManager
