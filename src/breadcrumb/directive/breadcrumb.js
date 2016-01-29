import template from '../template/template.html'

export class breadcrumb{
    constructor(){
        this.restrict = 'EA'
        this.replace = true
        this.scope = {
            items:'='
        }
        this.transclude = true
        this.template = template
    }

    passing(exports, scope){
        exports.add = item => scope.items.push(item)
    }
}


export class breadcrumbItem {
    constructor(){
        this.restrict = 'EA'
        this.replace = true
        this.require = '^fermiBreadcrumb'
        this.scope = {
            item:'='
        }
    }

    link(scope, $element, attrs, parentCtrl){
        parentCtrl.add(scope.item)
    }
}
