import { dependencies } from '../../external/dependencies'
import template from '../template/query.html'
import { detechPrefix, getDOMState } from '../../utils'

@dependencies('$timeout')
export default class Query{
    constructor($timeout){
        this.replace = true
        this.restrict = 'EA'
        this.template = template
        //this.controller.$inject = ['$scope']
        this.scope = {
            control: '=',
            callback: '='
        }
        this.$timeout = $timeout
    }

    @dependencies('$scope')
    controller(scope){
        scope.control={
            hide:function(execCallback = false){
                if(typeof $scope.callback === 'function' && execCallback){
                    scope.callback()
                }
                scope.hide()
            },
            show:() => scope.show()
        }
    }

    link(scope, $element, attrs, ctrl){
        let { prefix, eventPrefix } = detechPrefix()
        let actived = $element::getDOMState('actived')

        $element.bind(eventPrefix + 'TransitionEnd',() => { //onMotionEnd
            if(!actived) $element.addClass('hide')
        })

        scope.show = () => {
            $element.removeClass('hide')
            this.$timeout(() => $element.addClass('progress-query-show'), 10)
            actived = true
        }

        scope.hide = () => {
            this.$timeout(() => $element.removeClass('progress-query-show'), 10)
            actived = false
        }

        if(actived) scope.show()
    }
}

//Query.$inject=['$timeout']
