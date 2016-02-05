import { dependencies } from '../../external/dependencies'
import menu from '../template/menu.html'
import subMenu from '../template/subMenu.html'
import menuItem from '../template/menuItem.html'
import {
    on,
    query,
    prepend,
    addClass,
    setStyle,
    getDOMState,
    removeClass
 } from '../../utils'

const cascading = 0

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
    }

    passing(exports, scope){
        exports.add = item => scope.cascading.push(item)
    }

    link(scope, $elem, attrs, ctrl){
        scope.cascading.forEach(e => e.render(cascading + 24))
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
        let expanded = false
        let rootDOM = $elem[0]
        let titleDOM = rootDOM::query('.fm-submenu-title')
        let children = rootDOM::query('.fm-submenu-items')
        if(this.title === undefined || this.title === ""){
            titleDOM::addClass('hide')
        } else {
            titleDOM.innerHTML = this.title
            titleDOM::on('click', () => {
                !expanded ? children::addClass('fm-submenu-expanded') : children::removeClass('fm-submenu-expanded')
                expanded = !expanded
            })
        }

        let parent
        for(let i = parentCtrl.length - 1; i >= 0 && parentCtrl.length; i--){
            if(parentCtrl[i] !== null){
                parent = parentCtrl[i]
                break
            }
        }

        if(parent !== null && parent !== undefined){
            parent.add({
                type:'submenu',
                render:offset => {
                    $elem[0]::query('.fm-submenu-title')::setStyle({
                        'padding-left': offset + 'px'
                    })

                    scope.cascading.forEach(e =>
                        e.render(offset + (this.isCascading ? 24 : 0)))
                }
            })
        } else {
            scope.cascading.forEach(e => e.render(cascading))
        }
    }
}

//@disabled
export class MenuItem{
    constructor(){
        this.restrict = 'EA'
        this.scope = {}
        this.replace = true
        this.transclude = true
        this.template = menuItem
        this.require = ['?^^fermiMenu','?^^fermiSubmenu']
    }

    @dependencies('$scope')
    controller(scope){}


    link(scope, $elem, attrs, parentCtrl){
        let parent
        for(let i = parentCtrl.length - 1; i >= 0 && parentCtrl.length; i--){
            if(parentCtrl[i] !== null){
                parent = parentCtrl[i]
                break
            }
        }

        parent.add({
            type:'item',
            render: offset =>
                $elem[0]::setStyle({
                    'padding-left':offset + 'px'
                })
        })
    }
}
