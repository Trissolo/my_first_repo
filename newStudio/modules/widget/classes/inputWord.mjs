import AutoComplete from "../../autocomplete/AutoComplete.mjs";

import addElement from "../addElement.mjs";

export default class inputElement
{
    constructor(parent, placeholder)
    {
        this.inputElement = addElement('input', parent);

        this.inputElem.placeholder = placeholder;
    }

    addClass(className)
    {
        this.inputElement.classList.add(className);

        return this;
    }

    removeClass(className)
    {
        this.inputElement.classList.remove(className);

        return this;
    }

    resetValue()
    {
        this.inputElem.value = null;

        return this;
    }

    getValueAsNum()
    {
        return +this.inputElem.value;
    }

    bindToList(listId)
    {
        this.inputElem.setAttribute('list', listId);
    }

    setOnChange(func)
    {
        this.inputElement.addEventListener('change', func);

        return this;
    }

    // setStyleA()
    // {
    //     this.addClass(AutoComplete.cssSelectors.classes.buttonStyleA);

    //     return this;
    // }

    // setStyleB()
    // {
    //     this.addClass(AutoComplete.cssSelectors.classes.buttonStyleB);

    //     return this;
    // }

    setMarginRight()
    {
        this.addClass(AutoComplete.cssSelectors.classes.marginRight);

        return this;
    }
    
    setMarginLeft()
    {
        this.addClass(AutoComplete.cssSelectors.classes.marginLeft);

        return this;
    }

    setHidden(param = false)
    {
        param? this.removeClass(AutoComplete.cssSelectors.classes.notDisplayed) : this.addClass(AutoComplete.cssSelectors.classes.notDisplayed)

        return this;
    }
}
