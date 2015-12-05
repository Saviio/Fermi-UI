import select from '../template/select.html'
import option from '../template/option.html'
import {
    getDOMState,
    debounce,
    onMotionEnd,
    on,
    addClass,
    removeClass
} from '../../utils'


//normal
//search
//multi
//disable
//span + span + ul + li + span
//select overflow ...
//select option group
//single option disable

export class Select {
    constructor(){
        this.restrict = 'EA'
        this.replace = true
        this.template = select
        this.require = "^ngModel"
        this.scope = {
            ngModel:'='
        }
        this.transclude = true
        this.controller.$inject = ['$scope']
    }

    controller($scope){}

    link(scope,elem,attrs,ctrl){
        let children = elem.children()
        let select = children[0]
        let icon = children.children()[1]
        let dropdown = angular.element(children[1])
        let expanded = false
        let withSearch = null


        scope.withSearch = withSearch = elem::getDOMState('search')

        if(withSearch){
            let tmpl = `<div><input placeholder="输入"/></div>`
            let searchInput = dropdown.prepend(tmpl).find('input')
            let func = debounce(() => {
                let options = dropdown.find('span')
                let val = searchInput.val()

                let cb1 = e => {
                    new RegExp(val,"ig").test(e.innerText)
                    ? e.parentElement::removeClass('hide')
                    : e.parentElement::addClass('hide')
                }

                let cb2 = e => e.parentElement::removeClass('hide')

                options::[].forEach(val ? cb1 : cb2)
            },200)

            searchInput.bind('input', () => func())
        }


        scope.switchDropdownState = () => {
            expanded = !expanded

            if(expanded){
                icon::addClass('expanded')
                dropdown.removeClass('select-dropdown-hidden')
                        .addClass('select-dropdown-fadeIn')
            } else {
                icon::removeClass('expanded')
                dropdown.removeClass('select-dropdown-fadeIn')
                        .addClass('select-dropdown-fadeOut')
                        ::onMotionEnd(() =>
                            dropdown.addClass('select-dropdown-hidden')
                                    .removeClass('select-dropdown-fadeOut'))
            }
        }

        select::on('click',scope.switchDropdownState)
    }

    passing(exports, $scope){
        exports.select= (item) => {
            $scope.$apply(() => {
                $scope.ngModel = item
                $scope.switchDropdownState()
            })
        }
    }
}



//@value
export class Option {
    constructor(){
        this.restrict = 'EA'
        this.replace = true
        this.require = '^fermiSelect'
        this.template = option
        this.transclude = true
        this.scope = { value:'=' }
    }

    link(scope,elem,attrs,parentCtrl){
        if(typeof attrs.value === "string" && scope.value === undefined)
            scope.value = attrs.value

        elem.bind('click', () => {
            parentCtrl.select(scope.value)
        })
    }
}
