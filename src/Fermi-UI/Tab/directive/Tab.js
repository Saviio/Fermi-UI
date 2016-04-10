import { dependencies } from '../../external/dependencies'
import tabs from '../template/tabs.html'
import tab from '../template/tab.html'
import {
    on,
    off,
    props,
    query,
    queryAll,
    addClass,
    removeClass
 } from '../../utils'

export class Tabs{
    constructor(){
        this.replace  = true
        this.restrict = 'EA'
        this.template = tabs
        this.transclude = true
        this.scope = {}
    }

    @dependencies('$scope', '$element')
    controller(scope, $elem){
        this.rootDOM = $elem[0]
        scope.items = []

        scope.onSelect = index => {
            if(scope.items[index].disabled) return
            setTimeout(() => {
                Array.from(this.rootDOM::queryAll('.fm-tab-panel')).forEach((e, i) => {
                     index === i ? e::addClass('show') : e::removeClass('show')
                    scope.items[i].actived = (index === i)
                    if(!/\$apply|\$digest/.test(scope.$root.$$phase)) scope.$digest()
                })
            }, 0)
        }
    }

    link(scope, $elem, attrs, ctrl){
        this.rootDOM = $elem[0]
        let ul = this.rootDOM::query('ul')

        let delegate = evt => {
            let target = evt.target
            if(target.tagName === 'A'){
                let index = ~~(target.getAttribute('data-index'))
                scope.onSelect(index)
            }
        }

        ul::on('click', delegate)

        scope.$on('destory', () =>
            ul::off('click', delegate))

        let init = false
        for(let i = scope.items.length -1; i >= 0 ; i--){
            if(scope.items[i].actived){
                 scope.onSelect(i)
                 init = true
                 break
            }
        }
        if(!init) scope.onSelect(0)
        //debugger


    }

    passing(exports, scope){
        exports.addItem = item => {
            let index = scope.items.push(item)
            //if(item.actived) scope.onSelect(index - 1)
        }
    }
}

export class Tab{
    constructor(){
        this.restrict = 'EA'
        this.require = '^fermiTabs'
        this.replace = true
        this.template = tab
        this.transclude = true
        this.scope = {}
    }


    link(scope, $element, attrs, parentCtrl){
        //debugger
        let item = {
            display : attrs.header,
            disabled: $element::props('disabled'),
            actived : $element::props('actived') || false
        }

        parentCtrl.addItem(item)
    }
}
