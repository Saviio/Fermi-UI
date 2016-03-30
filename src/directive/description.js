import template from './template/description.html'

class description{
    constructor(){
        this.scope = {}
        this.restrict = 'EA'
        this.transclude = true
        this.require = '^componentbox'
        this.template = template
        this.replace = true
    }
}

export default angular.module('componentbox-description',[])
    .directive('description', () => new description())
