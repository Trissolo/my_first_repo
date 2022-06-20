const CONSTANTS = {
	TextureKey: 'debugFloor',
	walkableFillCol: 0xe6e0ec,
	obstacleFillCol: 0x2378db,
	concaveCol: 0xcaa9de,
	edgeCol:0xcdef53,
	pathCol: 0xffff33
}

export default class PMSDebug {
    constructor(manager)
    {
        this.manager = manager
        this.scene = manager.scene

        this.graphics = this.scene.add.graphics({x:0, y:0}).setDepth(0)

		//container for shapeVertices
		this.verticesShape = new Map()

		//debug text		
		this.debugText = this.scene.add.text(10, 10, "-Debug Info-", {
            fontSize: "12px",
            fill: "gray"
        }).setDepth(9999)

		// this.scene.input.keyboard.on('keydown-Z', this.pressedZ, this)
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

	tempTest()
	{
		const edges = [...this.scene.testMap.graph.nodeMap.values()]
		const idx = 0
		const edge = edges[idx]
		this.setFillColor.fillStyle(0xffff87, 1)
		this.graphics.lineStyle(1, 0xadbc89,1)

		edge.forEach(el => {this.graphics.lineBetween(el.fromVector.x, el.fromVector.y, el.toVector.x, el.toVector.y); this.graphics.fillPoint(el.fromVector.x, el.fromVector.y)})
		
	}

	weakMapShow(wm)
	{
		const edges = [...wm.wmEdges.values()]

		const idx = 13
		const edge = edges[idx]
		this.setFillColor(0xffff87, 1)
		this.graphics.lineStyle(1, 0xadbc89,1)

		edge.forEach(el => {this.graphics.lineBetween(el.fromVector.x, el.fromVector.y, el.toVector.x, el.toVector.y); this.graphics.fillPoint(el.fromVector.x, el.fromVector.y)})	
	}

	showConcave(polygonalMap)
	{
		const polyA = polygonalMap.polygons[0].points
		//console.log("ORCO", polygonalMap)

		this.graphics.lineStyle(1, 0xaa3366, 1)
		for (const edge of polygonalMap.graph.nodeMap.values())
		{
			for (const edgeData of (edge))
			{
				const {fromVector, toVector} = edgeData
				if(polyA.indexOf(fromVector) !== -1 && polyA.indexOf(toVector) !== -1)
				{
					this.lineBetweenVectors(fromVector, toVector)
				}
			}
		}

	}

	lineBetweenVectors(vecA, vecB)
	{
		this.graphics.lineBetween(vecA.x, vecA.y, vecB.x, vecB.y)
	}

	write(content)
	{
		this.debugText.setText(content)
	}

	edgesInfo(polygonalMap)
	{
		const edges = [...polygonalMap.graph.nodeMap.values()]
		console.dir("EdgeInfo:", edges)
		return edges
	}

	pressedZ(event, altr = Math.random())
	{
		console.log("pressed Z:", event, altr)
		const {player, dest, testMap} = this.manager.scene
		console.time("CalcDijkstra")
		this.manager.generatePathDijkstra(player, dest, testMap)
		console.timeEnd("CalcDijkstra")
		

	}

	revertPlainArray(orig)
	{
		const ary = [...orig]
		const res = []
		while(ary.length)
		{
			const y = ary.pop()
			const x = ary.pop()

			res.push(x)
			res.push(y)
		}
	
		console.dir("[",res.toString(),"]")
		return res
	}

	showVector(vector)
	{
		this.graphics.fillPoint(vector.x, vector.y, 3)
	}

	setFillColor(hexCol = 0xffffff)
	{
		this.graphics.fillStyle(hexCol, 1)
	}

	setLineColor(hexCol = 0xffff00, lineWidth = 1)
	{
		this.graphics.lineStyle(lineWidth, hexCol, 1)
	}

	showPath(resultAry, startPos, color = 0xf0f0aa)
	{
		startPos = startPos || {x: this.scene.player.x, y: this.scene.player.y}
		resultAry.push(startPos)

		this.graphics.clear()
		this.setFillColor()
		this.setLineColor(color)
		this.graphics.strokePoints(resultAry, false)

	}

	printPolygonMap(polygonalMap)
	{
		console.log("PRINTING:", polygonalMap)
		console.log(JSON.stringify(polygonalMap))
		const res = "QWE"
	}
	
}