import horizontal from '../template/horizontal.html'
import vertical from '../template/vertical.html'


//next function

//step
//mode
//size


export class Steps {
    constructor(){
        this.restrict = 'EA'
        this.replace = true
        this.scope = {
            items:'='
        }
        this.transclude = true
        this.template = template
    }

    @dependencies('$scope')
    controller(scope){

    }
}


//status
//title
//description

export class Step{
    constructor(){
        this.require = '^fermiSteps'
    }
}
