import studioEvents from "../../../eventEmitter/StudioEvents.mjs";

import JsonManager from "../../../jsonManager/JsonManager.mjs";

import conditionOrganizer from "../../../conditionOrganizer/conditionOrganizer.mjs";

import AutoComplete from "../../../autocomplete/AutoComplete.mjs";

import BaseWidget from "../../classes/baseWidget.mjs";
import PseudoButton from "../../classes/pseudoButton.mjs";
import TextField from "../../classes/textField.mjs";
import inputWord from "../../classes/inputWord.mjs";
import inputNumber from "../../classes/inputNumber.mjs";

import GetAttribAsNumber from "../../../GetAttribAsNumber.mjs";
import addElement from "../../addElement.mjs";
import addVerticalDivider from "../../addVerticalDivider.mjs";
import THINGS_PROPS from "../../../autocomplete/THINGS_PROPS.mjs";
import addClassToElement from "../../addClassToElement.mjs";

import arrayCondNames from "./arrayCondNames.mjs";

import InGameArrays from "../../../placeholders/InGameArrays.mjs";
import studioDatalist from "../../classes/studioDatalist.mjs";


console.dir("arrayCondNames", arrayCondNames)
export default class WidgetSkipCondition extends BaseWidget
{
    divTop;

    //container for 'select kind' Elements
    kindSelectors = [];
    inputVarIdx;
    inputExpected;


    divBottom;

    infoFields = [];
    fieldVarKind;
    fieldVarId;
    fieldExpectedVal;

    // shortcut?
    varsNames = InGameArrays.originalArrays;

    // 'datalist' pr
    skipPrefix = studioDatalist.prefixVarsDatalist;




    constructor(managedProp = THINGS_PROPS.SKIP_CONDITION)
    {
        
        super(managedProp);

        this.managedProp = managedProp;

        
        this.divTop = addElement('div', this.widget);

        this.divBottom = addElement('div', this.widget);


        // const container = this.widget;

        // console.dir("container", this)
        // this.addClass(AutoComplete.cssSelectors.classes.bgYellow);

        // this.buildButton(container);
        
        this.generateKindSelector(this.divTop);

        // this.generateInputElement(container);
        this.generateInputVarIdx(this.divTop);
        
        this.generateExpectedValue(this.divTop);
        
        // status
        this.generateInfoFields(this.divBottom);
    
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


        } while (this.varsNames.has(++idx));

        
        // console.dir("this.kindSelectors", this.kindSelectors[0].pseudoButton, this.kindSelectors[0].pseudoButton.target)

