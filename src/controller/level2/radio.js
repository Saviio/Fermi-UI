import { dependencies } from '../../external/dependencies'

export default class Radio{
    constructor(){
        this.output = this.output.bind(this)
        this.radio = null
    }

    output(value){
        console.log(value)
    }
}
