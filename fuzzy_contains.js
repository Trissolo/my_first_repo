player: x: 82.333, 63,6666
goal: 218.33333333333331, 112

map ori
player 201.666, 117.666
dest 45.333 , 119.666
/*
const {clear, log, dir} = console
clear()

const {Vector2} = Phaser.Math
const {BetweenPoints} = Phaser.Math.Distance
const {Polygon, Line} = Phaser.Geom
const {GetMidPoint, GetNearestPoint} = Line
const {LineToLine} = Phaser.Geom.Intersects
log(LineToLine)

class TestScene extends Phaser.Scene
{
  constructor ()
  {
    super({ key: 'TestScene' });
  }


  create ()
  {
    const polyVertices = [
            [234, 42, 237, 46, 249, 46, 254, 51, 254, 126, 130, 126, 120, 112, 63, 111, 57, 124, 3, 125, 4, 68, 76, 67, 86, 56, 92, 56, 96, 53, 102, 46, 145, 46, 158, 66, 181, 66, 190, 46, 219, 47, 222, 42, 222, 33, 234, 33],
            [177, 123, 156, 123, 147, 111, 158, 103, 177, 103, 186, 111],
            //[135, 75, 116, 64, 111, 66, 115, 76, 105, 78, 102, 84, 112, 90, 120, 86, 122, 89, 135, 90, 142, 86, 152, 88, 159, 80, 146, 71],
            [146, 71, 159, 80, 152, 88, 142, 86, 135, 90, 122, 89, 120, 86, 112, 90, 102, 84, 105, 78, 115, 76, 111, 66, 116, 64, 135, 75]
        ]
    
   //const polyData =  firstPoly.polyVertices[0]  

    var graphics = this.add.graphics({ x: 0, y: 0 });
    
    const polygons = this.buildMap(polyVertices, graphics)

    const polygon = polygons[0]
    const {points} = polygon

    
    
    //const {points}= polygon
    this.ray = new Line()
    this.side = new Line()
    this.vertexA = new Vector2()
    this.vertexB = new Vector2()
    
    const otp = polygons[2].points
    this.start = new Vector2(otp[10].x, otp[10].y)
    this.end = new Vector2( otp[11].x, otp[11].y)
    
    
    this.vertexA.copy(points[16])
    this.vertexB.copy(points[7])
    
    this.ray.setTo(this.vertexA.x, this.vertexA.y, this.vertexB.x, this.vertexB.y)
    
    this.side.setTo(this.start.x, this.start.y, this.end.x, this.end.y)
    
    graphics.lineStyle(2, 0x9988ff);
    graphics.strokeLineShape(this.ray)
    
     graphics.lineStyle(2, 0xadee74);
    graphics.strokeLineShape(this.side)
    
    this.gag(this.ray, this.side)
    //this.end = this.start
    //hardcoded
    const nearestStart = this.distanceToSegment(this.ray, this.end)
    log("Nearest:", nearestStart, this.end, nearestStart.distance(this.end))
    graphics.lineStyle(2, 0xdedeff);
    graphics.lineBetween(nearestStart.x, nearestStart.y, this.end.x, this.end.y)
  }
  
  buildMap(polyData, gr)
  {
    const ary = []
    gr.lineStyle(2, 0x998800);
    for(const data of polyData)
    {
      const po = new Phaser.Geom.Polygon(data)
      ary.push(po)
      
      gr.strokePoints(po.points, true)
      gr.lineStyle(2, 0x984375); 
    }
    return ary
  }
  
  gag(ray, side)
  {
    log("Fuzzy", this.lineOverlapped(ray, side))
    log(ray.getPointB(), side.getPointB())
    log("GAG:", LineToLine(ray, side))
  }
  
lineOverlapped(first, other)
  {
    const pointA = first.getPointA()
    const pointB = first.getPointB()
    
    const otherA = other.getPointA()
    const otherB = other.getPointB()
    return ( pointA.fuzzyEquals( otherA, 0.5) && pointB.fuzzyEquals(otherB, 0.5) )|| (pointA.fuzzyEquals(otherB , 0.5) && pointB.fuzzyEquals(otherA, 0.5))
  }
  
  distanceToSegment(linea, punto)
  {

    const out = new Vector2()
    GetNearestPoint(linea, punto, out)

    let xMin = Math.min(linea.x1, linea.x2)
    let xMax = Math.max(linea.x1, linea.x2)
    let yMin = Math.min(linea.y1, linea.y2)
    let yMax = Math.max(linea.y1, linea.y2)

    if(out.x > xMax) { out.x = xMax }
    else if(out.x < xMin) { out.x = xMin }
    if(out.y > yMax) { out.y = yMax }
    else if(out.y < yMin) { out.y = yMin }

    return out//.distance(punto)

  }
}//end TestScene
    
const config = {
    type: Phaser.WEBGL,
    parent: "gameContainer",
    pixelArt: true,
    backgroundColor: '#320822',
    mipmapFilter: 'NEAREST',
    scale: {
        mode: Phaser.Scale.NONE,
        //autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 260,
        height: 150,
        zoom: 2
    },
    //loader: {
    //  baseURL: 'https://i.ibb.co/YhGPn4S',
    //  crossOrigin: 'anonymous'
    //},
    scene: [TestScene]
};

window.game = new Phaser.Game(config)
*/

