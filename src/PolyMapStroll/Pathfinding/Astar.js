/*
 * All pathfinding classes are based on the ActionScript 3 implementation by Eduardo Gonzalez
 * Code is ported to HaXe and modified when needed
 * http://code.tutsplus.com/tutorials/artificial-intelligence-series-part-1-path-finding--active-4439
 */

import IndexedPriorityQueue from './IndexedPriorityQueue' 
	
export default class AstarAlgorithm
{
	constructor(edges, startIndex, targetIndex, targetVector, heuristic = Phaser.Math.Distance.BetweenPoints)
	{
		this.startIndex = startIndex
		this.targetIndex = targetIndex
		
		//shortcuts?
		
		this.heuristic = heuristic
		this.edges = edges
		this.targetVector = targetVector

		//Shortest Path Tree: this array contains the lowest cost edge to get to a specific node
		this.SPT = []
		
		//For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
		this.gScore = []
		
		// For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
    	// how short a path from start to finish can be if it goes through n.
		this.fScore = []

		//Search Frontier
		this.SF = []
		
		for (let i = 0, len = this.edges.length; i < len; i++) {
			this.gScore[i] = 0
			this.fScore[i] = 0
		}

		this.search()
	}
	
	search()
	{
		//The PRIORITY QUEUE is now sorted depending on the F cost vector
		const openList = new IndexedPriorityQueue(this.fScore);
		
		openList.insert(this.startIndex)

		while(!openList.isEmpty())
		{
			//Next Closest Node index
			const currentNodeIndex = openList.pop()
			
			this.SPT[currentNodeIndex] = this.SF[currentNodeIndex]
			
			if ( currentNodeIndex === this.targetIndex ) return
			
			
			//const edges = this.edges[currentNodeIndex]
			
			for ( const edge of this.edges[currentNodeIndex] ) //edges )
			{
				const Gcost = this.gScore[currentNodeIndex] + edge.cost;

				//The H cost is obtained by the distance between the targetIndex node and the arrival node of the edge being analyzed	
				const Hcost = this.heuristic(edge.toVector, this.targetVector) * 0.9 //this.maybeCost(edge.toVector)
				
				const { to } = edge
				if (this.SF[to] === undefined)
				{
					this.fScore[to] = Gcost + Hcost
					this.gScore[to] = Gcost

					openList.insert(to)

					this.SF[to] = edge
				}
				else if ( (Gcost < this.gScore[to]) && (this.SPT[to] === undefined) )
				{
					this.gScore[to] = Gcost
					this.fScore[to] = Gcost + Hcost

					openList.reorderUp()
					
					this.SF[to] = edge
				}
				
			}
			
		}// end while
	}//end search function
	
	getPath()
	{
		
		const path = []
		
		let { targetIndex } = this
		
		path.push(targetIndex)
		
		while( targetIndex !== this.startIndex && this.SPT[targetIndex] !== undefined)
		{
			targetIndex = this.SPT[targetIndex].from;
			path.push(targetIndex);
		}

		//for debug only:
		//console.dir("SPT, SF, score:", this.SPT, this.SF, this.fScore)
		this.testNullify()
		
		//remove last element from path: can be done somewhere else
		path.length--

		return path
	}

	testNullify()
	{
		this.startIndex = undefined
		this.targetIndex = undefined
		
		//console.dir("SPT - SF", this.SPT, this.SF)
		this.heuristic = undefined

		this.edges = undefined
		//this.edges.forEach( (edge, idx, edgeAry) => {  edge.forEach( (el, i, ary) => { el.clear(); ary[i] = undefined }  ); edge.length = 0 })
		this.targetVector = undefined
		
		this.SPT.length = 0// = []
		this.SPT = undefined		
		this.gScore.length = 0
		this.gScore = undefined
		this.fScore.length = 0
		this.fScore = undefined

		//Search Frontier
		this.SF.length = 0
		this.SF = undefined
	}

}