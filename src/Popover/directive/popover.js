
import template from '../template/template.html'

export default class Popover{
    constructor(utils){
        this.restrict='EA'
        this.replace=true
        this.scope={
            placement:'@',
            content:'@',
            offset:'@',
            title:'@'
        }
        this.transclude=true
        this.template=template
        this.utils=utils
    }

    controller(){

    }

    link(){

    }
}

Popover.$inject=["fermi.Utils"]
