import { dependencies } from '../external/dependencies'

export default class FermiDisableDirective{
    constructor(){
        this.restrict = 'A'
        this.priority = 9000
        this.scope = false
    }

    @dependencies('$element', '$attrs')
    controller($elem, $attrs){
        if($attrs.disabled === ""){
            $elem[0].setAttribute('disabled', true)
        }
    }
}

export default class FermiCheckedDirective{
    constructor(){
        this.restrict = 'A'
        this.priority = 9000
        this.scope = false
    }

    @dependencies('$element', '$attrs')
    controller($elem, $attrs){
        if($attrs.checked === ""){
            $elem[0].setAttribute('checked', true)
        }
    }
}
