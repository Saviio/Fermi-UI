import { dependencies } from '../external/dependencies'

export class disabled{
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

export class checked{
    constructor(){
        this.restrict = 'A'
        this.priority = 9000
        this.scope = false
    }

    @dependencies('$element', '$attrs')
    controller($elem, $attrs){
        if($attrs.checked === ""){
            $elem[0].setAttribute('checked', true)
        } else if(/false/i.test($attrs.checked)){
            $elem[0].removeAttribute('checked')
        }
    }
}
