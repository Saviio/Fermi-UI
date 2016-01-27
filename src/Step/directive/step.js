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


    @dependencies('$scope')
    controller(scope){
        scope.steps = []
        scope.next = () => {
            let unChecked = scope.steps.filter(item => item.status() === false)
            unChecked.length > 0 && unChecked[0].check()
        }
    }

    passing(exports, scope){
        exports.add = item => {
             scope.steps.push(item)
             return scope.steps.length
        }
    }

    link(scope, $element, attrs, ctrl){
        let width = 96 / scope.steps.length
        scope.steps.forEach(item => item.$elem.attr('style', `width:${width.toFixed(0)}%;`))
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
        this.scope = {
            title:'@',
            checked:'=?'
        }
    }

    @dependencies('$scope')
    controller(scope){
        scope.title = scope.title || ' '
        scope.checked = scope.checked || false
        scope.check = () => scope.checked = true
        scope.status = () => scope.checked
    }

    link(scope, $element, attrs, parentCtrl){
        scope.step = parentCtrl.add({
            status:scope.status.bind(scope),
            check:scope.check.bind(scope),
            $elem:$element
        })
    }
}
