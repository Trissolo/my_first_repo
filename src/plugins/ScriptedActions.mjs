//import {ShieldEvents, ViewscreenEvents, RoomBackgroundEvents, walkEvents, RotationHelperEvents, TriggerAreaEvents} from "./AllEvents.mjs"
// import ShieldEvents from '../prefabs/ShieldEvents.mjs'
// import ViewscreenEvents from "../scenes/ViewscreenEvents.mjs"
// import RoomBackgroundEvents from "../prefabs/RoomBackgroundEvents.mjs"
// import walkEvents from "../prefabs/walkComponent/walkEvents.mjs"
// import RotationHelperEvents from "../scenes/RotationHelper/RotationHelperEvents.mjs"
// import TriggerAreaEvents from '../scenes/TriggerArea/TriggerAreaEvents.mjs'
//console.log("MODULE:", ViewscreenEvents, TriggerAreaEvents)

export default class ScriptedActions {

  constructor()
  {
    this.aryActions = []
    this.currentIdx = 0
    this.endAt = 0
  }

  clear()
  {
    this.aryActions.length = 0

    this.currentIdx = 0

    this.endAt = 0

    this.action = null
  }

  get action()
  {
    return this.aryActions[this.currentIdx]
  }

  add(actionsArray)
  {
    this.clear()

    this.aryActions.push(...actionsArray)
  }

  execute()
  {
    console.log(this.action)
  }
    // // static count = 0;
    // get value() {
    //   console.log('Getting the current value!');
    //   return this.count;
    // }
    // increment() {
    //   this.count++;
    // }
} // end ScriptedActions
