import { props } from '../../utils'
import template from '../template/template.html'


export default class Switch {
    constructor(){
        this.restrict = 'EA'
        this.replace = true
        this.scope = {
            value:'=',
            label:'@'
        }
        this.transclude = true
        this.template = template
    }

    link(scope, $elem, attr, ctrl){
        let defaultValue = $elem::props('default')
        scope.value = defaultValue
        $elem.children()
            .find('span')
            .bind('click',() => {
                scope.value = !scope.value
            })
    }
}