var config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        create: create//,
        //update: update
    }
};

const {Line} = Phaser.Geom
const GetNearestPoint = Line
const lineSegmentCross = Phaser.Geom.Intersects.LineToLine
var game = new Phaser.Game(config);
var polygon;
var graphics;
const point = new Phaser.Math.Vector2()
const out = new Phaser.Math.Vector2()
var a = 0;
const epsilon = 0.1
const {Between} = Phaser.Math.Distance

const oldAry = []
const newAry = []

function create ()
{
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xaa6622 } });

    polygon = new Phaser.Geom.Polygon([
        200, 150,
        400, 300,
        600, 150,
        750, 300,
        600, 450,
        200, 450,
        50, 300
    ]);

    this.input.on('pointermove', function (pointer) {

        point.x = pointer.x//Math.round(pointer.x / 10) * 10;
        point.y = pointer.y//Math.round(pointer.y / 10) * 10;

        redraw(point.x, point.y);
    });

    redraw();

    function redraw (x, y)
    {
        graphics.clear();

        graphics.lineStyle(2, 0x00ff00);
        graphics.strokePoints(polygon.points, true);

        if(Phaser.Geom.Polygon.Contains(polygon, x, y))
    {
        graphics.fillStyle(0xaa0000);
    }
    else
    {
        graphics.fillStyle(0x0000aa);
    }
        //graphics.fillPointShape(point, 8)

        graphics.fillCircle(x, y, 8)
        //inLineOfSight(point)
        
        //graphics.strokeLineShape(line);
/*
        if (Phaser.Geom.Intersects.PointToLineSegment(point, line))
        {
            graphics.fillStyle(0xff0000);
        }
        else
        {
            graphics.fillStyle(0xffff00);
        }

        graphics.fillPointShape(point, 5);
        */
    }
}

function inLineOfSight(start, end, polygonalMap)
{

  const polygonPoints = polygon.points;
  const len = polygonPoints.length;
  //let vertexA, vertexB, polygonSide;
  
  for(let i = -1, j = len - 1, vertexA, vertexB, polygonSide; ++i < len; j = i)
  {
  
    //a polygon's vertex, that is the polygonSide's start point
    vertexA = polygonPoints[i]
    // adjacent vertex, that is the polygonSide's end point
    vertexB = polygonPoints[j]
    ray = new Line(start.x, start.y, end.x, end.y)
    polygonSide = new Line(vertexA.x, vertexA.y, vertexB.x, vertexB.y)
    
    if(lineSegmentCross(ray, polygonSide, out))
        {
//console.log("GAG!Linesegcross:", true)
          if(this.distanceToSegment(polygonSide, start) > epsilon && this.distanceToSegment(polygonSide, end) > epsilon)
          {
          console.log(this.distanceToSegment(polygonSide, start), this.distanceToSegment(polygonSide, end))
          console.log("==> BUT NOT in line of sight!!!\n\n--")
            oldAry.push(polygonSide)//return false
          }
          
  }
  if (fuzzyPointOnLine(ray, polygonSide))
  {
    newAry.push(polygonSide)
  }
}
}

