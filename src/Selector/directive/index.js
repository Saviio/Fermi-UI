import select from '../template/select.html'
import option from '../template/option.html'

//normal
//search
//multi
//disable
//span + span + ul + li + span
//select overflow ...
//select option group
//single option disable

export class Select {
    constructor(utils){
        this.restrict='EA'
        this.replace=true
        this.template=select
        this.require="^ngModel"
        this.scope={
            ngModel:'='
        }
        this.transclude=true
        this.utils=utils
        this.controller.$inject=['$scope','$timeout']
    }

    controller($scope,$timeout){
        /*let test=()=>{
            console.log($scope.ngModel)
            $timeout(()=>test(),1000)
        }
        test()*/
    }

    link(scope,elem,attrs,ctrl){
        let {prefix,eventPrefix}=this.utils.prefix()
        let icon = angular.element(elem.children().children()[1])
        let select = angular.element(elem.children()[0])
        let dropdown = angular.element(elem.children()[1])
        let expanded = false

        let hide = () => {
            if(!expanded) dropdown.addClass('select-dropdown-hidden')

            setTimeout(() => {
                dropdown.unbind(eventPrefix+'TransitionEnd',hide)
                dropdown.unbind('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd',hide)
            },0)
        }

        scope.switchDropdownState = () => {
            if(expanded){
                icon.removeClass('expanded')
                dropdown.removeClass('select-dropdown-fadeIn').addClass('select-dropdown-fadeOut')
            } else {
                dropdown.removeClass('select-dropdown-hidden')
                icon.addClass('expanded')
                dropdown.removeClass('select-dropdown-fadeOut').addClass('select-dropdown-fadeIn')
            }
            expanded = !expanded
            dropdown.bind(eventPrefix+'TransitionEnd',hide) //尝试给这部分代码建立一个函数抽象
            dropdown.bind(eventPrefix+'animationend webkitAnimationEnd',hide)
        }

        select.bind('click',scope.switchDropdownState)
    }

    passing(exports, $scope){
        exports.select= function(item){
            $scope.$apply(()=>{
                $scope.ngModel = item
                $scope.switchDropdownState()
            })
        }
    }
}

Select.$inject = ['fermi.Utils']

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
        if(typeof attrs.value === "string" && scope.value === undefined)
            scope.value = attrs.value

        elem.bind('click', ()=>{
            parentCtrl.select(scope.value)
        })
    }
}
