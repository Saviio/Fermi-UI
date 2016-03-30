import { dependencies } from '../external/dependencies'
import template from './template/codegroup.html'

class codeGroup{
    constructor(){
        this.scope = {}
        this.restrict = 'EA'
        this.transclude = true
        this.require = '^componentbox'
        this.template = template
        this.replace = true
    }

    @dependencies('$scope', '$element')
    controller(scope, $elem){
        let actived = false
        scope.toggle = () => {
            actived = !actived
            let method = actived ? 'addClass' : 'removeClass'
            $elem[method]('codegroup-on')
        }
    }
}

export default angular.module('componentbox-codegroup',[
        'HighlightGrammer'
    ])
    .directive('codegroup', () => new codeGroup())
