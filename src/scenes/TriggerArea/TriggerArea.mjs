import Phaser from 'phaser';

//import NumFromString from '../utils/NumFromString'

// import TriggerAreaEvents from './taEvents.mjs';



class TriggerArea extends Phaser.GameObjects.Zone // Phaser.Events.EventEmitter
{
    constructor(manager)//, coordsAsString, actor)
    {
      super(manager.scene)
      
      this.manager = manager

      // Is this instance available for recycling or not?
      this.available = true

      // the rectangle!
      this.area = new Phaser.Geom.Rectangle()//...NumFromString(coordsAsString, 0))
      
      // array of GameObjects that can trigger this area
      this.effectuators = []//Array.isArray(actor)? actor : [actor]

      // flag for checkRect
      this._areaIsOccupied = false
      
      // Check for actors in rectangle area?
      this.checkRect = false

      this
        .setVisible(false)
        .setOrigin(0)
        .setDepth(1)
        .setInteractive({hitArea: this.area, hitAreaCallback: Phaser.Geom.Rectangle.Contains, cursor:'url(assets_prod/cursors/exit.cur), pointer' } )
        .addToDisplayList();
      // hoverNames array index
      this.hoverName = null
      // Check for pointer input?
      //this.checkZone = false

    }
} // end Class 

export default TriggerArea

/*
const {NOOP} = Phaser.Utils
//shortcuts
const {Rectangle} = Phaser.Geom

//events
const TriggerAreaEvents = {
  TRIGGERED: 'triggered',
  DISENGAGED: 'disengaged'
}

class RegionsManager
{
	constructor(scene)
  {
    this.scene = scene
    this.sceneEvents = scene.events
    //log('Debug', this)
    
    this.regions = new Map()
    this.pendingRegions = new Map()
    
    this.actionsMap = new Map([[false, this.actorOutside], [true, this.actorInside]])
    //fake
    this.timerEvent = scene.time.addEvent({ delay: 50, paused: true, callback: this.checkTriggerArea, callbackScope: this, loop: true })//
  }
  
  checkTriggerArea()//(triggerArea)
  {
  	//log("checkTriggerArea:", this)
    
    
    for ( const currentArea of this.regions.values() )
    {
      const {effectuators} = currentArea
      
      for (const actor of effectuators)
      {
        //log("Bool Inside", currentArea.area.contains(actor.x, actor.y),  this.actionsMap)
        //const result = this.actionsMap.get(currentArea.area.contains(actor.x, actor.y))
        //log('result', result, this)
        //result(currentArea, actor, this)
        //this.actionsMap.get(currentArea.area.contains(actor.x, actor.y))(currentArea, actor)
        
        this.actionsMap.get(currentArea.area.contains(actor.x, actor.y))(currentArea, actor)
      }
    }
    
  }
  
  actorInside(currentArea, currentActor)//, stoca)
  {
  	//log("actorInside", this, currentActor.scene.events ===  stoca.sceneEvents)
    if(!currentArea._areaIsOccupied)
    {
    	currentArea._areaIsOccupied = true
      currentActor.scene.events.emit(TriggerAreaEvents.TRIGGERED, currentArea, currentActor)
      //this.sceneEvents.emit(TriggerAreaEvents.TRIGGERED, currentArea, currentActor)
    }
  }
  
  actorOutside(currentArea, currentActor)//, stoca)
  {
  //log("actorOutside", this)
    if(currentArea._areaIsOccupied)
    {
    	currentArea._areaIsOccupied = false
      currentActor.scene.events.emit(TriggerAreaEvents.DISENGAGED, currentArea, currentActor)
      //this.sceneEvents.emit(TriggerAreaEvents.DISENGAGED, currentArea, currentActor)
    }
  }
  
  add(rectangleParamsAsString, name, actor)
  {
  //log('.add:', this)
    this.regions.set(name, new TriggerArea(rectangleParamsAsString, name, actor))
  }
  
  
}//end RegionsManager class


//simple TriggerArea

class TriggerArea
{
  constructor(rectangleParamsAsString, name, actor)
  {
    //this.manager = manager
    this.name = name
    this._areaIsOccupied = false
    this.area = this.buildRect(rectangleParamsAsString)
    //this.actor = actor
    this.effectuators = Array.isArray(actor)? [...actor] : [actor]
    //this.effectuators.push( Array.isArray(actor)? )
    
    
    //entities_list = []
  }
  
  destroy()
  {
    //this.manager = undefined
    this.effectuators.length = 0
  }
  
  buildRect(params)
  {
    return new Rectangle(  ...params.split("_").map(el => +el) )
  }
  
}//end TriggerArea class
*/
