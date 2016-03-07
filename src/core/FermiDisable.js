import { dependencies } from '../external/dependencies'

//const reBool = /true|false/i
export default class FermiDisableDirective{
    constructor(){
        this.restrict = 'A'
        this.priority = 9000
        this.scope = false
    }
    /*
    compile($tElement, tAttrs, transclude){
        if(tAttrs.header = "Disabled"){debugger}
        let disableLabel
        if($tElement instanceof angular.element){
            disableLabel = $tElement.attr('disable')
            if(reBool.test(disableLabel)){
                $tElement.attr('disabled', Boolean(disableLabel.toLowerCase()).toString())
            }
        } else {
            disableLabel = $tElement.getAttribute('disable')
            if(reBool.test(disableLabel)){
                $tElement.setAttribute('disabled', Boolean(disableLabel.toLowerCase()).toString())
            }
        }
    }*/
    /*
    compile($elem, $attrs){
        return {
            pre:() => {
                if($attrs.disabled === ""){
                    $elem[0].setAttribute('disabled', true)
                }
            }
        }
    }*/

    @dependencies('$element', '$attrs')
    controller($elem, $attrs){
        if($attrs.disabled === ""){
            $elem[0].setAttribute('disabled', true)
        }
    }

    /*
    link(scope, $elem, $attrs){
        if($attrs.fermiDisable !== undefined){
            let disabledVal = ($attrs.fermiDisable === '' ? true : $attrs.fermiDisable).toString()
            $elem[0].setAttribute('disabled', Boolean(disabledVal.toLowerCase()).toString())
        }
    }*/
    /*
    link(scope, $elem, $attrs){
        if($attrs.disabled !== undefined){
            let disabledVal = ($attrs.disabled === '' ? true : $attrs.disabled).toString()
            $elem.attr('disabled', Boolean(disabledVal.toLowerCase()).toString())
        }
    }
    */
}
