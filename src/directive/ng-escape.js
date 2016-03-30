const re = /(fermi)\:(\w*[^\s])/ig
const re2 = /\>(\B)\</
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)
const transform = html =>
    html.replace(re, ($0, $1, $2) =>
        `${capitalize($1)}:${capitalize($2)}`)
const escapeFn = str =>
    str .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&#34;")
        .replace(/'/g,"&#39;")

const removeClass = (el, cls) => {
    let clsList = cls.split(' ')
    while(cls = clsList.pop()){
        if (el.classList) {
            el.classList.remove(cls)
        } else {
            let cur = ' ' + (el.getAttribute('class') || '') + ' '
            let tar = ' ' + cls + ' '
            while (cur.indexOf(tar) >= 0) {
                cur = cur.replace(tar, ' ')
            }

            el.setAttribute('class', cur.trim())
        }

        if (!el.className) {
            el.removeAttribute('class')
        }
    }
    return el
}

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
    'cascading'
]

class escapeHTML{
    constructor(){
        this.restrict = 'A'
        this.scope = false
        this.priority = 9000
        this.terminal = true
    }

    link(scope, $elem, attrs){
        let domRef = $elem[0]
        domRef.removeAttribute('ng-escape')
        removeClass(domRef, 'ng-scope')

        let outerHTML = domRef.outerHTML
        let innerHTML = domRef.innerHTML

        for(let i of specialAttribute){
            let reAttr = new RegExp(`${i}=""\\s?`, 'ig')
            outerHTML = outerHTML.replace(reAttr, () => i)
        }

        let escapedHTML = escapeFn(transform(outerHTML))
        if(innerHTML !== ""){
            escapedHTML = escapedHTML.replace(re2, ($0, $1) => innerHTML)
        }
        $elem.replaceWith(escapedHTML)
    }
}


export default angular.module('EscapeHTML', [])
    .directive('ngEscape', () => new escapeHTML())
