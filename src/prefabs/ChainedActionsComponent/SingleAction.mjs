import ClearArray from "../../utils/ClearArray.mjs"

export default class SingleAction {

    constructor(id, completeWhen, emitter, func, params, context = emitter)
    {
        //event name that determine the completition of this action
        this.completeWhen = completeWhen

        // emitter that will fire the completeWhen event
        this.emitter = emitter

        // the function that will be called
        this.func = func

        // the params for function
        this.params = params

        this.context = context

        //hmmm
        this.id = id
    }

    setId(id)
    {
        this.id = id

        return this
    }

    destroy()
    {
        this.completeWhen = undefined

        this.emitter = undefined

        this.func = undefined

        if (Array.isArray(this.params))
        {
          this.params.forEach(ClearArray)
        }
        this.params = undefined

        this.context = undefined

        this.id = undefined
    }
}
