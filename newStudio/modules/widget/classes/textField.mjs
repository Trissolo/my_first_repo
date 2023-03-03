import AutoComplete from "../../autocomplete/AutoComplete.mjs";

import addElement from "../addElement.mjs";

export default class TextField
{
    constructor(parent, text)
    {
        this.textField = addElement('p', parent, text)
    }

    addClass(className)
    {
        this.textField.classList.add(className);

        return this
    }

    removeClass(className)
    {
        this.textField.classList.remove(className);

        return this
    }

    setText(text)
    {
        this.textField.innerText = text;

        return this
    }
}
