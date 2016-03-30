import { dependencies } from '../external/dependencies'

@dependencies('$timeout', '$state')
export default class Documentation{
    constructor(timeout, state){
        if(state.current.name === 'documentation'){
            state.transitionTo('documentation.introduction')
        }
    }
}