        return this;
    }

    kindSelectorBehavior = event => {
        console.log("eve!", event)

        const {target: kindButton} = event;
        
        const {simplifiedCondition} = conditionOrganizer;

        // appearance
        const {bgYellow} = AutoComplete.cssSelectors.classes;

        this.kindSelectors.forEach(el => el.removeClass(bgYellow));

        kindButton.classList.add(bgYellow);


        // get the selected kind, reset the whole condition and set the new kind
        const correspondingKind = GetAttribAsNumber(kindButton, "kind");

        //reset varIdx
        this.inputVarIdx.bindToList(this.skipPrefix + correspondingKind).resetValue();
        conditionOrganizer.setVarIdx(undefined);

        this.setExpectedValueMax(correspondingKind);

        conditionOrganizer.setKind(correspondingKind);

        
        conditionOrganizer.currentVarId = 56;
        // conditionOrganizer.currentExpectedVal = [0,7]
        console.log(simplifiedCondition, simplifiedCondition.currentExpectedVal);

        studioEvents.emitter.emit(studioEvents.events.conditionSetKind, correspondingKind);
    }

    generateInfoFields(container)
    {
        this.fieldVarKind = new TextField(container)
            .setDisabled()
            .addClass(AutoComplete.cssSelectors.classes.marginLeft)
            .removeClass(AutoComplete.cssSelectors.classes.marginRight);

    //     this.fieldVarKind = fieldVarKind;

        this.fieldVarId = new TextField(container, "orco")
            // .setDisabled()
            .addClass(AutoComplete.cssSelectors.classes.marginLeft)
            .removeClass(AutoComplete.cssSelectors.classes.marginRight);
        
    //     this.fieldVarId = fieldVarId;

    //     const fieldExpectedVal = new TextField(container)
    //         .setDisabled()
    //         .addClass(AutoComplete.cssSelectors.classes.marginLeft)
    //         .removeClass(AutoComplete.cssSelectors.classes.marginRight);
        
    //     // this.fieldExpectedVal = fieldExpectedVal;
        studioEvents.emitter.on(studioEvents.events.conditionSetKind, this.showKindInField, this);
    }

    showKindInField(val)
    {
        this.fieldVarKind.setInUse(InGameArrays.VarKindEnum[val]);
    }

    generateInputVarIdx(container)
    {
        this.inputVarIdx = new inputWord(container, 'Variable name...').setOnChange(this.onChangeInputVarIdx);

        studioEvents.emitter.on(studioEvents.events.conditionChangedVarIdx, this.showVarInField); //(a,b) => { console.log("invoked PUTT",a,b)});

        return this;
    }

    onChangeInputVarIdx = (event) => {

        console.log("onChangeInputVarIdxonChangeInputVarIdxonChangeInputVarIdx")
        const varIdx = this.inputVarIdx.getValueAsNum();

        // conditionOrganizer.setVarIdx(event.target.value);
        conditionOrganizer.setVarIdx(varIdx);

    }

    showVarInField = (idx, varString) =>
    {
        if (typeof varString === 'string')
        {
            this.fieldVarId.setInUse(varString);
        }
        else
        {
            this.fieldVarId.setText("NONC'È!")
        }
    }

    // buildButton(container)
    // {

    //     const button = new PseudoButton(container, "Remove SkipCondition");
        
    //     button.setStyleB()
    //         .setMarginRight()
    //         .setMarginLeft()
    //         .setOnClick(this.buttonBehavior);

    //     this.button = button;
    // }

    // buttonBehavior = (event) => {

    //     console.log("SkipCond");

    //     if (JsonManager.thingHasOwnProperty(THINGS_PROPS.FRAME_SUFFIX))
    //     {

    //         JsonManager.removeSkipCondition();

    //         this.refresh(true);

    //     }
    // }

    // confirmVarName = (event) =>
    // {
    //     const varIdx = this.inputElem.getValueAsNum();

    //     conditionOrganizer.currentVarId = varIdx;

    //     // studioDatalist.prefixVarsDatalist
    //     // this.fieldVarId.setText(conditionOrganizer.testGetSelVarName());
    //     this.fillFields();

    //     console.log("confirmVarName", varIdx, this.varsNames.get(conditionOrganizer.currentKind)[varIdx]);

    // }

    // setList(listId)
    // {
    //     this.inputElem.bindToList(this.skipPrefix + listId);

    //     conditionOrganizer.currentKind = listId;

    // }

    // generateInputElement(container)
    // {
    //     this.inputElem = new inputWord(container, "Variable name")
    //         .setOnChange(this.confirmVarName);
    // }

    // kindSelectorBehavior = ({target}) => {


    //     this.resetConditionData();

    //     const gag = GetAttribAsNumber(target, "kind");

    //     this.setList(gag);

    //     this.fieldVarKind.setText(InGameArrays.VarKindEnum[gag]);

    //     this.setExpectedValueMax(gag);

    //     addClassToElement(target, AutoComplete.cssSelectors.classes.bgYellow)

    //     console.log("MegaTArg", target, gag, this.kindSelectors[0].pseudoButton === target)
    // }

    // folliaSet()
    // {
    //     const temp = this.kindSelectors[0].pseudoButton;
    //     console.log("temp", temp)
    //     temp.target = 0;
    //     temp.click();
    //     // this.kindSelectorBehavior(temp);
    // }

    generateExpectedValue(container)
    {
        const inputExpected = new inputNumber(container, "Expected value...");

        inputExpected.addClass(AutoComplete.cssSelectors.classes.tinywidth);

        // inputExpected.setOnChange(this.chooseExpectedValue);

        this.inputExpected = inputExpected;

    }

    // manifestData()
    // {

    //         // conditionOrganizer.getSimplifiedConditionArray();

    //         console.log("simplifiedCondition", conditionOrganizer.simplifiedCondition);


    //         console.dir("parsed", conditionOrganizer.parseCondArray());

    //         console.log(conditionOrganizer);

    //         this.fillFields();

    //         return conditionOrganizer
    // }

    // clearSimplifiedCondition()
    // {
    //     this.simplifiedCondition.length = 0; 
    // }

    // chooseExpectedValue = event => {

    //     conditionOrganizer.setExpectedVal(+event.target.value)

    //     console.log("Expected CO:", conditionOrganizer.currentExpectedVal);

    //     this.manifestData();
    // }

    setExpectedValueMax(kind)
    {
        const temp = 1 << (kind + 1);

        this.inputExpected.setMax(temp - 1);
    }

    // revealInfo(varIdx, kind)
    // {
    //     // this.info.setInUse(`"${JsonManager.currentThing[THINGS_PROPS.FRAME]}" + ${this.allSelectElements[kind].optionsAry[varIdx]} (${this.enumVarKind[kind]}Idx: ${varIdx})`);

    //     return this;
    // }

    // resetConditionData()
    // {
    //     conditionOrganizer.resetSimplifiedCondition();

    //     this.inputElem.resetValue();

    //     this.inputExpected.resetValue();

    //     this.kindSelectors.forEach(el => el.removeClass('bgYellow'));

    //     this.fieldVarId.setDisabled();
        
    //     this.fieldExpectedVal.setDisabled();

    // }

    // fillFields()
    // {
    //     const [currentKind, currentVarId, currentExpectedVal] = conditionOrganizer.parseCondArray();

    //     console.log("fillFields", currentKind, currentVarId, currentExpectedVal);
    //     this.fieldVarKind.setText(currentKind);

    //     typeof conditionOrganizer.currentVarId === AutoComplete.codeStrings.NUMBER?  this.fieldVarId.setInUse(currentVarId) : this.fieldVarId.setDisabled();

    //     typeof conditionOrganizer.currentExpectedVal === AutoComplete.codeStrings.NUMBER?  this.fieldExpectedVal.setInUse(currentExpectedVal) : this.currentExpectedVal.setDisabled();

    //     // this.fieldExpectedVal.setText(currentExpectedVal);
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