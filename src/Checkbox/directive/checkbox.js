import { dependencies } from '../../external/dependencies'
import template from '../template/template.html'
import {
    on,
    query,
    addClass,
    removeClass,
    getDOMState
} from '../../utils'

//disabled
//checked
//onChange
//default

class fakeEvent{
    constructor(checked){
        this.target = {
            checked:!!checked
        }
    }

    preventDefault(){}

    stopPropagation(){}
}

export class Checkbox{
    constructor(){
        this.restrict = 'EA'
        this.replace = true
        this.scope = {
            onchange:'=?',
            label:'@',
            control:'=?'
        }
        this.template = template
    }

    compile($tElement, tAttrs, transclude){
        this.rootDOM = $tElement[0]
        this.checkboxElem = this.rootDOM::query('.fm-checkbox')
        this.input = this.rootDOM::query('input[type=checkbox]')
        return this.link
    }

    link(scope, $elem, attrs, ctrl){
        let checked
        this.input.checked = checked = this.rootDOM::getDOMState('default') || false
        if(checked) this.check()
        let disabled = !!(this.rootDOM::getDOMState('disabled') || false)


        let handler = e => {
            e.stopPropagation()

            if(disabled) return
            if(checked === e.target.checked) return

            checked = e.target.checked
            checked ? this.check() : this.unCheck()

            if(typeof scope.onchange === 'function'){
                scope.onchange(checked)
            }
        }

        this.input::on('change', handler)

        scope.control = {
            disable:() => {
                disabled = true
                this.disable()
            },
            allow:() => {
                disabled = false
                this.allow()
            }
        }

        Object.defineProperty(scope.control,'checked', {
            get:() => checked,
            set:(value) => handler(new fakeEvent(value))
        })

    }

    check(){
        this.checkboxElem::addClass('fm-checkbox-checked')
    }

    unCheck(){
        this.checkboxElem::removeClass('fm-checkbox-checked')
    }

    disable(){
        this.rootDOM.setAttribute('disabled', 'disabled')
    }

    allow(){
        this.rootDOM.removeAttribute('disabled')
    }
}
