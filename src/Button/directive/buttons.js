import template from '../template/template.html'

export default class Buttons {
    constructor(){
        this.restrict='EA'
        this.replace=true
        this.scope={
            content:'@'
        }
        this.transclude=true
        this.template=template
    }

    link(scope,elem,attr,ctrl){

    }
}
