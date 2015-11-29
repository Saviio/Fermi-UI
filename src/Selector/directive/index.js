import select from '../template/select.html'
import option from '../template/option.html'

//search
//multi
//span + span + ul + li + span
export class Select {
    constructor(){
        this.restrict='EA'
        this.replace=true
        this.template=select
    }

    controller(){

    }

    link(scope,elem,attrs,ctrl){

    }
}

export class Option {
    constructor(){
        this.restrict='EA'
        this.replace=true
        this.require='^fermiSelect'
        this.template=options
    }

    link(scope,elem,attrs,ctrl){

    }
}
