import tabs from '../template/tabs.html'
import tab from '../template/tab.html'
import {getDOMState} from '../../utils'

export class Tabs{
    constructor(){
        this.replace  = true
        this.restrict = 'EA'
        this.template = tabs
        this.controller.$inject = ['$scope']
        this.transclude = true
        this.scope = {}
    }

    controller(scope){
        scope.items = []
        scope.activedItem = null

        scope.switchState = index => {
            if (scope.items[index].disable) return

            scope.$apply(() => {
                scope.activedItem = scope.items[index]
                scope.items.forEach((e,i) => e.actived = (i === index))
            })
        }
    }

    link(scope, elem, attrs, ctrl){
        let ul = elem.find('ul')

        ul.bind('click',(evt)=>{
            let target = evt.target

            if(target.tagName === 'A'){
                let node = angular.element(evt.target)
                let index = ~~node.attr('data-index')
                scope.switchState(index)
            }
        })

        let activedItem = scope.items.filter(e => e.actived)

        if(scope.items.length > 0 && activedItem.length === 0){
            scope.items[0].actived = true
        } else {
            for(let i = 0; i< activedItem.length-1; i++){
                activedItem[i].active = false
            }
        }
    }

    passing(exports, scope){
        exports.addItem = (item) => scope.items.push(item)
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


    link(scope,$element,attrs,parentCtrl){
        let header  = attrs.header
        let disable = $element::getDOMState('disable')
        let actived = $element::getDOMState('actived')

        let contentState = null

        let item = {
            display:null,
            disable:false
        }

        Object.defineProperty(item,'actived',{
            get:() => contentState,
            set:(newValue) => {
                if(contentState === newValue) return
                newValue ? $element.removeClass('hide').addClass('show') : $element.removeClass('show').addClass('hide')
                contentState = newValue
            },
            enumerable: true,
            configurable: false
        })

        item.actived = actived
        item.display = header
        item.disable = disable

        parentCtrl.addItem(item)
    }
}
