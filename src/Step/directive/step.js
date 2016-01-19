import { dependencies } from '../../external/dependencies'
import horizontal from '../template/horizontal.html'
import vertical from '../template/vertical.html'
import step from '../template/step.html'


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
        this.template = horizontal
    }

    compile($tElement, tAttrs, transclude){
        this.$container = $tElement
    }

    @dependencies('$scope')
    controller(scope){

    }

    passing(exports, scope){
        exports.$container = this.$container
    }

}


//status
//title
//description

export class Step{
    constructor(){
        this.restrict = 'EA'
        this.require = '^fermiSteps'
        this.replace = true
        this.template = step
        this.transclude = true
        this.scope = {}
    }

    @dependencies('$scope')
    controller(){

    }

    link(scope, $element, attrs, parentCtrl){
        console.log(parentCtrl)
    }
}
