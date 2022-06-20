import PolygonalMap from "./UndirectedGraph/PolygonalMap"
import PMSDebug from "./Debug/PMSDebug"
import AstarAlgorithm from "./Pathfinding/Astar.js"
import Dijkstra from "./Pathfinding/Dijkstra.js"

import UGWeakMap from "./UndirectedGraph/UGWeakMap.js"


//debug stuff:
const DBG1 = "color: #000; background: #de8;"

//
import Phaser from "phaser"
import VisibilityGraphEdge from "./UndirectedGraph/VisibilityGraphEdge"

const {Vector2} = Phaser.Math
const {BetweenPoints} = Phaser.Math.Distance
const {Polygon, Line} = Phaser.Geom
const {GetMidPoint, GetNearestPoint} = Line
const {LineToLine} = Phaser.Geom.Intersects

const heuristic = BetweenPoints

//generators
function* EachVectorAndAdjacents(ary)
{
  const len = ary.length - 1
  let i = 0, j = len
  
  for( ; i < len; j = i++)
  {
    yield { curr: ary[i], succ: ary[i + 1], prec: ary[j] }
  }
  yield { curr: ary[i], succ: ary[0], prec: ary[j] }
}


export default class PMStroll
{
    constructor(scene, useDebug = false)
    {
        this.scene = scene
        this.name = "PM Manager"

        if (useDebug)
        {
            this.debug = new PMSDebug(this)
        }
    
        this.epsilon = 0.5
        this.splitAmount = 5
        this.out = new Vector2()
    }

    buildSinglePolyMap(data)
    {
        console.log("building:", data)
        const graph = new PolygonalMap()
        for (const polyData of data.coords) //polyVertices)
        {
            graph.polygons.push( new Polygon(polyData))
        }
        // get Concave vertices
        this.grabAllConcave(graph)
        
        //finally, the edges!
        this.connectNodes(graph)     
        
        //lastly...
        this.checkAdjacent(graph)

        /*
        this.emit(EVENTS.CREATED_POLYGONAL_MAP, polyMap)
        this.scene.floors.push(polyMap)
        */

        return graph
    }

    grabAllConcave(polygonalMap)
    {
      const  { graph } = polygonalMap
      let first = true
  
      const nextVertex = new Vector2()
      const previousVertex = new Vector2()

      //iterate allwalkable poly
      for (const singlePoly of polygonalMap.polygons)
      {
        //iterate all vertices in each single poly - modern way
        for(const vertices of EachVectorAndAdjacents(singlePoly.points))
        {
          const { curr/*, succ, prec*/ } = vertices

          nextVertex.copy(vertices.succ).subtract(curr)
          previousVertex.copy(curr).subtract(vertices.prec)
  
          if( (previousVertex.cross(nextVertex) < 0) == first)
          {
            graph.edgesOf(curr)
          }
  
        }
  
        first = false
  
      }
  
    }

    connectNodes(polygonalMap)
    {
      const {graph} = polygonalMap

      const aryNodes = [...graph.nodeMap.keys()]

      console.log("%cGraph.nodeMap: ", DBG1, polygonalMap, aryNodes)

      for(let currentNodeIdx = 0, len = aryNodes.length; currentNodeIdx < len; currentNodeIdx++)
      {
   
        for(let anyOtherNodeIdx = currentNodeIdx + 1, concaveA, concaveB; anyOtherNodeIdx < len; anyOtherNodeIdx++)
        {
          //these two are references to existing polygons point:
          concaveA = aryNodes[currentNodeIdx]
          concaveB = aryNodes[anyOtherNodeIdx]

          if(this.inLineOfSight(concaveA, concaveB, polygonalMap))
          {
            graph.insertEdge(concaveA, concaveB, heuristic(concaveA, concaveB) )
          }
    
        } //end anyOtherNodeIdx

        

      } //end currentNodeIdx

      return aryNodes.length = 0
    }

    inLineOfSight(start, end, polygonalMap)
    {
      const {polygons} = polygonalMap

      //the segment to check against any polygon side
      const ray = new Line(start.x, start.y, end.x, end.y)

      for (const polygon of polygons)
      {
        const {points} = polygon

        //Not in LOS if any edge is intersected by the start-end line segment
        for (let i = -1, {length} = points, j = length - 1, polygonSide = new Line(), vertexA, vertexB; ++i < length; j = i)
        {
          vertexA = points[i]
          vertexB = points[j]

          polygonSide.setTo(vertexA.x, vertexA.y, vertexB.x, vertexB.y)
          //ray.setTo(start.x, start.y, end.x, end.y)//moved outside the loop
          
          if (LineToLine(ray, polygonSide, this.out) && (this.distanceToSegment(polygonSide, start) > this.epsilon && this.distanceToSegment(polygonSide, end) > this.epsilon))
          {
            return false
          }
        }// end loop each polygon side

      }  //end all polygons iteration


      //not in LOS if the ray's middle point is outside the walkable area...
      const rayPoints = ray.getPoints(this.splitAmount)
      rayPoints[0] = GetMidPoint(ray)

      //needs better writing
      if (!polygons[0].contains(rayPoints[0].x, rayPoints[0].y)) {return false}

      //...or inside an obstacle
      for (let i = 1, {length} = polygons; i < length; i++)
      {
        if (rayPoints.some(e => polygons[i].contains(e.x, e.y)))
        {
          return false
        }
      }

      return true 
    }

