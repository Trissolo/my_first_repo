import studioEvents from "../../../eventEmitter/StudioEvents.mjs";

import JsonManager from "../../../jsonManager/JsonManager.mjs";

import AutoComplete from "../../../autocomplete/AutoComplete.mjs";

import BaseWidget from "../../classes/baseWidget.mjs";
import PseudoButton from "../../classes/pseudoButton.mjs";
import TextField from "../../classes/textField.mjs";

import GetAttribAsNumber from "../../../GetAttribAsNumber.mjs";
import addElement from "../../addElement.mjs";
import THINGS_PROPS from "../../../autocomplete/THINGS_PROPS.mjs";
import addClassToElement from "../../addClassToElement.mjs";

import arrayCondNames from "./arrayCondNames.mjs";
const SKIPPRE = 'skipdatalist';


export default class WidgetSkipCondition extends BaseWidget
{
    constructor(managedProp = THINGS_PROPS.SKIP_CONDITION)
    {
        
        super(managedProp);

        this.managedProp = managedProp;

        
        this.currentKind = null;
        
        this.currentVarId = null;
        
        this.expectedVal = null;
        
        this.assembledCondition = [];

        //container for 'select kind' Elements
        this.kindSelectors = [];


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


        this.populateSTOKAStuff();

        this.generateInputElement(this.widget);

        
        this.generateExpectedValue(this.widget);
        

        

        
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

    getCurrNamesArray()
    {
        if (this.currentKind === null)
        {
            console.warn("currentKind is null!");

            return null;
        }

        return this.varsNames.get(this.currentKind);
    }

    confirmVarName = (event) =>
    {
        
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

        }
        
        this.dataLists.set(kindId, datalist);

        //store the array!
        this.varsNames.set(kindId, arr);
    }

    generateInputElement(container)
    {
        this.inputElem = addElement('input', container);

        this.inputElem.placeholder = "Variable name";

        this.inputElem.addEventListener('change', this.confirmVarName);

    }

    kindSelectorBehavior = ({target}) => {

        this.resetConditionData();

        const gag = GetAttribAsNumber(target, "kind");

        this.setList(gag);

        this.setExpectedValueMax(gag);

        addClassToElement(target, AutoComplete.cssSelectors.classes.bgYellow)

        console.log("MegaTArg", target, gag)
    }

    generateKindSelector(container)
    {
        const tempStuff = ["0️⃣", "1️⃣", "2️⃣", "3️⃣"];

        for (let idx = 0; idx < arrayCondNames.length; idx++)
        // for (const [idx, name] of tempStuff.entries()) 
        {
            // console.log(`name: ${tempStuff[idx]}, idx: ${idx}`);

            const selKindButton = new PseudoButton(container, tempStuff[idx]);

            selKindButton.addClass(AutoComplete.cssSelectors.classes.emojiContent);

            selKindButton.pseudoButton.setAttribute("kind", idx);

            selKindButton.setOnClick(this.kindSelectorBehavior);

            this.kindSelectors.push(selKindButton);

        }

        return this;
    }

    generateExpectedValue(container)
    {
        const inputExpected = addElement('input', container);

        inputExpected.setAttribute("type", "number");

        inputExpected.setAttribute("placeholder", "Expected value");

        inputExpected.setAttribute("min", "0");

        inputExpected.addEventListener('change', this.chooseExpectedValue);

        this.inputExpected = inputExpected;

    }

    manifestData()
    {
        const currAry = this.getCurrNamesArray();

        if (currAry && this.currentVarId)
        {
            console.log(`Manifesting: Cont[${this.currentKind}] Id: ${this.currentVarId} ('${currAry[this.currentVarId]}') === ${this.expectedVal}`);

            this.assembledCondition.length = 0;

            this.assembledCondition.push(this.currentKind, this.currentVarId, this.expectedVal);

            console.dir(this.assembledCondition);

            return this.assembledCondition;
        }
        else
        {
            console.warn('Incomplete cond data!');
        }
    }

    chooseExpectedValue = event => {

        this.expectedVal = +event.target.value;

        console.log("Expected:", this.expectedVal);

        this.manifestData();
    }

    setExpectedValueMax(kind)
    {
        const temp = 1 << (kind + 1);
        this.inputExpected.setAttribute('max', temp - 1);
    }

    revealInfo(varIdx, kind)
    {
        // this.info.setInUse(`"${JsonManager.currentThing[THINGS_PROPS.FRAME]}" + ${this.allSelectElements[kind].optionsAry[varIdx]} (${this.enumVarKind[kind]}Idx: ${varIdx})`);

        return this;
    }

    resetConditionData()
    {
        this.currentKind = null;
        
        this.currentVarId = null;
        
        this.expectedVal = null;


        this.inputElem.value = null;

        this.inputExpected.value = null;

        this.kindSelectors.forEach(el => el.removeClass('bgYellow'));

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