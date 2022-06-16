const ARC = Math.PI / 4

const directionsMap = new Map([
    [2.356194490192345, "SW"],
    [1.5707963267948966, "S"],
    [0.7853981633974483, "SE"],
    [0, "E"],
    [-0.7853981633974483, "NE"],
    [-1.5707963267948966, "N"],
    [-2.356194490192345, "NW"],
    //Both "PI" and "-PI" mean "West"
    [-3.141592653589793, "W"],
    [3.141592653589793, "W"]
  ])

  export { directionsMap, ARC }
  /*
  function generateDirectionsMap()
  {
    // "W" appears twice, because both PI and -PI denote "West"
    const dirs = ["W", "SW", "S", "SE", "E", "NE", "N", "NW", "W"]
    
    const ARC = Math.PI / 4
    
    //number representing a direction, in radians
    let value = Math.PI + ARC
    
    const map = new Map()
    
    //populate the map

    for (const cardinal of dirs)
    {
      map.set(value -= ARC, cardinal)
    }
    
    //check the map in console
    map.forEach( (value, key, mapItself) => console.log(`[${key} , "${value}"]`)  )
    
    return map
  }
  */