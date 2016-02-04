import { dependencies } from '../../external/dependencies'
import template from '../template/template.html'
import subMenu from '../template/subMenu.html'
import menuItem from '../template/menuItem.html'


const cascading = 0

//@mode
//@title
//@disabled

const nesting = scope => {
    let index = 0
    while(scope.$$cascading !== 'Menu'){
        if(scope.$$cascading === 'SubMenu' || scope.$$cascading === 'MenuItem') index ++
        scope = scope.$parent
    }
    return index
}

export class Menu{
    constructor(){
        this.restrict = 'EA'
        this.scope = {}
        this.replace = true
        this.transclude = true
        this.template = template
    }

    @dependencies('$scope')
    controller(scope){
        scope.$$cascading = 'Menu'
    }

    passing(exports, scope){
        exports.cascading = () => cascading
    }
}


export class SubMenu{
    constructor(){
        this.restrict = 'EA'
        this.scope = {}
        this.replace = true
        this.transclude = true
        this.template = subMenu
        this.require = ['?^^fermiMenu','?^^fermiSubmenu']
    }

    @dependencies('$scope')
    controller(scope){
        scope.$$cascading = 'SubMenu'
    }

    passing(exports, scope){
        exports.cascading = () => scope.cascading
    }

    link(scope, $elem, attrs, parentCtrl){
        let parent
        for(let i = parentCtrl.length - 1; i >= 0 && parentCtrl.length; i--){
            if(parentCtrl[i] !== null){
                parent = parentCtrl[i]
                break
            }
        }

        //let delay = (parentCtrl.length && parentCtrl.filter(e => e !== null)).length || 1
        //setTimeout(function(){
        let cascading = nesting(scope)
            scope.cascading = cascading * 24
        //}, delay * 2)


        console.log(scope.cascading)
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
    controller(scope){
        scope.$$cascading = 'MenuItem'
    }


    link(scope, $elem, attrs, parentCtrl){
        let parent
        for(let i = parentCtrl.length - 1; i >= 0 && parentCtrl.length; i--){
            if(parentCtrl[i] !== null){
                parent = parentCtrl[i]
                break
            }
        }

        let cascading = nesting(scope)
        //setTimeout(() => {
            scope.cascading = cascading * 24
        //}, delay * 4)


    }
}
