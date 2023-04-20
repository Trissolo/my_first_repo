import BaseWidget from "../classes/baseWidget.mjs";
import TextField from "../classes/textField.mjs";
import PseudoButton from "../classes/pseudoButton.mjs";

import OptionsList from "../classes/baseOptionsList.mjs";

// import AutoComplete from "../autocomplete/AutoComplete.mjs";
import THINGS_PROPS from "../../autocomplete/THINGS_PROPS.mjs";
import JsonManager from "../../jsonManager/JsonManager.mjs";

import DepthStringEnum from "../../jsonManager/DepthStringEnum.mjs";
import Conditions from "../../placeholders/Conditions.mjs";
import AutoComplete from "../../autocomplete/AutoComplete.mjs";

export default class WidgetFrameSuffix extends BaseWidget
{
    constructor(managedProp = THINGS_PROPS.FRAME_SUFFIX, gameScene)
    {
        
        super(managedProp);
        
        // console.log("Scene from Widget Frame Suffix:", gameScene);
        this.game = gameScene;
        
        this.managedProp = managedProp;

        // button reset frame
        this.button = new PseudoButton(this.widget, "Remove frameSuffix");
        
        this.button.setStyleB();
        
        this.button.setMarginRight();
        
        this.button.setMarginLeft();
        
        // name of the condition to use as a suffix
        this.selectBool = new OptionsList(this.widget, Conditions, "Select condition (1bit)")

        // status
        this.info = new TextField(this.widget);

        this.info.setDisabled();

        //
        this.buttonBehavior = (event) => {

            JsonManager.removeFrameSuffix();

            this.refresh(true);
        }


        this.button.setOnClick(this.buttonBehavior);

        this.selectBool.setOnChange(this.onChangeBool);

    }

    onChangeBool = (event) => {

        if (event.target.value === "" || !JsonManager.currentThing.hasOwnProperty(THINGS_PROPS.FRAME))
        {
            return
        }

        // JsonManager.setHoverName(+event.target.value);
        console.log("Scene?", this.game.scene.scenes[0]);

        const eventIdx = +event.target.value;

        console.log("FR_SUFF", eventIdx, this.selectBool.optsAry[eventIdx]);

        JsonManager.setFrameSuffix(eventIdx, 0);

        this.refresh(true);
    }

    refresh(refreshThing)
    {
        if (JsonManager.currentThing.hasOwnProperty(AutoComplete.THINGS_PROPS.FRAME_SUFFIX))
        {

        }

        if (refreshThing)
        {
            JsonManager.showThing();
        }
    }

    // old
    // refresh(refreshThing)
    // {
    //     if (JsonManager.currentThing.hasOwnProperty(this.managedProp))
    //     {
    //         const idx = JsonManager.currentThing[this.managedProp];

    //         this.info.setInUse(`on pointerover: ${this.selectBool.optionsAry[idx]} (${idx})`);

    //         this.selectBool.setSelectedIndex(idx + 1);
    //     }

    //     else
    //     {
    //         this.info.setDisabled();

    //         this.selectBool.setSelectedIndex();
    //     }

    //     if (refreshThing)
    //     {
    //         JsonManager.showThing();
    //     }
    // }

    lastCharIsDigit(str, pos = str.length - 1)
    {
        const lastChar = str.charCodeAt(pos);
        return lastChar < 58 && lastChar > 47;

        // const regexpEndingDigits = /([0-9]+$)/;
        // const match = str.search(regexpEndingDigits);
        // console.log(match)
        // console.log(str.substring(match, str.length ))

        // const regexpEndingDigits = /([0-9]+$)/;
        // const match = str.search(regexpEndingDigits);

        // console.log("String:", str);
        // console.log("Prefix:", str.substring(0, match));
        // console.log("Digits", str.substring(match, str.length));


        // return match;
    }

    // function lastCharIsDigit(str, pos = str.length - 1)
    // {
    //     {
    //         const lastChar = str.charCodeAt(pos);
    //         return lastChar < 58 && lastChar > 47;
    //     }
    // }


    // const regexpEndingDigits = /([0-9]+$)/;
    // const prefixes = new Set();
    // const delendi = new Set();
    // for (const thing of testJson.things)
    // {
    //     if (thing.depth !== "ta")
    //     {
    //         const name = thing.frame;
    //         if (lastCharIsDigit(name))
    //         {
    //         log(name);
    //         const match = name.search(regexpEndingDigits);
    //         const prefix = name.substring(0, match);
    //         if (prefixes.has(prefix))
    //         {
    //             delendi.add(thing);
    //         }
    //         else
    //         {
    //             prefixes.add(prefix);
    //         }
            
    //         }
    //     } 
    // }

    // dir(prefixes)
    // dir(delendi)

    // function removeThing(thing, things = testJson.things)
    // {
        // for (let i = 0; i < things.length; i++)
        // {
        //     if (things[i] === thing)
        //     {
        //          return Phaser.Utils.Array.SpliceOne(things, i);
        //     }
        // }
    // }

    // delendi.forEach(el => {
    // removeThing(el);
    // });

    // dir(testJson.things)

}
