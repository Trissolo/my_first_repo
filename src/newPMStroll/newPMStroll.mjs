import newPMStrollDebug from "./newPMStrollDebug.mjs";
import newVisMap from "./newVisMap.mjs";

//generators:

// ex: ary = ['A', 'B', 'C', 'D', 'E'];
// result {prec, curr, succ}:
// EAB,
// ABC,
// BCD,
// CDE,
// DEA
function* EachVectorAndAdjacents(ary)
{
  const len = ary.length - 1;
  let i = 0, j = len;
  
  for( ; i < len; j = i++)
  {
    yield { curr: ary[i], succ: ary[i + 1], prec: ary[j] };
  }
  
  yield { curr: ary[i], succ: ary[0], prec: ary[j] };
}

function* anyAgainstAllOthers(ary)
{
  const {length} = ary;
  const lenMinusOne = ary.length - 1;
  for(let currentNodeIdx = 0; currentNodeIdx < lenMinusOne; currentNodeIdx++)
      {
   
        for(let anyOtherNodeIdx = currentNodeIdx + 1; anyOtherNodeIdx < length; anyOtherNodeIdx++);
        {
          yield {concaveA: ary[currentNodeIdx], concaveB: ary[anyOtherNodeIdx], idxA: currentNodeIdx, idxB: anyOtherNodeIdx};
        }
      }
}

export default class newPMStroll
{
    // debug = null;

    constructor(scene, enableDebug = true)
    {
        this.scene = scene;

        this.polygonalMaps = new Map()

        if (enableDebug)
        {
            this.debug = new newPMStrollDebug(this)
        }

        //for recycle
        this.vertexA = new Phaser.Math.Vector2();
        this.vertexB = new Phaser.Math.Vector2();
    }

    addPolygonalMap(aryOfNumberArys, name = "default")
    {
        const pm = new newVisMap(aryOfNumberArys);

        this.grabAllConcave(pm);

        this.polygonalMaps.set(name, pm)

        console.dir(pm)

        return pm
    }

    getPolygonalMap(name = 'default')
    {
        return this.polygonalMaps.get(name)
    }

    grabAllConcave(polygonalMap)
    {
      const {vertexA, vertexB} = this;

      let isFirstPoly = true;

      //iterate allwalkable poly
      for (const polygon of polygonalMap.polygons)
      {
        //iterate all vertices in each poly
        for(const {curr, succ, prec} of EachVectorAndAdjacents(polygon.points))
        {

          vertexA.copy(succ).subtract(curr);
          vertexB.copy(curr).subtract(prec);
  
          if( (vertexB.cross(vertexA) < 0) === isFirstPoly)
          {
            polygonalMap.graph.set(curr, [])
          }
  
        }
  
        isFirstPoly = false;
  
      }
  
    }
}  // end class newPMStroll
