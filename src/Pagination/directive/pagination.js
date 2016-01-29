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
            let i,j
            for(i = 1; i <= 3 && scope.items[scope.current - i - 1] !== undefined ; i++){
                arr.unshift(scope.items[scope.current - i - 1])
            }

            for(j = 1; j <= 3 && scope.items[scope.current + j - 1] !== undefined ; j++){
                arr.push(scope.items[scope.current + j - 1])
            }

            /*if(i <= 3){
                while(i !== 3 && scope.items[scope.current + 3 + i - 1] !== undefined){
                    arr.push(scope.items[scope.current + 3 + i - 1])
                    i++
                }
            } else if(j <= 3){
                while(j !== 0 && scope.items[scope.current - 3 - j - 1] !== undefined){
                    arr.push(scope.items[scope.current - 3 - j - 1])
                    j--
                }
            }*/


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
