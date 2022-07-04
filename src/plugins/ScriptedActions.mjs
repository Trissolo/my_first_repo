//import {ShieldEvents, ViewscreenEvents, RoomBackgroundEvents, walkEvents, RotationHelperEvents, TriggerAreaEvents} from "./AllEvents.mjs"
// import ShieldEvents from '../prefabs/ShieldEvents.mjs'
// import ViewscreenEvents from "../scenes/ViewscreenEvents.mjs"
// import RoomBackgroundEvents from "../prefabs/RoomBackgroundEvents.mjs"
// import walkEvents from "../prefabs/walkComponent/walkEvents.mjs"
// import RotationHelperEvents from "../scenes/RotationHelper/RotationHelperEvents.mjs"
// import TriggerAreaEvents from '../scenes/TriggerArea/TriggerAreaEvents.mjs'
//console.log("MODULE:", ViewscreenEvents, TriggerAreaEvents)

export default class ScriptedActions {

  constructor()//scene)
  {
    this.aryActions = []
    this.currentIdx = 0
    this.endAt = 0

    this.lowerShieldOnEnd = true

    // this.scene = scene
  }

  setScene(scene)
  {
    this.scene = scene
  }

  clear()
  {
    this.aryActions.length = 0

    this.currentIdx = 0

    this.endAt = 0

    // this.action = null
  }

  get action()
  {
    if (this.aryActions.length)
    {
      return this.aryActions[this.currentIdx]
    }
  }

  add(actionsArray, lowerShieldOnEnd = true)
  {
    this.clear()

    this.lowerShieldOnEnd = lowerShieldOnEnd

    // this.aryActions.push(...actionsArray)

    // this.endAt = this.aryActions.length

    console.log("actionsArray", actionsArray)
    this.endAt = this.aryActions.push(...actionsArray)
  }

  execute()
  {
    console.log("Executing:", this.currentIdx, ":", this.action.action)
    console.log("Actions:", this.aryActions, this.action)//.emitter.once, this.action.emitter.once)
    this.action.emitter.once(this.action.completeWhen, this.advance, this)

    this.action.context[this.action.action].call(this.action.context, this.action.params)
  }

  advance()
  {
    this.currentIdx += 1

    if (this.currentIdx === this.endAt)
    {
      console.log("Actions complete")
      this.clear()

      if (this.lowerShieldOnEnd)
      {
        this.scene.shield.lower()
      }
    }
    else
    {
      this.execute()
    }
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
