import template from './template/demo.html'

class demo{
    constructor(){
        this.scope = {}
        this.restrict = 'EA'
        this.transclude = true
        this.require = '^componentbox'
        this.template = template
        this.replace = true
    }
}

export default angular.module('componentbox-demo',[])
    .directive('demo', () => new demo())
