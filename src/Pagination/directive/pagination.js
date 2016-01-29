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
        scope.pages = [1,2,3]
        scope.current = scope.current || 1
        scope.last = () => scope.items[scope.items.length - 1]
        scope.next = () => scope.current++ && _updatePages()
        scope.prev = () => scope.current-- && _updatePages()
        scope.choose = item => {
            scope.current = item
            _updatePages()
            typeof scope.onChange === 'function' && scope.onChange(item)
        }

        let _updatePages = () => {
            let arr = [scope.current]
            let len = scope.items.length
            let pivot = Math.round(scope.items.length / 2)
            let num = 6
            let f = false

            if(scope.current > pivot) f = true

            let n = f ? -1 : 1
            for(let i = 1; num > 3 && scope.items[scope.current - n - 1] !== undefined; i++, num--, n = f ? -i : i){
                f
                ? arr.push(scope.items[scope.current - n - 1])
                : arr.unshift(scope.items[scope.current - n - 1])
            }

            let m = f ? -1 : 1
            for(let j = 1; j !== num + 1 && scope.items[scope.current + m - 1] !== undefined ; j++, m = f ? -j : j){
                f
                ? arr.unshift(scope.items[scope.current + m - 1])
                : arr.push(scope.items[scope.current + m - 1])
            }
            scope.pages = arr
        }
    }

    link(scope, $elem, attrs, ctrl){
        let elem = $elem[0]
        let hasJumper = elem::getDOMState('jumper')
        let mock = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]
        scope.items = mock
        scope.choose(scope.current)
        window.iii=scope.items
        window.ccc = scope.range
    }
}
