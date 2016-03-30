import template from './template/markup.html'

class markup{
    constructor(){
        this.scope = {}
        this.restrict = 'EA'
        this.transclude = true
        this.require = '^componentbox'
        this.template = template
        this.replace = true
    }
}

export default angular.module('componentbox-markup',[
        'HighlightGrammer'
    ])
    .directive('markup', () => new markup())
