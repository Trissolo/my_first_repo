class boolsManager
{
  constructor(boolsAmount)//map = gameBools)
  {
    //for some reason I chose 32
    this.chunkLength = 32
    this.chunkLengthMinusOne = this.chunkLength - 1

    // being this.chunkLength = 32 then let's use an Uint32Array
    this.boolsContainer = new Uint32Array(Math.ceil(boolsAmount / this.chunkLength))
    
    this.total = this.boolsContainer.length * this.chunkLength + 1

    this.actualBitCoords = {boolIndex: null, chunkIndex: null}
  }

  /**
  * Show the value of a specific bit.
  * @param {number} boolIndex - The bit index in the chunck.
  * @param {number} chunkIndex - The chunk index.
  * @return {number} The actual value.
  */
  readBit(boolIndex, chunkIndex)
  {
    return (this.boolsContainer[chunkIndex] >> boolIndex) & 1;// (1 << boolIndex)
  }

  bitStatus(offset)
  {
    const {boolIndex, chunkIndex} = this.deriveBitCoords(offset)

    return this.readBit(boolIndex, chunkIndex);// ? 1 : 0
  }

  setBitOn(boolIndex, chunkIndex)
  {
    this.boolsContainer[chunkIndex] |= (1 << boolIndex)

    return 1
  }

  set(offset)
  {
    const {boolIndex, chunkIndex} = this.deriveBitCoords(offset)

    return this.setBitOn(boolIndex, chunkIndex)
  }

  setBitOff(boolIndex, chunkIndex)
  {
    this.boolsContainer[chunkIndex] &= ~(1 << boolIndex)

    return 0
  }

  clear(offset)
  {
    const {boolIndex, chunkIndex} = this.deriveBitCoords(offset)

    return this.setBitOff(boolIndex, chunkIndex)
  }

  toggleBit(boolIndex, chunkIndex)
  {
    this.boolsContainer[chunkIndex] ^= (1 << boolIndex)
  }

  toggle(offset)
  {
    const {boolIndex, chunkIndex} = this.deriveBitCoords(offset)

    this.toggleBit(boolIndex, chunkIndex)

    return this.readBit(boolIndex, chunkIndex) ? 1 : 0
  }
  
  /**
  * Infer bit coords.
  * @param {number} index - The index of the property in the `conditions` array.
  * @return {number} an Object containing the boolIndex, chunkIndex properties.
  */
  deriveBitCoords(index)
  {
    let x = 0
    let y = 0

    if (index > 0 && index < this.total)
    {
    
      if (index > this.chunkLengthMinusOne)
      {
        y = Math.floor(index / this.chunkLength)
        x = index - (y * this.chunkLength)
      }
      else
      {
        x = index
      }

    }
    
    //maybe a class is needed
    this.actualBitCoords.boolIndex = x
    this.actualBitCoords.chunkIndex = y

    return this.actualBitCoords
  }

  debugChunk(chunkIndex = 0)
  {
    const chunk = this.boolsContainer[chunkIndex]
    
    return (chunk >>> 0).toString(2).padStart(8, "0") + "\n76543210"
  }

  boolCondIsSatisfied(condition)
  {
    const [varType, index, expected] = condition.split("_")

    return this.bitStatus(+index) === +expected
  }

}//end Bitwise class

export default boolsManager
