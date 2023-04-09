import VarsProps from "./VarsProps.mjs";

import VarsIds from "./VarsIds.mjs";

import Conditions from "../../../newStudio/modules/placeholders/Conditions.mjs";

const {ToXY} = Phaser.Math;

export default class AllVarsManager
{
    static typedArrays = new Map();

    static recycledVec = new Phaser.Math.Vector2();

    // sort of constructor
    static initialize(varsDesc = [ Conditions, [null], [null], [null] ]) // ["BoolTest"], twoBitsNames = boolsNames, nibblesNames = boolsNames, bytesNames = boolsNames)
    {
        //size in bit
        const typedArraySize = 32;

        for (let i = 0; i < VarsProps.size; i++)
        {
            const {size /*, bitmask*/ } = VarsProps.get(i);

            if (varsDesc[i].length)
            {
                this.typedArrays.set(i, new Uint32Array(Math.ceil(varsDesc[i].length * size / typedArraySize)));
            }

        }

        // this.typedArrays.set(VarsIds.BOOLS, new Uint32Array(Math.ceil( boolsNames.length / typedArraySize)));

        // this.typedArrays.set(VarsIds.TWOBIT, new Uint32Array(Math.ceil(twoBitsNames.length * varSizes.TWOBIT / typedArraySize)));

        // this.typedArrays.set(VarsIds.NIBBLE, new Uint32Array(Math.ceil(nibblesNames.length * varSizes.NIBBLE / typedArraySize)));

        // this.typedArrays.set(VarsIds.BYTE, new Uint32Array(Math.ceil((bytesNames.length * varSizes.BYTE)/ typedArraySize)));

    }

    static readVar(kind, varIdx)
    {
        const typedArray = this.typedArrays.get(kind);

        if (kind === 0)
        {
            const {x, y} = ToXY(varIdx, 32, typedArray.length, this.recycledVec);

            return (typedArray[y] >>> x) & 1;
        }
        const {bitmask, size} = VarsProps.get(kind);

        // Maybe it's better to place the constant 'width' inside in VarsProps?
        const {x, y} = ToXY(varIdx, 32 / size, typedArray.length, this.recycledVec);

        const res = this.readContiguous(kind, x, y, size, bitmask, typedArray);

        
        return this.readContiguous(kind, x, y, size, bitmask, typedArray);

    }

    static readContiguous(kind, x, y, size, bitMask, typedArray = this.typedArrays.get(kind))
    {
        return (typedArray[y] >>> x * size) & bitMask;
    }

    static clearContiguous(kind, x, y, size, bitMask)
    {
        const typedArray = this.typedArrays.get(kind);

        typedArray[y] &= ~(bitMask << x * size);

        return 0;
    }

    // bools (1-bit) specific:
    static setBitOn(varIdx, typedArray = this.typedArrays.get(0))
    {
        const {x, y} = ToXY(varIdx, 32, typedArray.length, this.recycledVec);

        typedArray[y] |= (1 << x);
        
        return 1;
    }

    static setBitOff(varIdx, typedArray = this.typedArrays.get(0))
    {
        const {x, y} = ToXY(varIdx, 32, typedArray.length, this.recycledVec);

        typedArray[y] &= ~(1 << x);
        
        return 0;
    }

    static toggleBit(varIdx, typedArray = this.typedArrays.get(0))
    {
        const {x, y} = ToXY(varIdx, 32, typedArray.length, this.recycledVec);

        typedArray[y] ^= (1 << x);

        return (typedArray[y] >>> x) & 1;
    }
}

////
// class TestGenericVars
// {
//     static typedArray = new Uint32Array(2);

//     //    static constructor()
//     //    {
//     //        this.typedArray[0] = 28081;
//     //    }

//     static setFromInteger(val, y = 0)
//     {
//         this.typedArray[y] = val;
//     }

//     static readContiguous(x, size = 2, bitMask = 0x3, y = 0)
//     {
//         return (this.typedArray[y] >>> x * size) & bitMask;
//     }

//     static clearContiguous(x, size = 2, bitMask = 0x3, y = 0)
//     {
//         this.typedArray[y] &= ~(bitMask << x * size);
//     }

//     static toString(x, size = 2, bitMask = 0x3, y = 0)
//     {
//         const str = this.readContiguous(x, size, bitMask, y);

//         return str.toString(2).padStart(size, "0");
//     }
// }

// //const gag = new TestGenericVars();

// TestGenericVars.setFromInteger(28081);

// TestGenericVars.clearContiguous(3, 4, 0xf);

// for (let i = 0; i < 6; i++)
// {
//     console.log(`\n${i})`)

//     console.log(TestGenericVars.toString(i, 8, 0xff))
// }
