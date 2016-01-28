import { dependencies } from '../../external/dependencies'
import steps from '../template/steps.html'
import step from '../template/step.html'



export class Steps {
    constructor(){
        this.restrict = 'EA'
        this.replace = true
        this.scope = {
            size:'@',
            mode:'@',
            control:'=?'
        }
        this.transclude = true
        this.template = steps
    }


    @dependencies('$scope')
    controller(scope){
        scope.steps = []
        scope.mode = scope.mode || 'H'
        scope.size = scope.size || 'small'
        scope.next = () => {
            let unChecked = scope.steps.filter(item => item.status() === false)
            unChecked.length > 0 && unChecked[0].check()
            unChecked[1] !== undefined && unChecked[1].inProgress()
        }

        scope.reset = () => {
            scope.steps.forEach(item => item.cancel())
            scope.steps[0] && scope.steps[0].inProgress()
        }

        scope.isDone = () => scope.steps.filter(item => item.status()) === scope.steps.length

        scope.control = {
            next:scope.next,
            reset:scope.reset,
            isDone:scope.isDone
        }
    }

    passing(exports, scope){
        exports.add = item => {
             scope.steps.push(item)
             return scope.steps.length
        }
    }

    link(scope, $element, attrs, ctrl){
        let unit = 96 / scope.steps.length
        let style = scope.mode === 'H' ? 'width' : 'height'
        let unChecked = scope.steps.filter(item => item.status() === false)
        unChecked.length > 0 && unChecked[0].inProgress()
        scope.steps.forEach(item => item.$elem.attr('style', `${style}:${unit.toFixed(0)}%;`))
    }

}

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
        scope.state = scope.checked ? 'checked' : 'waiting'
        scope.check = () => {
            scope.checked = true
            scope.state = 'checked'
        }

        scope.cancel = () => {
            scope.checked = false
            scope.state = 'waiting'
        }

        scope.inProgress = () => scope.state = 'inProgress'

        scope.status = () => scope.checked
    }

    link(scope, $element, attrs, parentCtrl){
        scope.step = parentCtrl.add({
            status:scope.status,
            check:scope.check,
            cancel:scope.cancel,
            inProgress:scope.inProgress,
            $elem:$element
        })
    }
}
