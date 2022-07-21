export default class SingleAction {

    constructor(completeWhen, emitter, func, params)
    {
        //event name that determine the completition of this action
        this.completeWhen = completeWhen

        // emitter that will fire the completeWhen event
        this.emitter = emitter

        // the function that will be called
        this.func = func

        // the params for function
        this.params = params
    }

    destroy()
    {

    }
}