// import DepthCategories from '../../not_yet_defined_path/DepthCategories.mjs';
// import buildInterface from '../shared/BuildInterface.mjs';
import DepthCategories from './DepthCategories.mjs';

import AutoComplete from '../autocomplete/AutoComplete.mjs';

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

    static domThings = document.getElementById(AutoComplete.cssSelectors.ids.things_window);

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
        this.jsonCursor = this.jsonCursor === 0 ? this.studioJSONs.length - 1 : this.jsonCursor - 1;
        // this.jsonCursor = Math.max(this.jsonCursor - 1, 0);
        this.thingsCursor = 0;
        return this.currentJson;
    }

    // manage Things
    static get things() {return this.currentJson.things}
    
    static get currentThing() { return this.things[this.thingsCursor] }

    static prevThing()
    {
        this.thingsCursor = this.thingsCursor === 0 ? this.things.length - 1 : this.thingsCursor - 1;
        return this.currentThing;
    }

    static nextThing()
    {
        this.thingsCursor = ++this.thingsCursor % this.things.length
        return this.currentThing;
    }

    static get originalThing() { return this.oriJSONS[this.jsonCursor].things[this.thingsCursor] }


    static showThing()
    {
        this.domThings.innerHTML = JSON.stringify(this.currentThing, null, 2) // prettyPrintJson.toHtml(this.currentThing)
    }

    static wholeJsonToJson()
    {
        return JSON.stringify(this.currentJson, /*buildInterface.parseJsonProps*/ null, 2)
    }

    static thingToJson()
    {
        return JSON.stringify(this.currentThing, null, 2)
    }
  

    static setFrameSuffix(condition, suffixKind)
    {
        this.currentThing[AutoComplete.THINGS_PROPS.FRAME_SUFFIX] = condition;
        
        this.currentThing[AutoComplete.THINGS_PROPS.FRAME_SUFFIX_KIND] = suffixKind;
    }
    
    static removeFrameSuffix()
    {
        delete this.currentThing[AutoComplete.THINGS_PROPS.FRAME_SUFFIX];

        delete this.currentThing[AutoComplete.THINGS_PROPS.FRAME_SUFFIX_KIND];
    }
  

    static setHoverName(index)
    {
        this.currentThing[AutoComplete.THINGS_PROPS.HOVER_NAME] = index;
    }
    
    static removeHoverName()
    {
        delete this.currentThing[AutoComplete.THINGS_PROPS.HOVER_NAME];
    }


    static setSkipCondition(condition)
    {
        this.currentThing[AutoComplete.THINGS_PROPS.SKIP_CONDITION] = condition;
    }

    static removeSkipCondition(condition)
    {
        delete this.currentThing[AutoComplete.THINGS_PROPS.SKIP_CONDITION];
    }
    

    static setNoInput()
    {
        this.currentThing[AutoComplete.THINGS_PROPS.NO_INPUT] = true;
    }

    static removeNoInput()
    {
        delete this.currentThing[AutoComplete.THINGS_PROPS.NO_INPUT];
    }

    
    static setAnimationName()
    {
        this.currentThing[AutoComplete.THINGS_PROPS.ANIMATION_NAME] = true;
    }

    static removeAnimationName()
    {
        delete this.currentThing[AutoComplete.THINGS_PROPS.ANIMATION_NAME];
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
