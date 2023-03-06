// qwert()
// {
//     const HoverNamesList = this.addElement('select', subCont)
//     HoverNamesList.add( new Option("Select Hover Name:", "", true))
//     this.buildOptions(HoverNamesList, hoverNames)
//     HoverNamesList.addEventListener('change', this.hoverNamesListOnchange.bind(this))
// }

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

    // get classList()
    // {
    //     return this.textField.classList
    // }

    addClass(className)
    {
        this.select.classList.add(className);


        return this
    }

    // removeClass(className)
    // {
    //     this.classList.remove(className);

    //     return this
    // }
}