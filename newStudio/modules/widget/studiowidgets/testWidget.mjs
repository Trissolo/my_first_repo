import BaseWidget from "../classes/baseWidget.mjs";
import TextField from "../classes/textField.mjs";
import PseudoButton from "../classes/pseudoButton.mjs";

import OptionsList from "../classes/baseOptionsList.mjs";

// import AutoComplete from "../../autocomplete/AutoComplete.mjs";
import THINGS_PROPS from "../../autocomplete/THINGS_PROPS.mjs";
import JsonManager from "../../jsonManager/JsonManager.mjs";
import OnHoverNames from "../../placeholders/OnHoverNames.mjs";

export default class testWidget extends BaseWidget
{
    constructor(managedProp = THINGS_PROPS.HOVER_NAME)
    {
        super(managedProp);

        this.managedProp = managedProp;

        this.button = new PseudoButton(this.widget, "Remove hover name");

        this.selectElem = new OptionsList(this.widget, OnHoverNames, "->Select<-")

        this.info = new TextField(this.widget);

        this.info.setDisabled();

        //
        this.button.setStyleB();

        this.button.setMarginRight();

        this.button.setMarginLeft();


        //
        this.buttonBehavior = (event) => {

            JsonManager.removeHoverName();

            this.refresh(true);
        }

        this.button.setOnClick(this.buttonBehavior);

        this.selectElem.setOnChange(this.onChange);

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

    refresh(refreshThing)
    {
        if (JsonManager.thingHasOwnProperty(this.managedProp)) //currentThing.hasOwnProperty(this.managedProp))
        {
            const idx = JsonManager.currentThing[this.managedProp];

            this.info.setInUse(`on pointerover: ${this.selectElem.optionsAry[idx]} (${idx})`);

            this.selectElem.setSelectedIndex(idx + 1);
        }

        else
        {
            this.info.setDisabled();

            this.selectElem.setSelectedIndex();
        }

        if (refreshThing)
        {
            JsonManager.showThing();
        }
    }

    // lastCharIsDigit(str, pos = str.length - 1)
    // {
    //     const lastChar = str.charCodeAt(pos);

    //     return lastChar < 58 && lastChar > 47;
    // }

}
