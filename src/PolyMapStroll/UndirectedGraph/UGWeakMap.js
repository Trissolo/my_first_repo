export default class UGWeakMap
{
  constructor(wmNodes, wmEdges)
  {
      this.wmNodes = wmNodes
      this.wmEdges = wmEdges
  }

  destroy()
  {
    for (let i = 0, len = this.wmNodes.length; i < len; i++)
    {
      this.wmNodes[i] = null 

      this.wmEdges[i].forEach( (element, innerIdx, innerAry) =>
      {
        element.clear();
        innerAry[innerIdx] = null
        //console.log(`[${i}] -> [${innerIdx}]`, element)
      });

      this.wmEdges[i] = null
    }
    this.wmNodes = null
    this.wmEdges = null
  }
}