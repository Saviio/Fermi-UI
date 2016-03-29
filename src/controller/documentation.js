import { dependencies } from '../external/dependencies'

@dependencies('$timeout', '$state')
export default class Documentation{
    constructor(timeout, state){
        console.log(2)
        state.transitionTo('documentation.introduction')
    }
}
