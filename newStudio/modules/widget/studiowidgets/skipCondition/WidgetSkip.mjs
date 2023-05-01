import studioEvents from "../../../eventEmitter/StudioEvents.mjs";

import JsonManager from "../../../jsonManager/JsonManager.mjs";

import AutoComplete from "../../../autocomplete/AutoComplete.mjs";

import BaseWidget from "../../classes/baseWidget.mjs";
import PseudoButton from "../../classes/pseudoButton.mjs";
import TextField from "../../classes/textField.mjs";

import GetAttribAsNumber from "../../../GetAttribAsNumber.mjs";
import addElement from "../../addElement.mjs";
import THINGS_PROPS from "../../../autocomplete/THINGS_PROPS.mjs";

import arrayCondNames from "./arrayCondNames.mjs";
const SKIPPRE = 'skipdatalist';


export default class WidgetSkipCondition extends BaseWidget
{
    constructor(managedProp = THINGS_PROPS.SKIP_CONDITION)
    {
        
        super(managedProp);

        this.managedProp = managedProp;

        
        this.currentKind = 0;
        
        this.currentVarId = 0
        
        this.expectedVal = null;
        

        //container for 'select kind' Elements
        this.kindSelector = [];


        this.dataLists = new Map();

        this.varsNames = new Map();



        

        
        // button Button 'remove' (reset frame)
        this.button = new PseudoButton(this.widget, "Remove SkipCondition");
        
        this.button.setStyleB();
        
        this.button.setMarginRight();
        
        this.button.setMarginLeft();

        this.buttonBehavior = (event) => {

            console.log("SkipCond");

            if (JsonManager.thingHasOwnProperty(THINGS_PROPS.FRAME_SUFFIX))
            {

                JsonManager.removeSkipCondition();
    
                this.refresh(true);

            }
        }
        
        this.button.setOnClick(this.buttonBehavior);
        
        this.generateKindSelector(this.widget);

        this.inputElem = addElement('input', this.widget);

        this.populateSTOKAStuff();

        this.inputElem.addEventListener('change', this.confirmVarName);
        

        

        
        // status
        this.info = new TextField(this.widget);

        this.info.setDisabled();

        this.info.addClass(AutoComplete.cssSelectors.classes.marginLeft);

        this.info.removeClass(AutoComplete.cssSelectors.classes.marginRight);

        
        // // test nextFrameButton button
        // this.nextFrameButton = new PseudoButton(this.widget, "⏭️");

        // this.nextFrameButton.addClass(AutoComplete.cssSelectors.classes.emojiContent);

        // this.nextFrameButton.setOnClick(() => studioEvents.emitter.emit(studioEvents.events.tryNextFrame));

    }

    confirmVarName = (event) =>
    {
        console.log("confirmVarNameconfirmVarNameconfirmVarName", event)
        
        const varIdx = +this.inputElem.value;

        this.currentVarId = varIdx;

        console.log(varIdx, this.varsNames.get(this.currentKind)[varIdx]);

    }

    setList(listId)
    {
        this.inputElem.setAttribute('list', SKIPPRE + listId);

        this.currentKind = listId;
    }

    populateSTOKAStuff()
    {
        for (const [idx, condNamesArray] of arrayCondNames.entries())
        {
            console.log("idx, condNamesArray", idx, condNamesArray);

            this.generateDatalist(condNamesArray, idx);
        }
    }

    generateDatalist(arr, kindId)
    {
        const datalist = addElement('datalist', this.widget);
        
        datalist.id = SKIPPRE + kindId;
        
        for (let i = 0; i < arr.length; i++)
        {
            const option = addElement('option', datalist);
            
            option.value = i;
            
            option.text = arr[i];

            console.log("Option stuff", option.value, option.text)
        }
        
        this.dataLists.set(kindId, datalist);

        this.varsNames.set(kindId, arr);
    }

    kindSelectorBehavior = ({target}) => {
        //const {target} = event;
        const gag = GetAttribAsNumber(target, "kind");

        this.setList(gag);

        console.log(target, gag)
    }

    generateKindSelector(container)
    {
        const tempStuff = ["0️⃣", "1️⃣", "2️⃣", "3️⃣"];

        for (const [idx, name] of tempStuff.entries()) 
        {
            console.log(`name: ${name}, idx: ${idx}`);

            const qqq = new PseudoButton(container, name);

            qqq.addClass(AutoComplete.cssSelectors.classes.emojiContent);

            qqq.pseudoButton.setAttribute("kind", idx);

            qqq.setOnClick(this.kindSelectorBehavior);

        }

        return this;
    }

    revealInfo(varIdx, kind)
    {
        // this.info.setInUse(`"${JsonManager.currentThing[THINGS_PROPS.FRAME]}" + ${this.allSelectElements[kind].optionsAry[varIdx]} (${this.enumVarKind[kind]}Idx: ${varIdx})`);

        return this;
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



    refresh(refreshThing)
    {
        console.log("Refresh Skip");
        
        

        

        if (refreshThing)
        {
            JsonManager.showThing();
        }
    }
}