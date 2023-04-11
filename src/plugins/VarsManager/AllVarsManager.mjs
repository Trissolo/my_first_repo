// import VarsProps from "./VarsProps.mjs";
import BITS_PER_TYPED_ARRAY_ELEMENT from "./BITS_PER_TYPED_ARRAY_ELEMENT.mjs";

// import Conditions from "../../../newStudio/modules/placeholders/Conditions.mjs";

const {ToXY} = Phaser.Math;

export default class AllVarsManager
{
    // Variable containers
    static varContainers = new Map();

    // Recycle when infering coords
    static recycledVec = new Phaser.Math.Vector2();

    // map for Grab
    static mappedReadVar = new Map();


    // Calculate coords:

    /*
    * @param {number} varIdx - 
    * @param {number} height -
    */

    static grabBoolCoords(varIdx, height)
    {
        return ToXY(varIdx, 32, height, this.recycledVec);
    };


    /*
    * @param {number} varIdx - 
    * @param {number} width -
    * @param {number} height - 
    */
    static grabCoords(varIdx, width, height)
    {
        return ToXY(varIdx, width, height, this.recycledVec);
    }

    /*
    * @param {number} x - bit offset
    * @param {number} y - typedArray index
    * @param {number} size - Bit size of the Variable (i.e. 1 for Bool / 4 for Nibble)
    * @param {number} bitmask -
    * @param {Uint32Array} typedArray -
    */

    static clearContiguous(x, y, size, bitmask, typedArray)
    {
        typedArray[y] &= ~(bitmask << x * size);

        return 0;
    }

    // sort of constructor
    static initialize()
    {      
        console.log("New INITIALIZE");

        // generate default varContainers:
        // key: 0 -> BOOL = 1 bits [0-1],
        // key: 1 -> CRUMBLE = 2 bits [0-3],
        // key: 2 -> NIBBLE = 4 bits [0-15],
        // key: 3 -> BYTE = 8 bits [0-255]

        for (let kind = 0; kind < 4; kind++)
        {

            this.varContainers.set(this.varContainers.size, this.createByKind(kind));

        }
        
        // Map to bifurcate

        this.mappedReadVar.set(false, this.readVarFalse);

        this.mappedReadVar.set(true, this.readVarTrue);

    }  // end Initialize

    static setVar(containerIdx, varIdx, newValue)
    {
        const container = this.varContainers.get(containerIdx);

        const {typedArray, varsPerElement, varSize, bitmask} = container;

        // get coords
        const {x, y} = AllVarsManager.grabCoords(varIdx, varsPerElement, typedArray.length);

        //clear
        typedArray[y] &= ~(bitmask << x * varSize);

        //finally
        if (newValue !== 0)
        {
            typedArray[y] |= (newValue << x * varSize);
        }

        return newValue;
    }

    // set a specific bit to '1'
    // note that the first argument is 'varIdx', not the varContainer index!
    static setBitOn(varIdx, containerIdx = 0)
    {
        const {typedArray} = this.varContainers.get(containerIdx);

        const {x, y} = AllVarsManager.grabBoolCoords(varIdx, typedArray.length);

        typedArray[y] |= (1 << x);
        
        return 1;
    }

    // set a specific bit to '0'
    // note that the first argument is 'varIdx', not the varContainer index!

    static setBitOff(varIdx, containerIdx = 0)
    {
        const {typedArray} = this.varContainers.get(containerIdx);

        const {x, y} = AllVarsManager.grabBoolCoords(varIdx, typedArray.length);

        typedArray[y] &= ~(1 << x);

        return 0;
    }

    // set a specific bit to '0'
    // note that the first argument is 'varIdx', not the varContainer index!
    static toggleBit(varIdx, containerIdx = 0)
    {
        const {typedArray} = this.varContainers.get(containerIdx);

        const {x, y} = AllVarsManager.grabBoolCoords(varIdx, typedArray.length);

        typedArray[y] ^= (1 << x);

        return (typedArray[y] >>> x) & 1;
    }

