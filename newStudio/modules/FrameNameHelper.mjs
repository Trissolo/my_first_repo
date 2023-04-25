export default class FrameNameHelper
{
    static regexpEndingDigits = /([0-9]+$)/;

    static calcFrameName(name)
    {

        const match = name.search(this.regexpEndingDigits);

        const prefix = name.substring(0, match);
        
        return match === -1 ? name : prefix;

        // return prefix.length ? prefix : name;


        // const num = name.substring(match, name.length);

        // console.log(name, match, prefix, num);

        // return [prefix, num];

    }

    static cutOffEndingDigits(name)
    {

        if (this.lastCharIsDigit(name))
        {

            return name.substring(0, name.search(this.regexpEndingDigits));

        }
      
        return name;

    }

    static lastCharIsDigit(name)
    {
        const lastChar = name.charCodeAt(name.length - 1);

        return lastChar < 58 && lastChar > 47;
    }
}
