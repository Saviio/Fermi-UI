import { dependencies } from '../../external/dependencies'
import template from '../template/template.html'
import { getDOMState } from '../../utils'

//size
//onChange
//items
export default class Pagination {
    constructor(){
        this.restrict = 'EA'
        this.replace = true
        this.scope = {
            onChange:'=?',
            size:'=?',
            current:'=?'
        }
        this.template = template
    }

    @dependencies('$scope')
    controller(scope){
        scope.current = scope.current || 1
        scope.last = () => scope.items[scope.items.length - 1]
        scope.next = () => scope.current++
        scope.prev = () => scope.current--
        scope.choose = item => {
            scope.current = item
            typeof scope.onChange === 'function' && scope.onChange(item)
        }

        scope.range = () => {
            let arr = [scope.current]
            let len = scope.items.length
            let pivot = Math.round(scope.items.length / 2)
            let i,j,f
            let num = 6

            if(scope.current > pivot) f = true

            let n = f ? -1 : 1
            for(i = 1; num >= 3 && scope.items[scope.current - n - 1] !== undefined ; i++, num--, n = f ? -i : i){
                f
                ? arr.push(scope.items[scope.current - n - 1])
                : arr.unshift(scope.items[scope.current - n - 1])
            }

            let m = f ? -1 : 1
            for(j = 1; j !== num && scope.items[scope.current + m - 1] !== undefined ; j++, m = f ? -j : j){
                f
                ? arr.unshift(scope.items[scope.current + m - 1])
                : arr.push(scope.items[scope.current + m - 1])
            }

            return arr
        }
    }

    link(scope, $elem, attrs, ctrl){
        let elem = $elem[0]
        let hasJumper = elem::getDOMState('jumper')
        let mock = [1,2,3,4,5,6,7,8,9,10,11]
        scope.items = mock
        window.iii=scope.items
        window.ccc = scope.range
    }
}
