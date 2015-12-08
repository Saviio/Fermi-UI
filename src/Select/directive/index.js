import select from '../template/select.html'
import option from '../template/option.html'
import {
    getDOMState,
    debounce,
    onMotionEnd,
    on,
    addClass,
    removeClass,
    replaceClass,
    prepend,
    replace,
    remove,
    query,
    queryAll,
    extend
} from '../../utils'


//multi
//disable
//span + span + ul + li + span
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

    controller(scope){}

    compile($tElement, tAttrs, transclude){
        let elem = $tElement[0]
        let isSearch = $tElement::getDOMState('search')
        let isMulti = $tElement::getDOMState('multi')
        let isTags = $tElement::getDOMState('tags')

        this.select = elem::query('.select-inner')
        this.dropdown = elem::query('.select-dropdown')
        this.icon = elem::query('.select-icon')


        if(!(isMulti || isTags) && isSearch){
            let searchTmpl = '<div><input placeholder="输入"/></div>'
            this.searchInput = this.dropdown
                                    ::prepend(searchTmpl)
                                    ::query('input')
        }

        if(isMulti || isTags){
            this.mode = "tags"
            let tagsTmpl = `<span><ul><li ng-repeat="item in selection"></li></ul></span>`
            let selection = this.select::query('.select-selection')
            selection::replace(tagsTmpl)
            this.icon = this.icon::remove()
        }

        return this.link
    }

    link(scope, $elem, attrs, ctrl){
        if(this.searchInput){
            let fn = debounce(() => {
                let options = this.dropdown::queryAll('span')
                let val = this.searchInput.value

                let cb1 = e => {
                    new RegExp(val,"ig").test(e.innerText)
                    ? e.parentElement::removeClass('hide')
                    : e.parentElement::addClass('hide')
                }

                let cb2 = e => e.parentElement::removeClass('hide')
                options::[].forEach(val ? cb1 : cb2)
            })
            this.searchInput::on('input', fn)
        }

        let expanded = false
        scope.switchDropdownState = () => {
            expanded = !expanded
            if(expanded){
                this.icon && this.icon::addClass('expanded')
                this.dropdown::replaceClass('select-dropdown-hidden', 'select-dropdown-fadeIn')
            } else {
                this.icon && this.icon::removeClass('expanded')
                this.dropdown
                    ::replaceClass('select-dropdown-fadeIn', 'select-dropdown-fadeOut')
                    ::onMotionEnd(() =>
                        this.dropdown::replaceClass('select-dropdown-fadeOut', 'select-dropdown-hidden'))
            }
        }

        this.select::on('click', scope.switchDropdownState)
        //scope::extend(this)
    }

    passing(exports, scope){
        exports.select = item => {
            scope.$apply(() => {
                scope.ngModel = item
                scope.switchDropdownState()
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

    link(scope, $elem, attrs, parentCtrl){
        if(typeof attrs.value === "string" && scope.value === undefined){
            scope.value = attrs.value
        }

        $elem.bind('click', () => {
            parentCtrl.select(scope.value)
        })
    }
}
