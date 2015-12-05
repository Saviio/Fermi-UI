import template from '../template/template.html'

export default class Switch {
    constructor(){
        this.restrict='EA'
        this.replace=true
        this.require='^ngModel'
        this.scope={
            ngModel:'=',
            label:'@'
        }
        this.transclude=true
        this.template=template
    }

    link(scope,$elem,attr,ctrl){
        $elem.children()
            .find('span')
            .bind('click',()=>
                scope.ngModel = !scope.ngModel)
    }
}
