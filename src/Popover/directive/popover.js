import template from '../template/template.html'
import popoverTmpl from '../template/popover.html'

export default class Popover{
    constructor(utils,$compile){
        this.restrict='EA'
        this.replace=true
        this.scope={
            placement:'@',
            title:'@'
        }
        this.transclude=true
        this.template=template
        this.utils=utils
        this.controller.$inject=['$scope']
        this.$compile=$compile
    }

    controller($scope){

    }

    link(scope,elem,attr,ctrl,transcludeFn){
        var linkedClone = transcludeFn()
        console.log(linkedClone)
        //console.log(elem.children[0].clone())
        //var a=elem.find('div')[0].children

        ctrl.placement=scope.placement || 'top'

        let tmpl=popoverTmpl.replace(/#{dire}/,ctrl.placement)
        //elem.append(tmpl);
        //debugger
        let content=this.$compile(tmpl,transcludeFn)(scope)
        elem.append(content)
        //console.log(content)

        const show = () =>{}
        const hide = () =>{}

        console.log(content)
        //*/
    }
}

Popover.$inject=["fermi.Utils","$compile"]
