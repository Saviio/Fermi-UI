import { dependencies } from '../../external/dependencies'
import template from '../template/line.html'
import {
    props,
    query,
    getType,
    addClass,
    removeClass
} from '../../utils'

export default class Line{
    constructor(){
        this.replace = true
        this.restrict = 'EA'
        //this.require = '^ngModel'
        this.scope = {
            success:'=',
            value:'=', //remark value
            label:'@'
        }
        this.template = template
    }

    compile($tElement, tAttrs, transclude){
        this.rootDOM = $tElement[0]
        let unit = tAttrs.unit || '%'
        let binding = this.rootDOM::query('.progress-line-text')
        binding.innerHTML += unit
        return this.link
    }

    @dependencies('$scope')
    controller(scope){}

    link(scope, $elem, attrs, ctrl){
        let defaultValue = ~~($elem::props('default')  || 0)

        scope.value = defaultValue

        let valueCheck = function(){
            if(scope.value > 100) scope.value = 100
            else if(scope.value < 0) scope.value = 0
        }

        let inProgress = scope.value >= 100

        let success = () => {
            this.rootDOM::addClass('progress-success')
            if(typeof scope.success === 'function') scope.success()
        }

        let notComplete = () => {
            this.rootDOM::removeClass('progress-success')
        }

        scope.$watch('value', (newValue, oldValue) => {
            if(newValue === oldValue) return
            valueCheck()
            if(newValue >= 100 && inProgress){
                inProgress = false
                setTimeout(success, 0)
            } else if(!inProgress && newValue < 100){
                inProgress = true
                setTimeout(notComplete, 0)
            }
        })
    }
}
