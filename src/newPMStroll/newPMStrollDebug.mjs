const CONSTANTS = {
	TextureKey: 'debugFloor',
	walkableFillCol: 0xe6e0ec,
	obstacleFillCol: 0x2378db,
	concaveCol: 0xcaa9de,
	edgeCol:0xcdef53,
	pathCol: 0xffff33
}

export default class NewPMStrollDebug
{
    // manager = null;
    // scene;
    // graphics = null;
    constructor(manager)
    {
        this.manager = manager;
        this.scene = manager.scene;

        console.log("Debug", this)
        this.graphics = this.scene.add.graphics({x:0, y:0}).setDepth(0);

		//container for shapeVertices
		// this.verticesShape = new Map()

		//debug text		
		this.debugText = this.scene.add.text(10, 10, "-Debug Info-", {
            fontSize: "12px",
            fill: "gray"
        }).setDepth(9999)

		// this.scene.input.keyboard.on('keydown-Z', this.pressedZ, this)
    }

    showConcave(visMap)
    {
        for (const vertex of visMap.graph.keys())
        {
            this.showVector(vertex)
        }
    }

    showVector(vector)
	{
		this.graphics.fillPoint(vector.x, vector.y, 3)
	}

    showPolygon(pointsAry, color = CONSTANTS.walkableFillCol)
    {
        this.setFillColor(color)
        console.log("pointsAry", pointsAry)
        this.graphics.fillPoints(pointsAry, true, false)
    }

	setFillColor(hexCol = 0xffffff)
	{
		this.graphics.fillStyle(hexCol, 1)
	}

	setLineColor(hexCol = 0xffff00, lineWidth = 1)
	{
		this.graphics.lineStyle(lineWidth, hexCol, 1)
	}

    showAsImage(polygonalMap, showConcave = true)
	{
		const {graphics} = this
		let col = CONSTANTS.walkableFillCol
		const alpha = 1
        this.setFillColor(col, alpha)
		
		for (const poly of polygonalMap.polygons.values())
		{
            graphics.fillPoints(poly.points, true, false)
			this.setFillColor(CONSTANTS.obstacleFillCol, alpha)
		}

		if (showConcave)
		{
			this.setFillColor(CONSTANTS.concaveCol, 1)
			
			//console.log("%cDEBUG_PMap", "background: purple", ...polygonalMap.graph.nodeMap.keys())
			for (const vertex of polygonalMap.graph.nodeMap.keys())
			{
				graphics.fillPoint(vertex.x, vertex.y, 3)
			}
		}

		//If the debug texture exists, then destroy it!
		this.clearTexture()

		graphics.generateTexture(CONSTANTS.TextureKey)

		this.polygonalMapAsImage = this.scene.add.image(0, 0, CONSTANTS.TextureKey).setOrigin(0, 0)//.setDepth(0)
		this.scene.children.sendToBack(this.polygonalMapAsImage)
		
		graphics.clear()
	}

    clearTexture()
	{
		if (this.scene.textures.exists(CONSTANTS.TextureKey))
		{
			this.scene.textures.remove(CONSTANTS.TextureKey)
		}
	}
}