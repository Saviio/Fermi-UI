import { dependencies } from '../../external/dependencies'
import template from '../template/template.html'
import {
    range,
    query,
    addClass,
    removeClass,
    getDOMState
} from '../../utils'

//jumper
export default class Pagination {
    constructor(){
        this.restrict = 'EA'
        this.replace = true
        this.scope = {
            onchange:'=?',
            size:'=?',
            current:'=?'
        }
        this.template = template
    }

    compile($tElement, tAttrs, transclude){
        let elem = $tElement[0]
        this.prevLabel = elem::query('.fm-pagination-prev')
        this.nextLabal = elem::query('.fm-pagination-next')
        return this.link
    }

    @dependencies('$scope')
    controller(scope){
        scope.pages = []
        scope.items = range(scope.size > 0 ? scope.size : 0, 1)
        scope.current = scope.current || 1
        scope.first = () => scope.items[0]
        scope.last = () => scope.items[scope.items.length - 1]
        scope.next = () => scope.current++ && _renderPages()
        scope.prev = () => scope.current-- && _renderPages()
        scope.choose = (item, exec = true) => {
            if(item === '...') return
            scope.current = item
            _renderPages()
            if(exec) typeof scope.onchange === 'function' && scope.onchange(item)
        }

        let _renderPages = () => {
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
            for(let j = 1; j !== num + 1 && scope.items[scope.current + m - 1] !== undefined; j++, m = f ? -j : j){
                f
                ? arr.unshift(scope.items[scope.current + m - 1])
                : arr.push(scope.items[scope.current + m - 1])
            }

            if(1 !== arr[0]) arr = [1,'...'].concat(arr)
            if(scope.last() !== arr[arr.length - 1]) arr = arr.concat(['...', scope.last()])

            scope.pages = arr

            scope.current === scope.last() ? this.nextLabal::addClass('hide') : this.nextLabal::removeClass('hide')
            scope.current === scope.first() ? this.prevLabel::addClass('hide') : this.prevLabel::removeClass('hide')
        }
    }

    link(scope, $elem, attrs, ctrl){
        let elem = $elem[0]
        let hasJumper = elem::getDOMState('jumper')

        scope.choose(scope.current, false)
    }
}
