import { dependencies } from '../external/dependencies'

//const reCurlyBrace= /\{\{([^{}]*)\}\}/g

export default class CleanStyleDirective{
    constructor(){
        this.priority = '99'
        this.restrict = 'AC'
        this.scope = false
    }

    link(scope, $elem, attrs){
        let init = false
        scope.$watch(attrs.cleanStyle, (newValue, oldValue) => {
            if(oldValue && newValue !== oldValue){
                $elem.attr('style', newValue)
            }

            if(!init) {
                $elem.attr('style', newValue)
                init = true
            }
        }, true)

        $elem.removeAttr('clean-style')
    }
}
