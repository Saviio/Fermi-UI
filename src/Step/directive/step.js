import { dependencies } from '../../external/dependencies'
import steps from '../template/steps.html'
import step from '../template/step.html'
import { props, getStyle, setStyle } from '../../utils'



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
        scope.mode = (scope.mode && scope.mode.match(/v|h/ig)[0] || 'H').toUpperCase()
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

        scope.isDone = () => scope.steps.filter(item => item.status()).length === scope.steps.length

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
        let rootDOM = $element[0]
        let unit = 96 / scope.steps.length
        let style = scope.mode === 'H' ? 'width' : 'height'
        let unChecked = scope.steps.filter(item => item.status() === false)
        unChecked.length > 0 && unChecked[0].inProgress()
        if(scope.steps.length >= 2){
            let rootUnit = rootDOM::getStyle(style, 'px')
            setTimeout(() => {
                let stepStyle = scope.steps.map(item => item.elem::getStyle(style, 'px'))
                let avg = (rootUnit - stepStyle.reduce((pre, cur) => pre + cur) - 3 * stepStyle.length) / (scope.steps.length - 1)
                for(let i = 0; i < scope.steps.length - 1; i++ ){
                    let option = {}, elem = scope.steps[i].elem
                    option[style] = `${avg + stepStyle[i]}px`
                    elem::setStyle(option)
                }
            }, 0)

        }

        //item.$elem.attr('style', `${style}:${unit.toFixed(0)}%;`
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
            title:'@'
        }
    }

    @dependencies('$scope', '$element')
    controller(scope, $elem){
        scope.title = scope.title || ' '
        scope.checked = $elem::props('checked')
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
            elem:$element[0]
        })
    }
}
