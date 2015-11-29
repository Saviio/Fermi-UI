import select from '../template/select.html'
import option from '../template/option.html'

//normal
//search
//multi
//disable
//span + span + ul + li + span

function a(){
    this.checking=function(){
        console.log('checking!')
    }
}


export class Select {
    constructor(){
        this.restrict='EA'
        this.replace=true
        this.template=select
        this.require="^ngModel"
        this.scope={
            ngModel:'='
        }
        this.controller.$inject=['$scope','$timeout']
        this.transclude=true
        this.id="demo"
        this.nestedController=true
    }

    controller($scope,$timeout){
        let test=()=>{
            console.log($scope.ngModel)
            $timeout(()=>test(),1000)
        }
        test()
    }

    link(scope,elem,attrs,ctrl){

    }

    passing(exports, $scope){
        exports.select=function(item){
            $scope.ngModel=item
        }
    }
}

//@value
export class Option {
    constructor(){
        this.restrict='EA'
        this.replace=true
        this.require='^fermiSelect'
        this.template=option
        this.transclude=true
        this.scope={
            value:'='
        }
    }

    link(scope,elem,attrs,parentCtrl){
        /*console.log(scope.$parent)
        console.log(scope)
        console.log(attrs.value)*/
        console.log(parentCtrl,scope)
        //scope.$parent.options.push(elem.contents())
        if(typeof attrs.value === "string" && scope.value === undefined)
            scope.value = attrs.value

        elem.bind('click', ()=>{
            console.log(parentCtrl)
            parentCtrl.select(scope.value)
        })
    }
}
