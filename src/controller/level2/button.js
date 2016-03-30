import { dependencies } from '../../external/dependencies'

@dependencies('$timeout', '$state')
export default class Button{
    constructor(timeout, state){
        this.btnIns1 = null
    }

    changeState(){
        this.btnIns1.loading()
    }
}
