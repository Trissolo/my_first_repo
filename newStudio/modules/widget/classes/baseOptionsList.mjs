import AutoComplete from "../../autocomplete/AutoComplete.mjs";
import addElement from "../addElement.mjs";

export default class OptionsList
{
    constructor(parent, ary, firstOption = "Select")
    {
        this.select = addElement('select', parent);
        this.addClass(AutoComplete.cssSelectors.classes.marginRight);

        this.optionsAry = ary;

        this.select.add(new Option(firstOption, "", true));

        this.buildOptions(ary);
        
    }

    get optsAry()
    {
        return this.optionsAry
    }

    get classList()
    {
        return this.select.classList
    }

    setSelectedIndex(idx = 0)
    {
        this.select.selectedIndex = idx;
    }

    buildOptions(ary = this.optionsAry, selectElem = this.select)
    {
        for (const [idx, elem] of ary.entries())
        {
            const option = document.createElement("option");

            option.text = elem;

            option.value = idx;

            selectElem.add(option);
        }

        //delete all options from select element
        //const x = document.getElementById("mySelect");
        //while (x.length)
        //  {
        //    x.remove(0);
        //    console.log(x.length)
        //  }

        /////////////

        //add one
        //const option = document.createElement("option");
        //option.text = "Kiwi";
        //x.add(option);
        
        return this
    }

    setOnChange(method)
    {
        this.select.addEventListener('change', method);

        return this
    }

    addClass(className)
    {
        this.classList.add(className);

        return this
    }

    // removeClass(className)
    // {
    //     this.classList.remove(className);

    //     return this
    // }
}