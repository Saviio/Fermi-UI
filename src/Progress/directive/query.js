import { dependencies } from '../../external/dependencies'
import template from '../template/query.html'
import {
    props,
    addClass,
    removeClass
} from '../../utils'

import {
    onMotionEnd
} from '../../utils/transition'


export default class Query{
    constructor($timeout){
        this.replace = true
        this.restrict = 'EA'
        this.template = template
        this.scope = {
            control: '=',
            callback: '='
        }
    }

    @dependencies('$scope')
    controller(scope){
        scope.control={
            hide:function(execCallback = false){
                if(typeof scope.callback === 'function' && execCallback){
                    scope.callback()
                }
                scope.hide()
            },
            show:() => scope.show()
        }
    }

    link(scope, $element, attrs, ctrl){
        let rootDOM = $element[0]
        let actived = rootDOM::props('actived')
        let showCls = 'fm-progress-query-show'
        
        scope.show = () => {
            rootDOM::removeClass('hide')
            setTimeout(() =>
                rootDOM::addClass(showCls), 10)
            actived = true
        }

        scope.hide = () => {
            setTimeout(() =>{
                rootDOM
                    ::removeClass(showCls)
                    ::onMotionEnd(() => {
                        if(!actived) rootDOM::addClass('hide')
                    }, showCls)
            }, 10)
            actived = false
        }


        if(actived) scope.show()
    }
}
