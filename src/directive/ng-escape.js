const re = /(fermi)\:(\w*[^\s])/ig
const re2 = /\>(\B)\</
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)
const transform = html =>
    html.replace(re, ($0, $1, $2) =>
        `${capitalize($1)}:${capitalize($2)}`)
const escapeFn = str =>
    str.replace(/&/g,"&amp;")
                  .replace(/</g,"&lt;")
                  .replace(/>/g,"&gt;")
                  .replace(/"/g,"&#34;")
                  .replace(/'/g,"&#39;")


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
        let outerHTML = domRef.outerHTML
        let innerHTML = domRef.innerHTML

        let escapedHTML = escapeFn(transform(outerHTML))
        $elem.replaceWith(escapedHTML)
        if(innerHTML !== ""){
            escapedHTML = escapedHTML.replace(re2, ($0, $1) => innerHTML)
        }
    }
}


export default angular.module('EscapeHTML', [])
    .directive('ngEscape', () => new escapeHTML())
