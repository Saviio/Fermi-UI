import { dependencies } from '../../external/dependencies'
import menu from '../template/menu.html'
import subMenu from '../template/subMenu.html'
import menuItem from '../template/menuItem.html'
import { transition } from '../../utils/transition'
import {
    on,
    noop,
    query,
    queue,
    prepend,
    queryAll,
    addClass,
    setStyle,
    onMotionEnd,
    getDOMState,
    removeClass,
    replaceClass
 } from '../../utils'

const CASCADING = 0

let peekMenuEnv = ctrls => {
    for(let i = ctrls.length - 1; i >= 0 && ctrls.length; i--){
        if(ctrls[i] !== null){
            return ctrls[i]
        }
    }
    return null
}

//@mode
//@title
//@disabled

export class Menu{
    constructor(){
        this.restrict = 'EA'
        this.scope = {
            mode:'@'
        }
        this.replace = true
        this.transclude = true
        this.template = menu
    }


    @dependencies('$scope')
    controller(scope){
        scope.cascading = []
        scope.mode = (scope.mode && scope.mode.match(/v|h/ig)[0] || 'V').toUpperCase()
    }

    passing(exports, scope){
        exports.add = item => scope.cascading.push(item)
    }

    link(scope, $elem, attrs, ctrl){
        let rootDOM = $elem[0]
        let childrenItem = rootDOM::queryAll('.fm-menu-item')
        scope.$on('menuItem::selected', (event, domRef) => {
            [].forEach.call(childrenItem, item => item::removeClass('fm-menu-item-selected'))
            domRef::addClass('fm-menu-item-selected')
            event.stopPropagation()
        })

        //if(){
            scope.cascading.forEach(e => {
                e.init(CASCADING + (scope.mode === 'V' ? 24 : 0), scope.mode)
                //if(e.type === 'submenu') e.bind()
            })
        //}

    }
}

//@cascading
export class SubMenu{
    constructor(){
        this.restrict = 'EA'
        this.scope = {
            title:'@'
        }
        this.replace = true
        this.transclude = true
        this.template = subMenu
        this.require = ['?^^fermiMenu','?^^fermiSubmenu']
    }

    compile($tElement, tAttrs, transclude){
        this.isCascading = $tElement::getDOMState('cascading') || true
        this.actived = $tElement::getDOMState('actived') || false
        return this.link
    }

    @dependencies('$scope','$sce')
    controller(scope, $sce){
        scope.cascading = []
        this.title = scope.title
    }

    passing(exports, scope){
        exports.add = item => scope.cascading.push(item)
    }

    link(scope, $elem, attrs, parentCtrl){
        let rootDOM = $elem[0]
        let titleDOM = rootDOM::query('.fm-submenu-title')
        let children = rootDOM::query('.fm-submenu-items')

        if(this.title === undefined || this.title === ""){
            titleDOM::addClass('hide')
        } else {
            titleDOM.innerHTML += this.title
        }

        let parent = peekMenuEnv(parentCtrl)
        let eventsBinding = mode => {
            if(mode === 'V'){
                let subMenuTrans = new transition(rootDOM, 'fm-submenu-vertical', this.actived)
                /*
                let switchState = e => {
                    this.actived
                    ? rootDOM::addClass(`fm-submenu-actived`)
                    : rootDOM::removeClass(`fm-submenu-actived`)

                    this.actived = !this.actived
                }
                switchState()*/
                titleDOM::on('click', e => subMenuTrans.state = !subMenuTrans.state)
            } else if(mode === 'H'){
                let items = rootDOM::query('.fm-submenu-items')
                let subMenuTrans = new transition(items, 'fm-submenu-pop')

                titleDOM::on('mouseenter', e => subMenuTrans.state = true)
                rootDOM::on('mouseleave', e => subMenuTrans.state = false)
            }
        }

        if(parent !== null && parent !== undefined){
            parent.add({
                type:'submenu',
                init:(offset, mode) => {
                    if(mode === 'H'){
                        offset = 0
                    } else if(mode === 'V'){
                        $elem[0]::query('.fm-submenu-title')::setStyle({
                            'padding-left': offset + 'px'
                        })
                        offset += this.isCascading ? 24 : 0
                    }

                    if(this.title !== undefined && this.title !== "") {
                        eventsBinding(mode)
                    }

                    scope.cascading.forEach(e => e.init(offset, mode))
                }
            })
        } else {
            throw new Error("A separated submenu does not supported for now.")
            /*
            rootDOM::addClass('fm-submenu-separated')
            //when a submenu was inserted to DOMtree separately, the mode of menu will be "H" by default.
            scope.cascading.forEach(e => e.init(CASCADING, 'H'))
            eventsBinding('H')
            //remark
            */
        }
    }
}

export class MenuItem{
    constructor(){
        this.restrict = 'EA'
        this.scope = {}
        this.replace = true
        this.transclude = true
        this.template = menuItem
        this.require = ['?^^fermiMenu','?^^fermiSubmenu']
    }


    link(scope, $elem, attrs, parentCtrl){
        let rootDOM = $elem[0]
        let parent = peekMenuEnv(parentCtrl)
        let parentMode

        parent.add({
            type:'item',
            init: (offset, mode) => {
                parentMode = mode
                if(mode === 'H') return
                $elem[0]::setStyle({
                    'padding-left':offset + 'px'
                })
            }
        })

        rootDOM::on('click', () => {
            let isDisabled = rootDOM::getDOMState('disabled')
            if(isDisabled || parentMode === 'H') return
            scope.$emit('menuItem::selected', rootDOM)
        })
    }
}
