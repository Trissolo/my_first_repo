import AutoComplete from "../../autocomplete/AutoComplete.mjs";

import addElement from "../addElement.mjs";

export default class TextField
{
    constructor(parent, text, defaultBehavior = true)
    {
        this.textField = addElement('p', parent, text);
        if (defaultBehavior) this.setStandard();
    }

    get classList()
    {
        return this.textField.classList
    }

    addClass(className)
    {
        // this.textField.classList.add(className);
        this.classList.add(className);


        return this
    }

    removeClass(className)
    {
        this.classList.remove(className);

        return this
    }

    setText(text)
    {
        this.textField.innerText = text;

        return this
    }

    setStandard()
    {
        this.addClass(AutoComplete.cssSelectors.classes.textField);

        return this
    }

    setDisabled(text = "---")
    {
        this.addClass(AutoComplete.cssSelectors.classes.textFieldDisabled);
        this.setText(text);

        return this
    }

    setInUse(text = "In use")
    {
        this.removeClass(AutoComplete.cssSelectors.classes.textFieldDisabled);
        this.setText(text);

        return this
    }
}
