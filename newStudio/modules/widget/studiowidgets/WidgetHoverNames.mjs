import BaseWidget from "../classes/baseWidget.mjs";
import TextField from "../classes/textField.mjs";
import PseudoButton from "../classes/pseudoButton.mjs";
import inputWord from "../classes/inputWord.mjs";

import OptionsList from "../classes/baseOptionsList.mjs";

import InGameArrays from "../../placeholders/InGameArrays.mjs";

// import AutoComplete from "../../autocomplete/AutoComplete.mjs";
import THINGS_PROPS from "../../autocomplete/THINGS_PROPS.mjs";
import JsonManager from "../../jsonManager/JsonManager.mjs";

import OnHoverNames from "../../placeholders/OnHoverNames.mjs";
import addElement from "../addElement.mjs";
import AutoComplete from "../../autocomplete/AutoComplete.mjs";

export default class WidgetHoverNames extends BaseWidget
{
    button;

    selectElem;

    info;

    constructor(managedProp = THINGS_PROPS.HOVER_NAME)
    {
        super(managedProp);

        this.managedProp = managedProp;

        // this.button = new PseudoButton(this.widget, "Remove hover name");

        this.buildRemoveButton();

        this.selectElem = new OptionsList(this.widget, OnHoverNames, "Select OnHoverName")

        this.selectElem.setOnChange(this.onChange);

        this.info = new TextField(this.widget);

        this.info.addClass(AutoComplete.cssSelectors.classes.marginRight);

        this.info.setDisabled();

        this.buildInputField(this.widget);

        //
        

        // this.separ = addElement('b', this.widget)
        // this.separ.classList.add(AutoComplete.cssSelectors.classes.marginLeft);
        // this.separ.classList.add(AutoComplete.cssSelectors.classes.vertDivider);
        // this.separ.classList.add(AutoComplete.cssSelectors.classes.marginRight);



    }

    buildRemoveButton()
    {
        const button = new PseudoButton(this.widget, "Remove hover name");

        button.setStyleB()
            .setMarginRight()
            .setMarginLeft()
            .setOnClick(this.buttonBehavior);
    
        this.button = button;
    }

    onChange = (event) => {

        if (event.target.value === "")
        {
            // console.log("NONE Selected! Returning...");
            return
        }

        JsonManager.setHoverName(+event.target.value);

        this.refresh(true);
    }

    buttonBehavior = (event) => {

        JsonManager.removeHoverName();

        this.refresh(true);
    }

    refresh(refreshThing)
    {
        if (JsonManager.thingHasOwnProperty(this.managedProp))
        {
            const idx = JsonManager.currentThing[this.managedProp];

            this.info.setInUse(`on pointerover: ${this.selectElem.optionsAry[idx]} (${idx})`);

            this.selectElem.setSelectedIndex(idx + 1);
        }

        else
        {
            this.info.setDisabled();

            this.inputWord.resetValue();

            this.selectElem.setSelectedIndex();
        }

        if (refreshThing)
        {
            JsonManager.showThing();
        }
    }

    buildInputField(container)
    {
        this.inputWord = new inputWord(container, "Write Hovername");

        this.inputWord.bindToList(InGameArrays.arrayIds.HoverNames);

        this.inputWord.setOnChange(this.onChangeWord);
    }

    onChangeWord = (event) => {

        const value = +event.target.value;
        
        console.log("target.value", value, InGameArrays.originalArrays.get(InGameArrays.arrayIds.HoverNames)[value]);

        JsonManager.setHoverName(value);

        this.refresh(true);
    }

    // lastCharIsDigit(str, pos = str.length - 1)
    // {
    //     const lastChar = str.charCodeAt(pos);
    //     return lastChar < 58 && lastChar > 47;

    //     // const regexpEndingDigits = /([0-9]+$)/;
    //     // const match = str.search(regexpEndingDigits);
    //     // console.log(match)
    //     // console.log(str.substring(match, str.length ))

    //     // const regexpEndingDigits = /([0-9]+$)/;
    //     // const match = str.search(regexpEndingDigits);

    //     // console.log("String:", str);
    //     // console.log("Prefix:", str.substring(0, match));
    //     // console.log("Digits", str.substring(match, str.length));


    //     // return match;
    // }

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
