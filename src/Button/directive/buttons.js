import { dependencies } from '../../external/dependencies'
import template from '../template/template.html'
import { props } from '../../utils'

//IE9 pointer-event 没有兼容性 remark
export default class Buttons {
    constructor(){
        this.restrict = 'EA'
        this.replace = true
        this.scope = {
            content:'@',
            control:'='
        }
        this.transclude = true
        this.template = template
        //this.controller.$inject = ['$scope','$attrs','$element']
    }

    @dependencies('$scope', '$attrs', '$element')
    controller(scope, attrs, $elem){
        let isLoading = $elem::props('loading')
        scope.loading = isLoading

        let loading = () => {
            if(!scope.loading){
                $elem.addClass('loading')
                scope.loading = true
                scope.$apply()
            }
        }

        let done = () => {
            if(scope.loading){
                $elem.removeClass('loading')
                scope.loading = false
                scope.$apply()
            }
        }

        let disable = () => $elem.attr('disabled', true)
        let allow = () => $elem.removeAttr('disabled')


        if(attrs.control !== undefined){
            scope.control = {
                disable,
                allow,
                loading,
                done
            }
        }

        if(isLoading) $elem.addClass('loading')
    }

    link(scope, $elem, attrs, ctrl){
        let size = (attrs.size || 'default').toLowerCase()
        let type = (attrs.type || 'default').toLowerCase()

        if(size !== 'default') $elem.addClass(`buttons-${size}`)
        $elem.addClass(`buttons-${type}`)
    }
}
