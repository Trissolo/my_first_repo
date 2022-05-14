import VisibilityGraphEdge from "./VisibilityGraphEdge"
//import UGWeakMap from "./UGWeakMap.js"

export default class VisibilityGraph
{
    constructor()
    {
        this.nodeMap = new Map()

        //this.addNode = this.edgeOf
    }

    edgesOf(polygonPoint)
    {
        const { nodeMap } = this

		//if the key/point does not exists, then place it!
		if ( !nodeMap.has(polygonPoint) )
		{
			//console.log("SIZE:", nodeMap.size, polygonPoint)
			nodeMap.set(polygonPoint, [])
		}
		
		return nodeMap.get(polygonPoint)
	}

	insertEdge(pa, pb, cost)
	{
		if (pa == pb) {return}
		const aryA = this.edgesOf(pa)

		if( this.edgeAlreadyExists(pa, pb, aryA) )
		{
			return
		}

		const aryB = this.edgesOf(pb)
		aryA.push( new VisibilityGraphEdge(pa, pb, cost) )
		aryB.push( new VisibilityGraphEdge(pb, pa, cost) )
	}

	edgeAlreadyExists(pointA, pointB, ary)
	{
		if (ary.length === 0) { return false }
		for (const el of ary)
		{
			if (el.fromVector == pointA && el.toVector == pointB || el.fromVector == pointB && el.toVector == pointA)
			{
				return true
			}
		}
		return false
	}

}