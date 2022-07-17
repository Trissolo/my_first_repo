//import {ShieldEvents, ViewscreenEvents, RoomBackgroundEvents, walkEvents, RotationHelperEvents, TriggerAreaEvents} from "./AllEvents.mjs"
// import ShieldEvents from '../prefabs/ShieldEvents.mjs'
// import ViewscreenEvents from "../scenes/ViewscreenEvents.mjs"
// import RoomBackgroundEvents from "../prefabs/RoomBackgroundEvents.mjs"
// import walkEvents from "../prefabs/walkComponent/walkEvents.mjs"
// import RotationHelperEvents from "../scenes/RotationHelper/RotationHelperEvents.mjs"
// import TriggerAreaEvents from '../scenes/TriggerArea/TriggerAreaEvents.mjs'
//console.log("MODULE:", ViewscreenEvents, TriggerAreaEvents)
import ClearArray from "../utils/ClearArray.mjs"


export default class ScriptedActions {

  constructor()//scene)
  {
    this.aryActions = []

    this.currentIdx = 0

    this.endAt = 0

    this.skip = false


    this.lowerShieldOnEnd = true

    // this.scene = scene
  }

  setScene(scene)
  {
    this.scene = scene
  }

  clear()
  {
    // console.log("Act CLEARING...")
    // for (const [idx, singleAction] of this.aryActions.entries())
    // {
    //   console.dir(`Clearing ${idx+1} of ${this.aryActions.length}`, singleAction)
    //   singleAction.context = undefined
    //   singleAction.emitter = undefined
    //   if (Array.isArray(singleAction.params))
    //   {
    //     singleAction.params.forEach(ClearArray)
    //   }
    //   singleAction.params = undefined
    // }

    // console.log("Act END!")

    this.aryActions.length = 0

    this.currentIdx = 0

    this.endAt = 0

    this.skip = false

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

    if (this.aryActions.length !== 0)
    {
      // console.warn("There is another action set/executing!")
      // console.dir(this.action)
      // console.error("Trying to remove listener...", this.currentIdx)

      // console.log("%cREMOVING SA", "color: yellow; background-color: blue;", this.action.completeWhen, "from", this.action.emitter, `at POS: ${this.currentIdx}`);

      // console.dir("DARN:", this.action.emitter.listeners(this.action.completeWhen) )
      this.action.emitter.off(this.action.completeWhen, this.advance, this, true)

      console.log(this.skip,"AS!!!!")
      this.skip = true
      // console.dir("DARN2:", this.action.emitter.listeners(this.action.completeWhen) )
      // return false
    }

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
    console.log("Actions:", this.aryActions, this.action)
    this.action.emitter.once(this.action.completeWhen, this.advance, this)
    // console.dir("DARN:", this.action.emitter.listeners(this.action.completeWhen) )

    this.action.context[this.action.action].call(this.action.context, this.action.params)
  }

  advance()
  {
    console.log("Current SKIP status:", this.skip, this)
    if (this.skip)
    {
      console.log("'Advance' SKIPPINGG!!!!!!!!!!!!!!")
      return this.skip = false
    }

    console.log("Advance' NOT SKIPPED")

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
