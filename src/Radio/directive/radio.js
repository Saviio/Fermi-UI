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
    addClass,
    queryAll,
    removeClass,
    generateUID
} from '../../utils'


const SEPARATED = 1
const GROUP = 2

//disable
//default
//onchange
//value


export class Radio{
    constructor(){
        this.restrict = 'EA'
        this.replace = true
        this.scope = {
            onchange:'=?',
            label:'@',
            control:'=?',
            name:'@'
        }
        this.template = template
        this.require = '?^^fermiRadiogroup'
    }


    @dependencies('$scope')
    controller(scope){
        let disable = () => {}
        let allow = () => {}

        scope.control = {
            disable,
            allow,
        }


        this.callback = typeof scope.onchange === 'function'
        ? scope.onchange
        : noop
    }


    link(scope, $elem, attrs, ctrl){
        this.rootDOM = $elem[0]
        this.radioElem = this.rootDOM::query('.fm-radio')
        this.input = this.rootDOM::query('[type=radio]')
        this.input.value = this.rootDOM::props('value')
        this.input::on('click', ::this.handle(scope))
        this.mode = (ctrl && ctrl.mode) || SEPARATED
    }

    choose(){
        this.radioElem::addClass('fm-radio-checked')
    }

    handle(scope){
        return e => {
            //debugger
            this.choose()
            this.callback(this.input.value)
            if(this.mode === GROUP){
                scope.$emit('radio::selected', this.input)
            }

        }.bind(this)
    }
}


export class RadioGroup{
    constructor(){
        this.scope = {
            onchange:'=?',
            label:'@',
            control:'=?',
            name:'@'
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
        scope.$on('radio::selected', (e, target) => {
            let radioItems = [].slice.call(this.group::queryAll('input[type=radio]'), 0)
            radioItems.forEach(i => {
                if(target !== i){
                    i.parentNode::removeClass('fm-radio-checked')
                }
            })

            e.stopPropagation()
        })
    }

    passing(exports, scope){
        exports.mode = GROUP
    }

    link(){
        let items = Array.prototype.slice.call(this.group::queryAll('input[type=radio]'), 0)
        let name = scope.name || generateUID()
        items.forEach(i =>
            setTimeout(() => i.setAttribute('name', name), 0))
    }
}
