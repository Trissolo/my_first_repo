import studioEvents from "../../../eventEmitter/StudioEvents.mjs";

import JsonManager from "../../../jsonManager/JsonManager.mjs";

import AutoComplete from "../../../autocomplete/AutoComplete.mjs";

import BaseWidget from "../../classes/baseWidget.mjs";
import PseudoButton from "../../classes/pseudoButton.mjs";
import TextField from "../../classes/textField.mjs";
import inputWord from "../../classes/inputWord.mjs";

import GetAttribAsNumber from "../../../GetAttribAsNumber.mjs";
import addElement from "../../addElement.mjs";
import THINGS_PROPS from "../../../autocomplete/THINGS_PROPS.mjs";
import addClassToElement from "../../addClassToElement.mjs";

import arrayCondNames from "./arrayCondNames.mjs";

import InGameArrays from "../../../placeholders/InGameArrays.mjs";
import studioDatalist from "../../classes/studioDatalist.mjs";


console.dir("arrayCondNames", arrayCondNames)
export default class WidgetSkipCondition extends BaseWidget
{
    currentKind;
    currentVarId;
    expectedVal;
    
    assembledCondition = [];

    button;
    inputElem;
    inputExpected;

    varsNames = InGameArrays.originalArrays;
    skipPrefix = studioDatalist.prefixVarsDatalist;

    //container for 'select kind' Elements
    kindSelectors = [];

    constructor(managedProp = THINGS_PROPS.SKIP_CONDITION)
    {
        
        super(managedProp);

        this.managedProp = managedProp;


        const container = this.widget

        this.buildButton(container);
        
        this.generateKindSelector(container);

        this.generateInputElement(container);
        
        this.generateExpectedValue(container);
        
        // status
        this.generateInfoField(container);

        this.folliaSet()
        
        
    }

    generateInfoField(container)
    {
        const info = new TextField(container)
            .setDisabled()
            .addClass(AutoComplete.cssSelectors.classes.marginLeft)
            .removeClass(AutoComplete.cssSelectors.classes.marginRight);

        this.info = info;   
    }

    buildButton(container)
    {

        const button = new PseudoButton(container, "Remove SkipCondition");
        
        button.setStyleB()
            .setMarginRight()
            .setMarginLeft()
            .setOnClick(this.buttonBehavior);

        this.button = button;
    }

    buttonBehavior = (event) => {

        console.log("SkipCond");

        if (JsonManager.thingHasOwnProperty(THINGS_PROPS.FRAME_SUFFIX))
        {

            JsonManager.removeSkipCondition();

            this.refresh(true);

        }
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
        const varIdx = this.inputElem.getValueAsNum();

        this.currentVarId = varIdx;

        // studioDatalist.prefixVarsDatalist
        console.log("confirmVarName", varIdx, this.varsNames.get(this.currentKind)[varIdx]);

    }

    setList(listId)
    {
        this.inputElem.bindToList(this.skipPrefix + listId); // setAttribute('list', this.skipPrefix + listId);

        this.currentKind = listId;

    }

    generateInputElement(container)
    {
        this.inputElem = new inputWord(container, "Variable name")
            .setOnChange(this.confirmVarName);
    }

    kindSelectorBehavior = ({target}) => {


        this.resetConditionData();

        const gag = GetAttribAsNumber(target, "kind");

        this.setList(gag);

        this.setExpectedValueMax(gag);

        addClassToElement(target, AutoComplete.cssSelectors.classes.bgYellow)

        console.log("MegaTArg", target, gag, this.kindSelectors[0].pseudoButton === target)
    }

    generateKindSelector(container)
    {
        const tempStuff = ["0️⃣", "1️⃣", "2️⃣", "3️⃣"];

        let idx = 0;

        do {
            console.log("ISD:", idx)

            const selKindButton = new PseudoButton(container, tempStuff[idx]);

            selKindButton.addClass(AutoComplete.cssSelectors.classes.emojiContent);

            selKindButton.pseudoButton.setAttribute("kind", idx);

            selKindButton.setOnClick(this.kindSelectorBehavior);

            this.kindSelectors.push(selKindButton);

        } while (this.varsNames.has(++idx))

        
        // console.dir("this.kindSelectors", this.kindSelectors[0].pseudoButton, this.kindSelectors[0].pseudoButton.target)

        return this;
    }

    folliaSet()
    {
        const temp = this.kindSelectors[0].pseudoButton;
        console.log("temp", temp)
        temp.target = 0;
        temp.click();
        // this.kindSelectorBehavior(temp);
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


        this.inputElem.resetValue(); // value = null;

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