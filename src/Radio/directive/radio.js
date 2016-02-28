import { dependencies } from '../../external/dependencies'
import template from '../template/template.html'
import radioGroup from '../template/radioGroup.html'
import { DOM as dom } from '../../utils/browser'
import {
    on,
    noop,
    props,
    query,
    nextId,
    nextUid,
    addClass,
    queryAll,
    removeClass
} from '../../utils'


const SEPARATED = 1
const GROUP = 2

//disable
//checked
//onchange
//value


export class Radio{
    constructor(){
        this.restrict = 'EA'
        this.replace = true
        this.scope = {
            onchange:'=?',
            label:'@',
            control:'=?'
        }
        this.template = template
        this.require = '?^^fermiRadiogroup'
    }


    @dependencies('$scope', '$element')
    controller(scope, $element){//手动管理value?
        this.rootDOM = $element[0]
        this.radioElem = this.rootDOM::query('.fm-radio')
        this.input = this.rootDOM::query('[type=radio]')

        let disable = () => {}
        let allow = () => {}
        scope.control = {
            disable,
            allow,
        }

        this.callback = typeof scope.onchange === 'function'
        ? scope.onchange
        : noop

        Object.defineProperty(scope.control, 'checked', {
            set:(value) => !!value ? this.input.click() : this.unCheck(),
            get:() => this.input.checked
        })

        scope.$on('destory', () => this.scope = null)
    }


    link(scope, $elem, attrs, ctrl){
        this.input.value = this.rootDOM::props('value')
        this.mode = (ctrl && ctrl.mode) || SEPARATED
        this.scope = scope
        this.input::on('click', ::this.handle)
        if(this.mode === GROUP && typeof ctrl.callback === 'function'){
            //如果radio被group元素包裹，并且父元素中声明了onchange函数则忽略radio元素上的onchange函数
            this.callback = ctrl.callback
        }

        if(this.rootDOM::props('checked')){
            scope.control.checked = true
            this.rootDOM.removeAttribute('checked')
        }
    }

    check(){
        this.radioElem::addClass('fm-radio-checked')
    }

    unCheck(){
        this.radioElem::removeClass('fm-radio-checked')
        //change the state of native radio component manually.
        this.input.checked = false
    }

    handle(e){
        e.stopPropagation()

        this.check()
        this.callback(this.input.value)
        if(this.mode === GROUP){
            this.scope.$emit('radio::selected', this.input)
        } /*else if(this.scope.name) {
            this.scope.$root.$broadcast(`radio::${this.scope.name}::selected`, this.input)
        }*/
    }
}


export class RadioGroup{
    constructor(){
        this.scope = {
            onchange:'=?',
            control:'=?'
        }
        this.restrict = 'EA'
        this.replace = true
        this.transclude = true
        this.template = radioGroup
    }

    compile($tElement, tAttrs, transclude){
        this.group = $tElement[0]
        return this.link
    }

    @dependencies('$scope')
    controller(scope){
        let handle = (e, target) => {
            let radioItems = Array.from(this.group::queryAll('input[type=radio]'))
            radioItems.forEach(i => {
                if(target !== i){
                    i.parentNode::removeClass('fm-radio-checked')
                }
            })

            e.stopPropagation()
        }.bind(this)

        scope.$on('radio::selected', handle)
        //if(scope.name) scope.$on(`radio::${scope.name}::selected`, handle)
    }

    passing(exports, scope){
        exports.mode = GROUP
    }

    link(scope, $elem, attrs, ctrl){
        let items = Array.from(this.group::queryAll('input[type=radio]'))
        let uid = nextUid()
        items.forEach(i => i.setAttribute('name', uid))
    }
}
