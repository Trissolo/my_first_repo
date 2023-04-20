import BITS_PER_TYPED_ARRAY_ELEMENT from "./BITS_PER_TYPED_ARRAY_ELEMENT.mjs";

const {ToXY, Clamp, MaxAdd, MinSub} = Phaser.Math;

export default class AllVarsManager
{
    // Variable containers
    static varContainers = new Map();

    // sort of constructor
    static initialize()
    {      
        console.log("New INITIALIZE");

        // kind/key(containerIdx)|     varSize     |varsPerElement|bitmask
        // ----------------------|-----------------|--------------|-------
        //  0                    | 1 bit  (BOOL)   |      32      |   1   
        //  1                    | 2 bits (CRUMBLE)|      16      |   3   
        //  2                    | 4 bits (NIBBLE) |       8      |   15  
        //  3                    | 8 bits (BYTE)   |       4      |   255 

        for (let kind = 0; kind < 4; kind++)
        {

            this.varContainers.set(this.varContainers.size, this.createByKind(kind));

        }
        
    }  // end Initialize

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

        const coords = new Phaser.Math.Vector2();

        return {varSize, varsPerElement, bitmask, typedArray, coords, isBool: varSize === 1};
    }

    // Calculate coords:

    /*
    * @param {number} container -
    * @param {number} varIdx - 
    */
    static betterGrabCoords(container, varIdx)
    {
        ToXY(varIdx, container.varsPerElement, container.typedArray.length, container.coords);

        console.log("TOXY", varIdx, container.coords);
        return container;
    }

    static betterReadVar(containerIdx, varIdx)
    {
        const container = this.varContainers.get(containerIdx);
        
        this.betterGrabCoords(container, varIdx);
        
        return container.isBool? (container.typedArray[container.coords.y] >>> container.coords.x) & 1 :  (container.typedArray[container.coords.y] >>> container.coords.x * container.varSize) & container.bitmask;
        
        //avoid multiplication for Bools
        // return container.isBool? this.readPreparedBoolContainer(container): this.readPrepared(container);
    }

    static readPrepared(prepContainer)
    {
        console.log("readPrepared COOOORRRDS", prepContainer.coords);
        return (prepContainer.typedArray[prepContainer.coords.y] >>> prepContainer.coords.x * prepContainer.varSize) & prepContainer.bitmask;
    }

    static readPreparedBoolContainer(prepContainer)
    {
        console.log("readPreparedBool", prepContainer, prepContainer.coords);

        return (prepContainer.typedArray[prepContainer.coords.y] >>> prepContainer.coords.x) & 1;
    }

    // maybe... already destructured?

    static unpackedReadPrepared(typedArray, x, y, varSize, bitmask)
    {
        return (typedArray[y] >>> x * varSize) & bitmask;
    }

    static unpackedReadPreparedBoolContainer(typedArray, x, y)
    {
        return (typedArray[y] >>> x) & 1;
        
    }


    static betterSetVar(containerIdx, varIdx, newValue)
    {
        // prepare the varContainer
        // A 'prepared' varContainer has his 'coords' Vector2 set to the coords of the variable currently handled.
        const prepContainer = this.betterGrabCoords(this.varContainers.get(containerIdx), varIdx);

        //not unpaked
        // this.clearPreparedContainer(prepContainer);

        // //finally
        // if (newValue !== 0)
        // {
        //     this.setPreparedContainer(prepContainer, newValue);
        // }

        //test unpacked
        const {typedArray, varSize, bitmask, coords:{x, y}} = prepContainer;

        console.log("[betterSetVar] Destructuring:", "VarIdx:", varIdx, x, y, prepContainer.coords.x, prepContainer.coords.y);
        // const {x, y} = prepContainer.coords;

        this.unpackedClearPreparedContainer(typedArray, x, y, varSize, bitmask);

        if (newValue)
        {
            this.unpackedSetPreparedContainer(newValue, typedArray, x, y, varSize); //typedArray, x, y, varSize, bitmask);
        }
        return newValue;

    }

    static clearPreparedContainer(prepContainer)
    {
        prepContainer.typedArray[prepContainer.coords.y] &= ~(prepContainer.bitmask << prepContainer.coords.x * prepContainer.varSize);

        return prepContainer;
    }

    static unpackedClearPreparedContainer(typedArray, x, y, varSize, bitmask)
    {
        typedArray[y] &= ~(bitmask << x * varSize);

        return 0;
    }

    static setPreparedContainer(prepContainer, newValue)
    {
        prepContainer.typedArray[prepContainer.coords.y] |= (newValue << prepContainer.coords.x * prepContainer.varSize);

        return prepContainer;
    }

    static unpackedSetPreparedContainer(newValue, typedArray, x, y, varSize)
    {
        return typedArray[y] |= (newValue << x * varSize);

        // return prepContainer;
    }


    






    // OLD!
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



    
    // Ultra old!

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