    static readVarTrue(container, varIdx)
    {

        const {typedArray} = container;

        const {x, y} = AllVarsManager.grabBoolCoords(varIdx, typedArray.length);

        return (typedArray[y] >>> x) & 1;
    }

    static readVarFalse(container, varIdx)
    {

        const {typedArray, varsPerElement, varSize, bitmask} = container;

        const {x, y} = AllVarsManager.grabCoords(varIdx, varsPerElement, typedArray.length);

        return (typedArray[y] >>> x * varSize) & bitmask;
    }

    static readVar(containerIdx, varIdx)
    {
        const container = this.varContainers.get(containerIdx);

        return this.mappedReadVar.get(container.isBool)(container, varIdx);
    }



    // static clearBool = (varIdx) => {

    //     console.log('Arrow clearBit');

    //     const {typedArray} = this.varContainers.get(0);

    //     const {x, y} = this.grabBoolCoords(varIdx, typedArray.length);

    //     typedArray[y] &= ~(1 << x);

    //     return 0;

    // }

    // static clearVar(containerIdx, varIdx)
    // {
    //     const container = this.varContainers.get(containerIdx);

    // }


    
    // static readContiguous(x, y, typedArray, varSize, bitmask)
    // {
    //     return (typedArray[y] >>> x * varSize) & bitmask;
    // }

    // static getBoolCoords(varIdx, typedArray)
    // {
    //     return ToXY(varIdx, 32, typedArray.length, this.recycledVec);
    // }


    

    // static setNibble(value, x, y = 0)
    // {
    //     this.clearNibble(x, y);

    //     this.nibblesContainer[y] |= (value << x * 4);
    // }


    // bools (1-bit) specific:
    // static setBitOn(varIdx, typedArray = this.varContainers.get(0))
    // {
    //     const {x, y} = ToXY(varIdx, 32, typedArray.length, this.recycledVec);

    //     typedArray[y] |= (1 << x);
        
    //     return 1;
    // }

    // static setBitOff(varIdx, typedArray = this.varContainers.get(0))
    // {
    //     const {x, y} = ToXY(varIdx, 32, typedArray.length, this.recycledVec);

    //     typedArray[y] &= ~(1 << x);
        
    //     return 0;
    // }

    // static toggleBit(varIdx, typedArray = this.varContainers.get(0))
    // {
    //     const {x, y} = ToXY(varIdx, 32, typedArray.length, this.recycledVec);

    //     typedArray[y] ^= (1 << x);

    //     return (typedArray[y] >>> x) & 1;
    // }


    // Not a Class
    // {
    //     typedArray: Uint32Array(2),
    //     varSize: 1,
    //     varsPerElement: 32,
    //     bitmask: 1,
    //     isBool: true
    // }

    static createByKind(kind, arrayLength = 2)
    {
        // we are using an Uint32Array
        
        // the size (in bits) of this kind of variable:
        // BOOL = 1 bits [0-1],
        // CRUMBLE = 2 bits [0-3],
        // NIBBLE = 4 bits [0-15],
        // BYTE = 8 bits [0-255]

        const varSize = 1 << kind;

        // amount of variables in each Typed Array element
        const varsPerElement = BITS_PER_TYPED_ARRAY_ELEMENT / varSize;

        // bitmask to extract/work on the variable
        const bitmask = (1 << varSize) - 1;

        if (Array.isArray(arrayLength))
        {
            arrayLength = Math.ceil(arrayLength.length * varSize / BITS_PER_TYPED_ARRAY_ELEMENT);
        }

        const typedArray = new Uint32Array(arrayLength);

        return {varSize, varsPerElement, bitmask, typedArray, isBool: varSize === 1};
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

//     static readContiguous(x, size = 2, bitmask = 0x3, y = 0)
//     {
//         return (this.typedArray[y] >>> x * size) & bitmask;
//     }

//     static clearContiguous(x, size = 2, bitmask = 0x3, y = 0)
//     {
//         this.typedArray[y] &= ~(bitmask << x * size);
//     }

//     static toString(x, size = 2, bitmask = 0x3, y = 0)
//     {
//         const str = this.readContiguous(x, size, bitmask, y);

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
