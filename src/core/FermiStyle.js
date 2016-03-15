import { dependencies } from '../external/dependencies'

//const reCurlyBrace= /\{\{([^{}]*)\}\}/g

export default class CleanStyleDirective{
    constructor(){
        this.priority = '99'
        this.restrict = 'AC'
        this.scope = false
    }
    /*
    @dependencies('$attrs', '$parse', '$scope', '$element')
    controller(attrs, parse, scope, $elem){
        //console.log(attrs.cleanStyle)
        //console.log(parse(attrs.cleanStyle))
        let deps = []
        let styles = attrs.cleanStyle.replace(reCurlyBrace, ($0, $1) => {
            deps.push($1)
            return scope[$1]
        })

        $elem.attr('style', styles)

        scope.$watchGroup(deps, (newValues, oldValues, scope) => {
            $elem.attr('style', deps.reduce((tmpl, filed, index) => tmpl.replace(filed, scope[filed]), attrs.cleanStyle))
        })
    }*/

    link(scope, $elem, attrs){
        let init = false
        scope.$watchCollection(attrs.cleanStyle, (newValue, oldValue) => {
            if(oldValue && newValue !== oldValue){
                $elem.attr('style', newValue)
            }

            if(!init) {
                $elem.attr('style', newValue)
                init = true
            }
        })

        $elem.removeAttr('clean-style')
    }
}
