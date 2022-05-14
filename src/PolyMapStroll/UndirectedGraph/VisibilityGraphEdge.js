export default class VisibilityGraphEdge
{
  constructor(fromVector, toVector, cost = 1, from, to)
  {
    //These 2 are Vectors
    this.fromVector = fromVector
    this.toVector = toVector
    
    //number
    this.cost = cost
    
    //these 2 are numbers (array index)
    if (from !== undefined)
    {
      this.from = from
      this.to = to
    }
  }
  
  clear()
  {
    this.fromVector = null
    this.toVector = null

    //is the following really necessary?
    this.cost = null
    this.from = null
    this.to = null
  }
}