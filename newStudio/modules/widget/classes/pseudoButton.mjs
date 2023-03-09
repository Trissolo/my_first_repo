import AutoComplete from "../../autocomplete/AutoComplete.mjs";

import addElement from "../addElement.mjs";

export default class PseudoButton
{
    constructor(parent, text)
    {
        this.pseudoButton = addElement('p', parent, text);

        this.addClass(AutoComplete.cssSelectors.classes.pseudoButton);
    }

    addClass(className)
    {
        this.pseudoButton.classList.add(className);

        return this
    }

    removeClass(className)
    {
        this.pseudoButton.classList.remove(className);

        return this
    }

    setText(text)
    {
        this.pseudoButton.innerText = text;

        return this
    }

    setOnClick(func)
    {
        this.pseudoButton.addEventListener('click', func);

        return this
    }

    setStyleA()
    {
        this.addClass(AutoComplete.cssSelectors.classes.buttonStyleA);

        return this
    }

    setStyleB()
    {
        this.addClass(AutoComplete.cssSelectors.classes.buttonStyleB);

        return this
    }

    setMarginRight()
    {
        this.addClass(AutoComplete.cssSelectors.classes.marginRight);

        return this
    }
    
    setMarginLeft()
    {
        this.addClass(AutoComplete.cssSelectors.classes.marginLeft);

        return this
    }
}
