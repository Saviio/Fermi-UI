import { dependencies } from '../../external/dependencies'
import template from '../template/template.html'
import {
    props,
    addClass,
} from '../../utils'

//IE9 pointer-event 没有兼容性 remark
export default class Buttons {
    constructor(){
        this.restrict = 'EA'
        this.replace = true
        this.scope = {
            content:'@',
            control:'=?'
        }
        this.transclude = true
        this.template = template
    }

    @dependencies('$scope', '$attrs', '$element')
    controller(scope, attrs, $elem){
        this.isLoading = $elem::props('loading')
        scope.loading = this.isLoading

        let loading = () => {
            if(!scope.loading){
                $elem.addClass('loading')
                scope.loading = true
                scope.$digest() 
            }
        }

        let done = () => {
            if(scope.loading){
                $elem.removeClass('loading')
                scope.loading = false
                scope.$digest()
            }
        }

        let disable = () => $elem.attr('disabled', true)
        let allow = () => $elem.removeAttr('disabled')


        scope.control = {
            disable,
            allow,
            loading,
            done
        }
    }

    link(scope, $elem, attrs, ctrl){
        let rootDOM = $elem[0]
        let size = (attrs.size || 'default').toLowerCase()
        let type = (attrs.type || 'default').toLowerCase()

        if(size !== 'default') $elem.addClass(`buttons-${size}`)
        $elem.addClass(`buttons-${type}`)
        if(this.isLoading) rootDOM::addClass('loading')
    }
}
