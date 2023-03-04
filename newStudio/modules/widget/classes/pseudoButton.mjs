import AutoComplete from "../../autocomplete/AutoComplete.mjs";

import addElement from "../addElement.mjs";

export default class PseudoButton
{
    constructor(parent, text)
    {
        this.pseudoButton = addElement('p', parent, text)
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
}