const {clear, log, dir} = console
clear();

// debug stuff
const chunk = (arr, size) => Array.from(
    {length: Math.ceil(arr.length / size)}, (v, i) => arr.slice(i * size, i * size + size)
);

const debugSeparator = "───┐"

const recSep = [7, 6, 5, 4, 3, 2, 1, 0].join(debugSeparator) + debugSeparator;


class NibblesManager
{
    // ATM hardcoded
    static nibblesContainer = new Uint32Array(1);

    static setFromInt(int, pos = 0)
    {
        this.nibblesContainer[pos] = int;
    }

    static rawString(abnum, size = 32)
    {
        return abnum.toString(2).padStart(size, "0");
    }

    static showUint32(idx = 0)
    {
        return this.rawString(this.nibblesContainer[idx]);
    }

    static chunk(arr, size)
    {
        return Array.from( {length: Math.ceil(arr.length / size)}, (v, i) => arr.slice(i * size, i * size + size) );
    }

    static debugToConsole(idx = 0)
    {
        console.log(
            this.chunk(
                this.showUint32(idx)
                .split(""), 4)
                .join("│")
                .replaceAll(",", "")+"│"
                );
    }
    
    static readNibble(x, y = 0)
    {
        return (this.nibblesContainer[y] >>> x * 4) & 0xf;
    }

    static clearNibble(x, y = 0)
    {
        this.nibblesContainer[y] &= ~(0xF << x * 4)
    }

    static setNibble(value, x, y = 0)
    {
        this.clearNibble(x, y);

        this.nibblesContainer[y] |= (value << x * 4);
    }

    static nibbleCoordsTable()
    {
        let res = "";
    
        // Nibble size:
        const size = 4;
    
        for (let i = 32; i--; /* */ )
        {
            const quibus = Math.floor(i / size);
    
            const relPos = i - quibus * size;
    
            //Align
            res += i < 10 ? " " : "";
    
            res += `${i} [${quibus}][${relPos}]\n`;
    
            // Separate text block
            if (relPos === 0) res += "\n";
        }
    
        return res;
    }
    
}


NibblesManager.setFromInt(0xdddddddd);
NibblesManager.setNibble(15, 2);
NibblesManager.setNibble(5, 1);
NibblesManager.setNibble(0, 7);
NibblesManager.setNibble(0, 0);

log(chunk((NibblesManager.showUint32())
        .split(""), 4)
    .join("-")
    .replaceAll(",", ""));

NibblesManager.setNibble(9, 2);

log(recSep);

NibblesManager.debugToConsole();

console.log(NibblesManager.readNibble(2).toString(2));
