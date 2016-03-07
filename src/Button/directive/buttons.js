import { dependencies } from '../../external/dependencies'
import template from '../template/template.html'
import loader from '../template/loader.svg'
import {
    props,
    addClass,
} from '../../utils'

const loadingClass = 'fm-button-loading'

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
            if(scope.loading) return
            $elem.addClass(loadingClass)
            scope.loading = true
            scope.$digest()
        }

        let done = () => {
            if(!scope.loading) return
            $elem.removeClass(loadingClass)
            scope.loading = false
            scope.$digest()
        }

        let disable = () => $elem.attr('disabled', true)
        let allow = () => $elem.removeAttr('disabled')


        scope.control = {
            done,
            allow,
            disable,
            loading
        }
    }

    link(scope, $elem, attrs, ctrl){
        let rootDOM = $elem[0]
        let size = (attrs.size || 'default').toLowerCase()
        let type = (attrs.type || 'default').toLowerCase()

        if(size !== 'default') rootDOM::addClass(`buttons-${size}`)
        rootDOM::addClass(`buttons-${type}`)
        if(this.isLoading) rootDOM::addClass(loadingClass)
    }
}
