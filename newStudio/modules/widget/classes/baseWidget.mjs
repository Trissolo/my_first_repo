import AutoComplete from "../../autocomplete/AutoComplete.mjs";

import addElement from "../addElement.mjs";


export default class BaseWidget
{
    constructor(name)
    {
        this.case = addElement('div', document.getElementById("demo"));
        this.title = addElement('h4', this.case, name);
        this.widget = addElement('div', this.case, "-- Content --");

        this.title.addEventListener('click', this.clickedTitle)

    }

    addClass(className)
    {
        this.widget.classList.add(className);

        return this
    }

    removeClass(className)
    {
        this.widget.classList.remove(className);

        return this
    }
    
    hide()
    {
        this.widget.hidden = true;

        return this
    }
    
    show()
    {
        this.widget.hidden = false;

        return this
    }
    
    setHidden(param)
    {
        this.widget.hidden = param? false : true;

        return this
    }
    
    toggleHidden()
    {
        this.widget.hidden = !this.widget.hidden;

        return this
    }
    
    clickedTitle = (event) => {
        this.toggleHidden()
    }


    /**buildSingleWidget(name = "TEST NAME", addNameAsProp = false)
    {
        const {addElement} = this

        const widgetCase = addElement('div', document.getElementById('studioContainer'))
        const title = addElement("h4", widgetCase, name)

        const wCommands = addElement("div", widgetCase)
        wCommands.classList.add("sub-cont")

        if (addNameAsProp)
        {
            widgetCase.setAttribute("name", name)
        }

        return widgetCase
        //const buttonAdd = addElement("i", wCommands, "Add " + name)
        //buttonAdd.addEventListener('click', this.prevThing.bind(this))
    } */
}
