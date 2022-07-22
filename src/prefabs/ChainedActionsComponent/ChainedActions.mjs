import SingleAction from "./SingleAction.mjs"

export default class ChainedActions {

    constructor(parent)
    {

        this.parent = parent

        this.scene = parent.scene

        //a string that identifies the current Action being executed
        this.id = ""

        //
        this.signature = Symbol(this.parent.name)

        //an array of Actions which are processed in sequence
        this.aryActions = []

        this.currentIdx = 0

        this.endAt = 0

        
        // see 'manageUserClick' method in roomBackground
        // Maybe this flag will become unnecessary thanks to "id" use.
        this.forceBreak = false

        // hmmm
        this.lowerShieldOnEnd = true
  
    }

    makeSingleAction(id, completeWhen, emitter, func, params, context)
    {
      return new SingleAction(id, completeWhen, emitter, func, params, context)
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

      //new
      for (const action of this.aryActions)
      {
        action.destroy()
      }

      this.aryActions.length = 0

      this.currentIdx = 0

      this.endAt = 0

      this.id = ""

      this.forceBreak = false

      // this.action = null
    }

    get action()
    {
      if (this.aryActions.length)
      {
        return this.aryActions[this.currentIdx]
      }
    }

    add(id, actionsArray, autoStart = true, lowerShieldOnEnd = true)
    {

      if (this.aryActions.length !== 0)
      {
        // console.warn("There is another action set/executing!")
        // console.dir(this.action)
        // console.error("Trying to remove listener...", this.currentIdx)

        // console.log("%cREMOVING SA", "color: yellow; background-color: blue;", this.action.completeWhen, "from", this.action.emitter, `at POS: ${this.currentIdx}`);

        // console.dir("DARN:", this.action.emitter.listeners(this.action.completeWhen) )
        this.action.emitter.off(this.action.completeWhen, this.advance, this, true)

        // console.log(this.forceBreak,"AS!!!!")
        // this.forceBreak = true
        // console.dir("DARN2:", this.action.emitter.listeners(this.action.completeWhen) )
        // return false
      }

      this.clear()

      this.id = id

      this.lowerShieldOnEnd = lowerShieldOnEnd

      console.log("actionsArray", actionsArray)

      //more readable:
      // this.aryActions.push(...actionsArray)

      // this.endAt = this.aryActions.length

      this.endAt = this.aryActions.push(...actionsArray)

      if (autoStart)
      {
        this.execute()
      }

    }

    execute()
    {
      console.log("Executing:", this.currentIdx, ":", this.action.func)
      console.log("IDS:", this.action.id , this.id)

      this.action.emitter.once(this.action.completeWhen, this.advance, this)

      this.action.context[this.action.func].call(this.action.context, this.action.params)
    }

    advance()
    {
      console.log("advance checking...", this.action.id , this.id)
      if (this.action.id !== this.id)
      {
        console.log("Action -> %cABORTED", "color:orange;")
        return this.clear()
      }

      // console.log("Current SKIP status:", this.forceBreak, this)
      // if (this.forceBreak)
      // {
      //   console.log("'Advance' SKIPPINGG!!!!!!!!!!!!!!")
      //   return this.forceBreak = false
      // }

      console.log("Action -> %cContinuing", "color:green;")

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

        // static count = 0;
        // get value() {
        //   console.log('Getting the current value!');
        //   return this.count;
        // }
        // increment() {
        //   this.count++;
        // }

  } // end ScriptedActions
  