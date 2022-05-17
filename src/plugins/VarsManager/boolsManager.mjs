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
    this.recycleOut = new Phaser.Math.Vector2()
    this.actualBitCoords = {boolIndex: null, chunkIndex: null}
  }

  isActive(index)
  {
    const {boolIndex, chunkIndex} = this.deriveBitCoords(index)
    return this.readBit(boolIndex, chunkIndex) === 0 ? false : true
    

  }

  toggle(index)
  {
    const {boolIndex, chunkIndex} = this.deriveBitCoords(index)
    //const chunk = this.boolsContainer[chunkIndex]
    this.boolsContainer[chunkIndex] = this.boolsContainer[chunkIndex] ^ (1 << (boolIndex))
    
  }

  setToZero(index)
  {
    const {boolIndex, chunkIndex} = this.deriveBitCoords(index)
    this.boolsContainer[chunkIndex] = this.boolsContainer[chunkIndex] & ~(1 << boolIndex)

    //hardcoded
    return 1

    // const chunk = this.boolsContainer[chunkIndex]
    // return this.boolsContainer[chunkIndex] = chunk & ~(1 << boolIndex)
  }

  setActive(index)
  {
    const {boolIndex, chunkIndex} = this.deriveBitCoords(index)
    this.boolsContainer[chunkIndex] = this.boolsContainer[chunkIndex] | (1 << boolIndex)

    //hardcoded
    return 1
    //const chunk = this.boolsContainer[chunkIndex]
    //return this.boolsContainer[chunkIndex] = chunk | (1 << (boolIndex))
  }
  
  /**
  * Infer bit coords.
  * @param {number} index - The index of the property in the `conditions` array.
  * @return {number} an Object containing the boolIndex, chunkIndex properties.
  */
  deriveBitCoords(index)//boolPosition)
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

  /**
  * Show the value of a specific bit.
  * @param {number} boolIndex - The bit index in the chunck.
  * @param {number} chunkIndex - The chunk index.
  * @return {number} The actual value.
  */
  readBit(boolIndex, chunkIndex)
  {
    //const { x: boolIndex, y: chunkIndex} = this.grabBit(boolPosition)
    //const chunk = this.boolsContainer[chunkIndex]
    return this.boolsContainer[chunkIndex] & (1 << (boolIndex))
  }



/*
  grabBit(index)//boolPosition)
  {
    //const index = gameBools.get(boolPosition)
    index = +index
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
    
    return this.recycleOut.set(x, y)
  }



  
  setBitOn(boolPosition)
  {
    const {x: boolIndex, y: chunkIndex} = this.grabBit(boolPosition)
    const chunk = this.boolsContainer[chunkIndex]
    return this.boolsContainer[chunkIndex] = chunk | (1 << (boolIndex))
  }

  setBitOff(boolPosition)
  {
    const {x: boolIndex, y: chunkIndex} = this.grabBit(boolPosition)
    const chunk = this.boolsContainer[chunkIndex]
    return this.boolsContainer[chunkIndex] = chunk & ~(1 << boolIndex)
  }
  
  toggleBit(boolPosition)
  {
    const {x: boolIndex, y: chunkIndex} = this.grabBit(boolPosition)
    const chunk = this.boolsContainer[chunkIndex]
    return (this.boolsContainer[chunkIndex] = chunk ^ (1 << (boolIndex))) !== 0
  }
  
  isBitActive(boolPosition)
  {
    const { x: boolIndex, y: chunkIndex} = this.grabBit(boolPosition)
    const chunk = this.boolsContainer[chunkIndex]
    return !!(chunk & (1 << (boolIndex)))
  }
*/
  bitStatus(boolIndex, chunkIndex)
  {
    //const { x: boolIndex, y: chunkIndex} = this.grabBit(boolPosition)
    const chunk = this.boolsContainer[chunkIndex]
    return (chunk & (1 << (boolIndex))) === 0 ? 0 : 1
  }
/*
  checkBool(boolStringCondition)
  {
      console.log("Bool string:", boolStringCondition)
      //console.dir(this.recycleOut)

    const [varType, boolPosition, expectedValue] = boolStringCondition.split("_")

    console.log(varType, boolPosition, expectedValue, typeof varType, typeof boolPosition, typeof expectedValue, typeof +boolPosition)
    const { x: boolIndex, y: chunkIndex} = this.grabBit(+boolPosition)

    console.log("%cBool check:", "color:purple", +boolIndex, +chunkIndex, `expected: ${expectedValue}`)
    //console.dir(this.recycleOut)
    return "CheckBool done"

  }
  */
  debugChunk(chunkIndex = 0)
  {
    const chunk = this.boolsContainer[chunkIndex]
    return (chunk >>> 0).toString(2).padStart(8, "0") + "\n76543210"
  }

}//end Bitwise class

export default boolsManager