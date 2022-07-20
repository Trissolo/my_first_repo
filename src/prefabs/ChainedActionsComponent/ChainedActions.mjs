export default class ChainedActions {

    constructor(parent)
    {

        this.parent = parent

        //a string that identifies the current Action being executed
        this.id = ""

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
  
    clear()
    {
      this.aryActions.length = 0
  
      this.currentIdx = 0
  
      this.endAt = 0
  
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

        console.log(this.forceBreak,"AS!!!!")
        this.forceBreak = true
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

      // debugger
      
      this.action.context[this.action.action].call(this.action.context, this.action.params)
    }

    advance()
    {
      console.log("Current SKIP status:", this.forceBreak, this)
      if (this.forceBreak)
      {
        console.log("'Advance' SKIPPINGG!!!!!!!!!!!!!!")
        return this.forceBreak = false
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

        // static count = 0;
        // get value() {
        //   console.log('Getting the current value!');
        //   return this.count;
        // }
        // increment() {
        //   this.count++;
        // }

  } // end ScriptedActions
  