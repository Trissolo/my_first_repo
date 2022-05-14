/*
 * All pathfinding classes are based on the AactionScript 3 implementation by Eduardo Gonzalez
 * Code is ported to HaXe and modified when needed
 * http://code.tutsplus.com/tutorials/artificial-intelligence-series-part-1-path-finding--active-4439
 */

import IndexedPriorityQueue from './IndexedPriorityQueue' 
	
export default class DijkstraAlgorithm
{
	constructor(edges, startIndex, targetIndex, targetVector)//, heuristic = Phaser.Math.Distance.BetweenPoints)
	{
        this.startIndex = startIndex
		this.targetIndex = targetIndex
		
		//shortcuts?
		
		//this.heuristic = heuristic
		this.edges = edges
		this.targetVector = targetVector

		//Shortest Path Tree: this array contains the lowest cost edge to get to a specific node
		this.SPT = []
		
		//This array will store the costs of getting to each node
		this.cost2Node = new Array(edges.length).fill(0)
		
		//Search Frontier
		this.SF = []
		
		this.search()
    }

    search()
    {
        // The PRIORITY QUEUE
		const openList = new IndexedPriorityQueue(this.cost2Node);
		
		openList.insert(this.startIndex)

		while(!openList.isEmpty())
		{
			//Next Closest Node index
			const currentNodeIndex = openList.pop()
			
			this.SPT[currentNodeIndex] = this.SF[currentNodeIndex]
			
			if ( currentNodeIndex === this.targetIndex ) return
			
            
			for ( const edge of this.edges[currentNodeIndex] )
			{
				const nodeCost = this.cost2Node[currentNodeIndex] + edge.cost;
				//console.log("nodeCost:", this.cost2Node[currentNodeIndex])
							
				const { to } = edge

				if (this.SF[to] === undefined)
				{
					this.cost2Node[to] = nodeCost
					openList.insert(to)
					this.SF[to] = edge
				}
				else if ( (nodeCost < this.cost2Node[to]) && (this.SPT[to] === undefined) )
				{
					this.cost2Node[to] = nodeCost

					openList.reorderUp()

					this.SF[to] = edge
				}
				
			} //end for iteration
			
		}// end while

	}//end search function

    getPath()
	{
		const path = []
		
		let { targetIndex } = this

        if(targetIndex < 0 || this.SPT[targetIndex] === undefined) {return path}
		
		path.push(targetIndex)
		
		while( (targetIndex !== this.startIndex) && (this.SPT[targetIndex] !== undefined) )
		{
			targetIndex = this.SPT[targetIndex].from;
			path.push(targetIndex);
		}

		this.testNullify()
		
		path.length--

		return path
	}

    testNullify()
	{
		this.startIndex = undefined
		this.targetIndex = undefined
		
		this.edges = undefined

		this.targetVector = undefined
		
		this.SPT.length = 0
		this.SPT = undefined	

		this.cost2Node.length = 0
		this.cost2Node = undefined

		this.SF.length = 0
		this.SF = undefined
	}
    
}