import { dependencies } from '../../external/dependencies'
import template from '../template/template.html'
import subMenu from '../template/subMenu.html'
import menuItem from '../template/menuItem.html'


const cascading = 0

//@mode
//@title
//@disabled


export class Menu{
    constructor(){
        this.restrict = 'EA'
        this.scope = {}
        this.replace = true
        this.transclude = true
        this.template = template
    }

    /*@dependencies('$scope')
    controller(){}*/

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
    controller(scope){}

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

        let delay = (parentCtrl.length && parentCtrl.filter(e => e !== null)).length || 1
        //setTimeout(function(){
            scope.cascading = delay * 24
        //}, delay * 2)
        console.log('SubMenu:'+delay)

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


    link(scope, $elem, attrs, parentCtrl){
        let parent
        for(let i = parentCtrl.length - 1; i >= 0 && parentCtrl.length; i--){
            if(parentCtrl[i] !== null){
                parent = parentCtrl[i]
                break
            }
        }
        let delay = (parentCtrl.length && parentCtrl.filter(e => e !== null)).length || 1
        //setTimeout(() => {
            scope.cascading = delay * 24
        //}, delay * 4)
        debugger
        console.log('MenuItem:'+delay)
    }
}
