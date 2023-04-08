import AutoComplete from "../../autocomplete/AutoComplete.mjs";

import addElement from "../addElement.mjs";


export default class BaseWidget
{
    // managedProp = null;
    // refresh = null;

    constructor(name)
    {
        this.case = addElement('div', document.getElementById(AutoComplete.cssSelectors.ids.GUI_widgets));
        this.title = addElement('h4', this.case, name);
        this.widget = addElement('div', this.case);


        this.title.addEventListener('click', this.clickedTitle);
        
        this.addClass(AutoComplete.cssSelectors.classes.widget_container)
    }

    addClass(className)
    {
        this.widget.classList.add(className);

        return this;
    }

    removeClass(className)
    {
        this.widget.classList.remove(className);

        return this;
    }
    
    hide()
    {
        this.widget.hidden = true;

        return this;
    }
    
    show()
    {
        this.widget.hidden = false;

        return this;
    }
    
    setHidden(param)
    {
        this.widget.hidden = param? false : true;

        return this;
    }
    
    toggleHidden()
    {
        this.widget.hidden = !this.widget.hidden;

        return this;
    }
    
    clickedTitle = (event) => {
        this.toggleHidden();
    }

    refresh()
    {
        console.log("Refresh call", this.title.textContent);
    }

}
