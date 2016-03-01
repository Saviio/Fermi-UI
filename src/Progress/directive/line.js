import { dependencies } from '../../external/dependencies'
import template from '../template/line.html'
import {
    query,
    addClass,
    removeClass
} from '../../utils'

export default class{
    constructor(){
        this.replace = true
        this.restrict = 'EA'
        this.template = template
        this.require = '^ngModel'
        this.scope = {
            success:'=',
            ngModel:'=', //remark value
            label:'@'
        }
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

    link(scope, $element, attrs, ctrl){
        let valueCheck = function(){
            if(scope.ngModel > 100) scope.ngModel = 100
            else if(scope.ngModel < 0) scope.ngModel = 0
        }

        let inProgress = scope.ngModel >= 100

        let success = () => {
            this.rootDOM::addClass('progress-success')
            if(typeof scope.success === 'function') scope.success()
        }

        let notComplete = () => {
            this.rootDOM::removeClass('progress-success')
        }

        scope.$watch('ngModel', (newValue, oldValue) => {
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
