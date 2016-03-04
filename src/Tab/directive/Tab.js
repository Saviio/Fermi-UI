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
            Array.from(this.rootDOM::queryAll('.tab-panel')).forEach((e, i) => {
                setTimeout(() => index === i ? e::removeClass('show') : e::addClass('show'), 0)
                scope.items[i].actived = (index === i)
                if(!/\$apply|\$digest/.test(scope.$root.$$phase)) scope.$digest()
            })
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
    }

    passing(exports, scope){
        exports.addItem = item => {
            let index = scope.items.push(item)
            if(item.actived) scope.onSelect(index - 1)
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
        let item = {
            display : attrs.header,
            disabled: $element::props('disabled'),
            actived : $element::props('actived')
        }

        parentCtrl.addItem(item)
    }
}
