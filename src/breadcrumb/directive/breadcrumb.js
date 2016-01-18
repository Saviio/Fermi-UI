import template from '../template/template.html'

export default class {
    constructor(){
        this.restrict = 'EA'
        this.replace = true
        this.scope = {
            items:'='
        }
        this.transclude = true
        this.template = template
    }
}
