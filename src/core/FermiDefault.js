import { dependencies } from '../external/dependencies'


export default class FermiDefaultDirective{
    constructor(){
        this.restrict='A'
        this.require='^ngModel'
        //this.controller.$inject=['$scope','$attrs', '$parse']
    }

    @dependencies('$scope', '$attrs', '$parse')
    controller($scope, $attrs, $parse){

        var idf=$attrs.ngModel
        var val = $scope[idf]
        if(val == undefined){
            val = $attrs.fermiDefault
            if(val === undefined)
                val = $attrs.value
            if(val !== undefined)
                $parse($attrs.ngModel).assign($scope,JSON.parse(val))
        }
    }
}
