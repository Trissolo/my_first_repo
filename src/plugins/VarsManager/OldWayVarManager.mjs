const BITS_PER_TYPED_ARRAY_ELEMENT = 32; //from "./BITS_PER_TYPED_ARRAY_ELEMENT.mjs";

const {ToXY, Clamp, MaxAdd, MinSub} = Phaser.Math;

export default class AllVarsManager
{
    static vers = "orco 1";

    static varContainers = new Map();

    // sort of constructor
    // kind/key(containerIdx)|     varSize     |varsPerElement|bitmask
    // ----------------------|-----------------|--------------|-------
    //  0                    | 1 bit  (BOOL)   |      32      |   1   
    //  1                    | 2 bits (CRUMBLE)|      16      |   3   
    //  2                    | 4 bits (NIBBLE) |       8      |   15  
    //  3                    | 8 bits (BYTE)   |       4      |   255 

    static initialize()
    {      

        for (let kind = 0; kind < 4; kind++)
        {

            this.varContainers.set(this.varContainers.size, this.createByKind(kind));

        }

        return this;
        
    }  // end Initialize

    /*

    * @param {number} kind - an integer between 0 and 3
    * @param {number|number[]} arrayLength - The wanted 'length' of the Typed Array
    * 
    * @return an Object in the form:
    * {
    *     typedArray: Uint32Array,
    *     varSize: number,
    *     varsPerElement: number,
    *     bitmask: number,
    *     isBool: boolean
    * }
    * 
    */

    static createByKind(kind, arrayLength = 2)
    {
        const varSize = 1 << kind;

        // amount of variables in each Typed Array element
        const varsPerElement = BITS_PER_TYPED_ARRAY_ELEMENT / varSize;

        // bitmask to extract/work on the variable
        // It also indicates the maximum possible value of the variable
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
    * @param {number} container - Pass 'null' if all other args are passed in
    * @param {number} varIdx -
    * 
    * @param {varsPerElement} -
    * @param {typedArray} - 
    * @param {coords} - 
    */

    // static prepareCoords(container, varIdx)
    static prepareCoords(container, varIdx, varsPerElement = container.varsPerElement, typedArray = container.typedArray, coords = container.coords)
    {
        ToXY(varIdx, varsPerElement, typedArray.length, coords);

        if (coords.x === 0 && coords.y === 0 && varIdx !== 0)
        {
            console.error(`%c Variable idx out of range! \n%cMax idx expected: ${typedArray.length * varsPerElement}, given idx: ${varIdx}. :(`, "background-color: #891412;", "color: gray;");

            // return false;
        }

        return container;
    }

    // User methods:

    static setVar(containerIdx, varIdx, newValue)
    {
        // const { typedArray, varSize, varsPerElement, bitmask, coords: {x, y} } = this.prepareCoords(this.varContainers.get(containerIdx), varIdx);

        const container = this.prepareCoords(this.varContainers.get(containerIdx), varIdx);

        const {x, y} = container.coords;

        return this.assignValueAt(newValue, x, y, container);
    }

    static setBool(boolIdx, containerIdx = 0, container = this.varContainers.get(containerIdx))
    {
        const {typedArray, coords: {x, y}} = this.prepareCoords(container, boolIdx);

        return (this.setBitOnAt(x, y, typedArray));
    }

    static clearBool(boolIdx, containerIdx = 0, container = this.varContainers.get(containerIdx))
    {
        const {typedArray, coords: {x, y}} = this.prepareCoords(container, boolIdx);

        return (this.setBitOffAt(x, y, typedArray));
    }

    static toggleBool(boolIdx, containerIdx = 0, container = this.varContainers.get(containerIdx))
    {
        const {typedArray, coords: {x, y}} = this.prepareCoords(container, boolIdx);

        return (this.toggleBitAt(x, y, typedArray));
    }

    static readVar(containerIdx, varIdx)
    {
        const container = this.prepareCoords(this.varContainers.get(containerIdx), varIdx);

        const {x, y} = container.coords;


        return container.isBool? this.readBoolValueAt(x, y, container.typedArray) : this.readValueAt(x, y, container);
    }

    // end User methods


    // Internal methods:

    static readBoolValueAt(x, y, typedArray)
    {
        return (typedArray[y] >>> x) & 1;
    }

    static readValueAt(x, y, {typedArray, varSize, bitmask})
    {
        return (typedArray[y] >>> x * varSize) & bitmask;

    }

    static assignValueAt(newValue, x, y, {typedArray, varSize, bitmask})
    {
        // just in case...
        newValue = Clamp(newValue, 0, bitmask);

        const offset = x * varSize;

        //clear first:
        typedArray[y] &= ~(bitmask << offset);

        if (newValue === 0)
        {
            return newValue;
        }

        typedArray[y] |= (newValue << offset);

        return newValue;
    }


    static setBitOnAt(x, y, typedArray)
    {
        typedArray[y] |= 1 << x; 
        
        return 1;
    }

    static setBitOffAt(x, y, typedArray)
    {
        typedArray[y] &= ~(1 << x);
        
        return 0;
        
    }

    static toggleBitAt(x, y, typedArray)
    {
        typedArray[y] ^= (1 << x);

        return this.readBoolValueAt(x, y, typedArray);
    }

    // End Internal methods:



    // debug a scazzo
    static debugTAry(containerIdx = 0, max)
    {
        const container = this.varContainers.get(containerIdx);

        max = max || container.varsPerElement * container.typedArray.length;

        for (let i = 0; i < max ; i++)
        {

            this.prepareCoords(container, i);

            const decimalValue = this.readVar(containerIdx, i)

            
            if ((i % container.varsPerElement) === 0)
            {
                console.log(`*** varsContainer.get(${containerIdx})[${i / container.varsPerElement}] ***`);
            }

            console.log(`${i}) readVar: ${this.readVar(containerIdx, i)} - ${decimalValue.toString(2).padStart(container.varSize, "0")}\n\n`);
        }
    }
}
