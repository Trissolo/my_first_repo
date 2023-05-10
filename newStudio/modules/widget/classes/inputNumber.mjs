import AutoComplete from "../../autocomplete/AutoComplete.mjs";

import addElement from "../addElement.mjs";

export default class inputNumber
{
    inputElement;

    constructor(parent, placeholder)
    {

        const inputElement = addElement('input', parent);

        inputElement.setAttribute("type", "number");

        inputElement.setAttribute("placeholder", placeholder);

        inputElement.setAttribute("min", "0");

        this.inputElement = inputElement;

        return this;

    }

    resetValue()
    {
        this.inputElement.value = null;

        return this;
    }

    setMin(value = 0)
    {
        this.inputElement.setAttribute("min", "" + value);

        return this;
    }

    setMax(value = 1)
    {
        this.inputElement.setAttribute("max", "" + value);

        return this;
    }

    setOnChange(func)
    {
        this.inputElement.addEventListener('change', func);

        return this;
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
}
