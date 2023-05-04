import addElement from "../addElement.mjs";

import OnHoverNames from "../../placeholders/OnHoverNames.mjs";

import InGameArrays from "../../placeholders/InGameArrays.mjs";

// import AutoComplete from "../../autocomplete/AutoComplete.mjs";

export default class studioDatalist
{
    // static originalArrays = new Map();

    // static arrayIds = AutoComplete.arrayIds;

    // static storeArray(key, array)
    // {
    //     this.originalArrays.set(key, array);
    // }

    static initialize()
    {
        // this.storeArray(this.arrayIds.HoverNames, OnHoverNames);

        this.generateDatalist(InGameArrays.originalArrays.get(InGameArrays.arrayIds.HoverNames), InGameArrays.arrayIds.HoverNames);

        return this;
    }




    // static getArray(identifier)
    // {
    //     return this.originalArrays.get(identifier);
    // }

    // static getStringfromArray(index, arrayId)
    // {
    //     const ary = this.originalArrays.get(arrayId);

    //     if (ary)
    //     {
    //         return ary[index];
    //     }

    //     return null;
    // }

    static generateDatalist = (optionsArray, id, parent = document.body) =>
    {
        const datalist = addElement('datalist', parent);
        
        datalist.id = id;
        
        for (let i = 0; i < optionsArray.length; i++)
        {
            const option = addElement('option', datalist);
            
            option.value = i;
            
            option.text = optionsArray[i];

        }

        return datalist;
    }
}
