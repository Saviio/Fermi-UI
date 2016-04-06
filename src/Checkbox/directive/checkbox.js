import { dependencies } from '../../external/dependencies'
import template from '../template/template.html'
import fakeEvent from '../../external/fakeEvent'
import {
    on,
    noop,
    query,
    props,
    addClass,
    removeClass,
    getDOMState
} from '../../utils'




export class Checkbox{
    constructor(){
        this.restrict = 'EA'
        this.replace = true
        this.scope = {
            change:'=?',
            label:'@',
            control:'=?'
        }
        this.template = template
    }

    @dependencies('$scope', '$element')
    controller(scope, $element){
        this.rootDOM = $element[0]
        this.checkboxElem = this.rootDOM::query('.fm-checkbox')
        this.input = this.rootDOM::query('input[type=checkbox]')
        this.input.disabled = this.disabled = !!(this.rootDOM::props('disabled') || false)
        this.input.checked = this.rootDOM::props('checked') || false

        let disable = () => {
            this.disabled = this.input.disabled = true
            this.rootDOM.setAttribute('disabled', 'disabled')
        }

        let allow = () => {
            this.disabled = this.input.disabled = false
            this.rootDOM.removeAttribute('disabled')
        }

        scope.control = {
            disable,
            allow
        }

        Object.defineProperty(scope.control, 'checked', {
            get:() => this.input.checked,
            set:(value) => this.handle(new fakeEvent(value))
        })

        this.callback = typeof scope.change === 'function'
        ? scope.change
        : noop
    }

    link(scope, $elem, attrs, ctrl){
        if(this.input.checked) this.check()
        this.input::on('change', (...args) => {
            this.handle.apply(this, args)
            if(!/\$apply|\$digest/.test(scope.$root.$$phase)) scope.$apply()
        })
    }

    check(){
        this.checkboxElem::addClass('fm-checkbox-checked')
    }

    unCheck(){
        this.checkboxElem::removeClass('fm-checkbox-checked')
    }

    handle(e){
        if(this.disabled) return
        e.target.checked ? this.check() : this.unCheck()
        this.callback(e.target.checked)
    }
}