function update ()
{
    /*
    a += 0.015;

    if (a > Math.PI * 4)
    {
        a -= Math.PI * 4;
    }

    var x = 400 - Math.cos(a / 2) * 400;
    var y = 300 - Math.sin(a * 2) * 300;

    graphics.clear();

    graphics.strokePoints(polygon.points, true);

    if(Phaser.Geom.Polygon.Contains(polygon, x, y))
    {
        graphics.fillStyle(0xaa0000);
    }
    else
    {
        graphics.fillStyle(0x0000aa);
    }

    graphics.fillCircle(x, y, 8);
    */
}

function fuzzyPointOnLine(line, point, epsilon)
{
  const {x1, y1, x2, y2} = line
  const {x: xp, y: yp} = point// xp, yp, tolerance)

    //epsilon = epsilon || 1
  return Math.abs(Between(x1, y1, x2, y2) - (Between(x1, y1, xp, yp) + Between(x2, y2, xp, yp))) <= epsilon

}

function distanceToSegment(linea, punto)
  {

    const out = new Vector2()
    GetNearestPoint(linea, punto, out)

    let xMin = Math.min(linea.x1, linea.x2)
    let xMax = Math.max(linea.x1, linea.x2)
    let yMin = Math.min(linea.y1, linea.y2)
    let yMax = Math.max(linea.y1, linea.y2)

    if(out.x > xMax) { out.x = xMax }
    else if(out.x < xMin) { out.x = xMin }
    if(out.y > yMax) { out.y = yMax }
    else if(out.y < yMin) { out.y = yMin }

    return out.distance(punto)

  }
  
/*
Line To poly
var config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var line = new Phaser.Geom.Line(100, 450, 700, 150);

    const extended = (Phaser.Geom.Line.Clone(line))

    const extAmount = 24
    Phaser.Geom.Line.Extend(extended, extAmount)

    const thikness = 19
    const poly = new Phaser.Geom.Polygon(lineToPolygon(extended.x1, extended.y1, extended.x2, extended.y2, thikness))

    var graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa } });

    graphics.lineStyle(1, 0xffffff)
    graphics.strokePoints(poly.points, true)

    graphics.lineStyle(1, 0xad9478)
    graphics.strokeLineShape(extended);

    graphics.lineStyle(1, 0xaa00aa)
    graphics.strokeLineShape(line);
}

function lineToPolygon(x1, y1, x2, y2, thickness)
{
    const angle = Math.atan2(y2 - y1, x2 - x1) - Math.PI / 2
    const half = thickness / 2
    const cos = Math.cos(angle) * half
    const sin = Math.sin(angle) * half
    return [
        x1 - cos, y1 - sin,
        x2 - cos, y2 - sin,
        x2 + cos, y2 + sin,
        x1 + cos, y1 + sin
    ]
}
*/

//per WeakMap!
/*
const map = new Map([
    ["a", 11],
    ["b", 222],
    ["z", 999]
])


const res = new Map()
for ( const [idx, val] of [...map.keys()].entries() )
{
    res.set(val, idx)
}

console.dir([...res.entries()])
*/

/*
const {clear, log, dir} = console
clear()
const ary = [..."ABCDEFGHIJKLMNOPQ"]

console.time("Optional")
for (let i = 0, len = ary.length; i < len; i++)
{
 log(ary[i], ary?.[i+1] ?? ary[0])
}
console.timeEnd("Optional")

log("--......--")

console.time("Ph")
for(let i = -1, len = ary.length, j = len - 1; ++i < len; j = i)
{
  log(ary[j], ary[i])
}
console.timeEnd("Ph")

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

console.time("mio")
for(const vertices of EachVectorAndAdjacents(ary))
{
  const { curr, succ, prec } = vertices
  log(curr, succ, prec)
}
console.timeEnd("mio")
*/

/*

*/
