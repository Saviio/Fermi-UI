import { dependencies } from '../../external/dependencies'
import template from '../template/template.html'


export default class Pagination {
    constructor(){
        this.restrict = 'EA'
        this.replace = true
        this.scope = {
            content:'@',
            control:'='
        }
        this.template = template
    }

    @dependencies('$scope')
    controller(scope){

    }

    link(scope, $elem, attrs, ctrl){

    }
}
