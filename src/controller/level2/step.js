import { dependencies } from '../../external/dependencies'

export default class Step{
    constructor(){
        this.step = null
    }

    next(){
        this.step.isDone() ? this.step.reset() : this.step.next()
    }

    reset(){
        this.step.reset()
    }
}
