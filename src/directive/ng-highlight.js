import hljs from 'highlight.js'

const re = /\s*([&lt;][^(&gt;)]+[&gt;])\s*/ig
const replaceWhitespaces = str =>
    str.replace(re, ($0, $1) => {console.log($0); return $0})

class highlight{
    constructor(){
        this.scope = false
        this.restrict = 'A'
    }
    link(scope, $elem, attrs){
        let rootDOM = $elem[0]
        let codeBlock = Array.from(rootDOM.querySelectorAll('pre code'))
        codeBlock.forEach(block => {
            block.innerHTML = block.innerHTML.trim()
                .split(/\n/ig)
                .filter(p => !(/^\s*$/.test(p)))
                .map(p => p + '\r\n')
                .join('')
            hljs.highlightBlock(block)
        })
    }
}

export default angular.module('HighlightGrammer',[])
    .directive('ngHighlight', () => new highlight())
