import {
    escape,
    transform,
    capitalize,
    removeClass,
    reChildElem,
} from '../utils'


const specialAttribute = [
    'close',
    'multi',
    'search',
    'jumper',
    'default',
    'loading',
    'actived',
    'checked',
    'disabled',
    'progress',
    'cascading',
    'selected',
    'tags'
]

class escapeHTML{
    constructor(){
        this.restrict = 'A'
        this.scope = false
        this.priority = 10000
        this.terminal = true
    }

    link(scope, $elem, attrs){
        let domRef = $elem[0]
        domRef.removeAttribute('ng-escape')
        removeClass(domRef, 'ng-scope')

        let outerHTML = domRef.outerHTML
        let innerHTML = domRef.innerHTML

        for(let i of specialAttribute){
            let reAttr = new RegExp(`${i}=""|${i}="true"`, 'ig')
            outerHTML = outerHTML.replace(reAttr, () => i)
        }

        let escapedHTML = escape(transform(outerHTML))
        if(innerHTML !== ""){
            escapedHTML = escapedHTML.replace(reChildElem, ($0, $1) => innerHTML)
        }
        $elem.replaceWith(escapedHTML)
    }
}


export default angular.module('EscapeHTML', [])
    .directive('ngEscape', () => new escapeHTML())
