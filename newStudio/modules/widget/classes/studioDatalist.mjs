import addElement from "../addElement.mjs";

export default class studioDatalist
{
    static generateDatalist = (optionsArray, id, parent) =>
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
