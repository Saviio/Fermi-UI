import { dependencies } from '../../external/dependencies'
import template from '../template/template.html'
import loader from '../template/loader.svg'
import {
    on,
    props,
    hasClass,
    addClass,
    removeClass
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

    compile(tElement){
        this.rootDOM = tElement[0]
        return this.link
    }

    @dependencies('$scope', '$attrs')
    controller(scope, attrs, $elem){
        this.isLoading = $elem::props('loading')
        this.disabled = $elem::props('disabled')
        scope.loading = this.isLoading

        let disable = fn => {
            this.disabled = true
            this.rootDOM.setAttribute('disabled', true)
            this.rootDOM::addClass('fm-button-disabled')
            if(typeof fn === 'function') fn()
        }
        let allow = fn=> {
            this.disabled = false
            this.rootDOM.removeAttribute('disabled')
            this.rootDOM::removeClass('fm-button-disabled')
            if(typeof fn === 'function') fn()
        }

        let loading = (force = false) => {
            if(scope.loading && !force) return
            this.rootDOM::addClass(loadingClass)
            scope.loading = true
            if(!this.disabled){
                //set disable on DOM to prevent eventlistener will not be fired when button is in loading.
                this.rootDOM.setAttribute('disabled', true)
            }
            if(!/\$apply|\$digest/.test(scope.$root.$$phase)) scope.$digest()
        }

        let done = (force = false) => {
            if(!scope.loading && !force) return
            this.rootDOM::removeClass(loadingClass)
            scope.loading = false
            if(!this.disabled){
                this.rootDOM.removeAttribute('disabled')
            }
            if(!/\$apply|\$digest/.test(scope.$root.$$phase)) scope.$digest()
        }

        scope.control = {
            done,
            allow,
            disable,
            loading
        }
    }

    link(scope, $elem, attrs, ctrl){
        let size = (attrs.size || 'default').toLowerCase()
        let type = (attrs.type || 'default').toLowerCase()

        if(size !== 'default') this.rootDOM::addClass(`buttons-${size}`)
        this.rootDOM::addClass(`buttons-${type}`)
        if(this.isLoading) scope.control.loading(true)
    }
}
