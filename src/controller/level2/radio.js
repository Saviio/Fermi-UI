import { dependencies } from '../../external/dependencies'

export default class Radio{
    constructor(){
        this.output = this.output.bind(this)
        this.radio = null
        setTimeout(() => window.radio = this.radio, 1000)
    }

    output(value){
        console.log(value)
    }
}
