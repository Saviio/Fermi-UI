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

    controller(){
        
    }

    link(scope,elem,attrs,ctrl){
        let size=attrs.size || 'default'
    }
}
