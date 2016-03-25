import hljs from 'highlight.js'

class highlight{
    constructor(){
        this.scope = false
        this.restrict = 'A'
    }
    link(scope, $elem, attrs){
        let rootDOM = $elem[0]
        let codeBlock = Array.from(rootDOM.querySelectorAll('pre code'))
        codeBlock.forEach(block => hljs.highlightBlock(block))
    }
}

export default angular.module('HighlightGrammer',[])
    .directive('ngHighlight', () => new highlight())