    checkAdjacent(polygonalMap)
    {
      const {polygons} = polygonalMap
      const {nodeMap} = polygonalMap.graph

      //console.log("%ccheck ADJ:[polygons]", DBG1, polygons, polygons.length)

      for (let polyIdx = polygons.length; polyIdx--;/**/)
      {
        const {points} = polygons[polyIdx]
        for (let i = -1, len = points.length, j = len - 1, {graph} = polygonalMap, vertexA, vertexB; ++i < len; j = i)
        {
          vertexA = points[i]
          vertexB = points[j]
          if (nodeMap.has(vertexA) && nodeMap.has(vertexB))
          {
            graph.insertEdge(vertexA, vertexB, heuristic(vertexA, vertexB))
          }
        }
      }
    }

    //helpers
    distanceToSegment(line, vec)
    { 
      const out = new Vector2()
      GetNearestPoint(line, vec, out)
  
      const xMin = Math.min(line.x1, line.x2)
      const xMax = Math.max(line.x1, line.x2)
      const yMin = Math.min(line.y1, line.y2)
      const yMax = Math.max(line.y1, line.y2)
  
      if(out.x > xMax) { out.x = xMax }
      else if(out.x < xMin) { out.x = xMin }

      if(out.y > yMax) { out.y = yMax }
      else if(out.y < yMin) { out.y = yMin }
  
      return out.distance(vec)
  
    } // end nearestPointinSegment

    toWeakMap(polyMapGraph)
    {
      const wmNodes = [...polyMapGraph.nodeMap.keys()]
      const wmEdges = []

      for(let i = 0, len = wmNodes.length, currentNode, currentNodeEdges; i < len; i++)
      {
        currentNode = wmNodes[i]
        currentNodeEdges = polyMapGraph.nodeMap.get(currentNode)

        const wmEdgesContainer = wmEdges[i] = []
        currentNodeEdges.forEach( edgeData => wmEdgesContainer.push(new VisibilityGraphEdge(edgeData.fromVector, edgeData.toVector, edgeData.cost, i, wmNodes.indexOf(edgeData.toVector))))
      }

      //here our WeakMap//, a plain object
      return new UGWeakMap(wmNodes, wmEdges)//{wmNodes, wmEdges}
    }

    addVectorToWeakMap(vectorToAdd, weakMap, polygonalMap)
    {
      const {wmNodes, wmEdges} = weakMap

      const {length: addedVectorIndex} = wmNodes

      //insert the vector
      wmNodes.push(vectorToAdd)
      wmEdges.push([])

      //update weak map: connect nodes
      for (let i = 0, len = wmEdges.length - 1, currentNodeVector; i < len; i ++)
      {
        currentNodeVector = wmNodes[i]

        if(this.inLineOfSight(currentNodeVector, vectorToAdd, polygonalMap))
        {
          const cost = heuristic(currentNodeVector, vectorToAdd)
          wmEdges[addedVectorIndex].push(new VisibilityGraphEdge(vectorToAdd, currentNodeVector, cost, addedVectorIndex, i))
          wmEdges[i].push(new VisibilityGraphEdge(currentNodeVector, vectorToAdd, cost, i, addedVectorIndex))
        }
      }

      //AStar wants indexes, so... here the new one!
      return addedVectorIndex
    }

    generatePath(startVector, goalVector, visibilityMap)
    {
        console.log("%c Testing Astar! ", "color: #000; background: #8de;")

        const weakMap =  this.toWeakMap(visibilityMap.graph)

        const startIdx = this.addVectorToWeakMap(startVector, weakMap, visibilityMap)
        const goalIdx = this.addVectorToWeakMap(goalVector, weakMap, visibilityMap)
        console.log(weakMap)
        const res = []

        if (this.inLineOfSight(startVector, goalVector, visibilityMap))
        {
          res.push( {x: goalVector.x, y: goalVector.y} )
        }
        else
        {
          const finder = new AstarAlgorithm(weakMap.wmEdges, startIdx, goalIdx, goalVector)
          const indexes = finder.getPath()
          console.log("Finder!:", indexes)

          //first element of path array must be removed here:
          for (const index of indexes) //weakMap.wmNodes)
          {
              const tempVec = weakMap.wmNodes[index]
              res.push({x: tempVec.x, y: tempVec.y})
          }

        }
        
        console.log("VecPAth:", res)

        //show something
        //this.debug.showPath(res, {x: startVector.x, y: startVector.y})
      
        console.log("AFTER", weakMap)

        weakMap.destroy()

        return res

      
    }

    generatePathDijkstra(startVector, goalVector, visibilityMap)
    {
        console.log("%c Testing Dijkstra! ", "color: #000; background: #8de;")

        const weakMap =  this.toWeakMap(visibilityMap.graph)

        const startIdx = this.addVectorToWeakMap(startVector, weakMap, visibilityMap)
        const goalIdx = this.addVectorToWeakMap(goalVector, weakMap, visibilityMap)
        console.log(weakMap)
        const res = []

        if (this.inLineOfSight(startVector, goalVector, visibilityMap))
        {
          res.push( {x: goalVector.x, y: goalVector.y} )
        }
        else
        {
          const finder = new Dijkstra(weakMap.wmEdges, startIdx, goalIdx, goalVector)
          const indexes = finder.getPath()
          console.log("Dijkstra Finder!:", indexes)

          //first element of path array must be removed here:
          for (const index of indexes) //weakMap.wmNodes)
          {
              const tempVec = weakMap.wmNodes[index]
              res.push({x: tempVec.x, y: tempVec.y})
          }

        }


        console.log("Dijkstra VecPAth:", res)

        //show something
        this.debug.showPath(res, {x: startVector.x, y: startVector.y}, 0xfafada)


        weakMap.destroy()

        return res

      
    }

}//end Class
