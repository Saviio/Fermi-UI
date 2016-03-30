import template from './template/es.html'

class es{
    constructor(){
        this.scope = {}
        this.restrict = 'EA'
        this.transclude = true
        this.require = '^codegroup'
        this.template = template
        this.replace = true
    }
}

export default angular.module('componentbox-es', [])
    .directive('es', () => new es())
