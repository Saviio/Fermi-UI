import { dependencies } from '../../external/dependencies'

@dependencies('$scope')
export default class Checkbox{
    constructor(scope){
        this.output = this.output.bind(this)
        this.checkbox = null
        this.scope = scope
    }

    output(value){
        console.log(value)
    }
}
