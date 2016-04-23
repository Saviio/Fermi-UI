import template from './template/markup.html'

class markup{
    constructor(){
        this.scope = {}
        this.restrict = 'EA'
        this.transclude = true
        this.require = '^codegroup'
        this.template = template
        this.replace = true
    }
}

export default angular.module('componentbox-markup', [])
    .directive('markup', () => new markup())
