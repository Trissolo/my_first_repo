import BaseWidget from "../classes/baseWidget.mjs";
import TextField from "../classes/textField.mjs";
import PseudoButton from "../classes/pseudoButton.mjs";

import OptionsList from "../classes/baseOptionsList.mjs";
import GetAttribAsNumber from "../../GetAttribAsNumber.mjs";

// import AutoComplete from "../autocomplete/AutoComplete.mjs";
import THINGS_PROPS from "../../autocomplete/THINGS_PROPS.mjs";
import JsonManager from "../../jsonManager/JsonManager.mjs";

import DepthStringEnum from "../../jsonManager/DepthStringEnum.mjs";
import Conditions from "../../placeholders/Conditions.mjs";
import AutoComplete from "../../autocomplete/AutoComplete.mjs";

import studioEvents from "../../eventEmitter/StudioEvents.mjs";

import FrameNameHelper from "../../FrameNameHelper.mjs";

export default class WidgetFrameSuffix extends BaseWidget
{
    constructor(managedProp = THINGS_PROPS.FRAME_SUFFIX) // , phaserGame) // gameScene)
    {
        
        super(managedProp);
        
        // wait for the game:
        // studioEvents.emitter.once(studioEvents.events.gameReady, this.installScene, this);

        this.managedProp = managedProp;

        
        // button Button 'remove' (reset frame)
        this.button = new PseudoButton(this.widget, "Remove frameSuffix");
        
        this.button.setStyleB();
        
        this.button.setMarginRight();
        
        this.button.setMarginLeft();

        this.buttonBehavior = (event) => {

            if (JsonManager.currentThing.hasOwnProperty(THINGS_PROPS.FRAME_SUFFIX))
            {

                JsonManager.removeFrameSuffix();
    
                // Append a fake frame number to the current frame name. This can be risky.
                JsonManager.currentThing[THINGS_PROPS.FRAME] = JsonManager.currentThing[THINGS_PROPS.FRAME] + "0";
    
                this.refresh(true);

            }
        }
        
        this.button.setOnClick(this.buttonBehavior);
        

        //container for 'select' Elements
        this.allSelectElements = [];

        this.enumVarKind = ['Bool', 'Crumble', 'Nibble', 'Byte'];

        // name of the condition to use as a suffix
        // this.selectBool = new OptionsList(this.widget, Conditions, "Select condition (1bit)");

        // this.selectBool = this.allSelectElements[0]

        this.populateAllSelectElems();

        this.clearSelectElems();

        
        // status
        this.info = new TextField(this.widget);

        this.info.setDisabled();

        this.info.addClass(AutoComplete.cssSelectors.classes.marginLeft);

        this.info.removeClass(AutoComplete.cssSelectors.classes.marginRight);

        // test nextFrameButton button
        this.nextFrameButton = new PseudoButton(this.widget, "⏭️");
        // this.nextFrameButton.setStyleA();
        this.nextFrameButton.setOnClick(() => studioEvents.emitter.emit(studioEvents.events.tryNextFrame));

    }

    // installScene(scene)
    // {
    //     // console.log("Installing scene in widget", scene);
        
    //     this.scene = scene;

    //     // console.log("this.scene", this.scene);
    // }

    revealInfo(varIdx, kind)
    {
        this.info.setInUse(`"${JsonManager.currentThing[THINGS_PROPS.FRAME]}" + ${this.allSelectElements[kind].optionsAry[varIdx]} (${this.enumVarKind[kind]}Idx: ${varIdx})`);

        return this;
    }

    populateAllSelectElems()
    {
        for (let i = 0; i < 4; i ++)
        {
            const selectElement = new OptionsList(this.widget, Conditions, `Cond. (${1 << i}bit)`);

            // hardcoded! :/
            selectElement.kind = i;

            //orco selectElement setAttribute("kind", i);
            selectElement.select.setAttribute("kind", i);

            selectElement.setOnChange(this.onChangeSuffix);
        
            this.allSelectElements.push(selectElement);
        }

        return this;
    }

    clearSelectElems()
    {
        for (const [idx, elem] of this.allSelectElements.entries())
        {
            elem.setSelectedIndex();

            elem.classList.remove('redalert');
        }
    }

    // get selectBool()
    // {
    //     return this.allSelectElements[0];
    // }

    // get selectCrumble()
    // {
    //     return this.allSelectElements[1];
    // }

    // get selectNibble()
    // {
    //     return this.allSelectElements[2];
    // }

    // get selectByte()
    // {
    //     return this.allSelectElements[3];
    // }


    onChangeSuffix = (event) => {

        if (event.target.value === "" || !JsonManager.currentThing.hasOwnProperty(THINGS_PROPS.FRAME) || !FrameNameHelper.lastCharIsDigit(JsonManager.currentThing[THINGS_PROPS.FRAME]))
        {
            console.log("Not possible", Math.random());

            return;
        }

        // console.log("Verifying scene:", this.scene);

        const eventIdx = +event.target.value;

        //get the 'kind'
        JsonManager.setFrameSuffix(eventIdx, GetAttribAsNumber(event.target, 'kind'));

        // remove last digits from 'frame'
        JsonManager.currentThing[THINGS_PROPS.FRAME] = FrameNameHelper.cutOffEndingDigits(JsonManager.currentThing[THINGS_PROPS.FRAME]);

        this.refresh(true);
    }

    refresh(refreshThing)
    {
        console.log("Refresh del PD");
        
        this.clearSelectElems();

        if (JsonManager.currentThing.hasOwnProperty(THINGS_PROPS.FRAME_SUFFIX))
        {
            console.log("FRAME_SUFFIX", JsonManager.currentThing[THINGS_PROPS.FRAME_SUFFIX]);

            const varIdx = JsonManager.currentThing[THINGS_PROPS.FRAME_SUFFIX];

            const kind = JsonManager.currentThing[THINGS_PROPS.FRAME_SUFFIX_KIND];

            this.revealInfo(varIdx, kind);

            this.allSelectElements[kind].setSelectedIndex(varIdx + 1);

            this.allSelectElements[kind].classList.add('redalert');

            this.nextFrameButton.setHidden(true);

        }

        else
        {
            this.info.setDisabled();

            this.nextFrameButton.setHidden(false);
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

    // const name = "r1_porta4503";

    // const match = name.search(regexpEndingDigits);

    // const num = name.substring(match, name.length)
    // const prefix = name.substring(0, match);

    // console.log(name, match, prefix, num);



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
