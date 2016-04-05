import { dependencies } from '../../external/dependencies'

export default class Step{
    constructor(){
        console.log(4)
        this.step = null
    }

    next(){
        this.step.isDone() ? this.step.reset() : this.step.next()
    }

    reset(){
        this.step.reset()
    }
}
