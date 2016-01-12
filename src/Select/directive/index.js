import select from '../template/select.html'
import option from '../template/option.html'
import {
    getDOMState,
    getStyle,
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
    queryAll
} from '../../utils'


//multi
//disable

export class Select {
    constructor(){
        this.restrict = 'EA'
        this.replace = true
        this.template = select
        this.require = "^ngModel"
        this.scope = {
            ngModel:'=',
            control:'='
        }
        this.transclude = true
        this.controller.$inject = ['$scope']
    }

    controller(scope){
        scope.selection = []
        scope.remove= (index, e) => {
            let option = scope.selection.splice(index, 1).pop()
            if(option.$elem !== null){
                option.$elem.removeClass('tagged')
            }
            e.stopPropagation()
        }
        scope.control = {
            selected:() => {
                if(scope.ngModel !== undefined) {
                    return {
                        item:scope.ngModel.item,
                        data:scope.ngModel.data
                    }
                } else {
                    let list = []
                    for(var i = 0; i< scope.selection.length; i++){
                        let model = scope.selection[i]
                        list.push({
                            item:model.item,
                            data:model.data
                        })
                    }
                    return list
                }
            }
        }
    }

    compile($tElement, tAttrs, transclude){
        //console.log("compile:"+new Date().getTime())
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
            this.mode = isTags ? 'tags' : 'multi'
            let tagsTmpl =
            `<ul class="tags-selection">
                <li ng-repeat="model in selection track by $index" ng-click="remove($index,$event)">
                    <span>{{model.item}}</span>
                    <span class="tag-remove">×</span>
                </li>
                ${isTags ? '<li class="tag-input"><span contenteditable="true"></span></li>' : ''}
            </ul>`
            let selection = this.select::query('.select-selection')
            this.select::addClass('select-tags')
            selection::replace(tagsTmpl)
            this.icon = this.icon::remove()
            if(isTags){
                this.tagInput = elem::query('.tag-input > span')
            }
        }

        return this.link
    }

    link(scope, $elem, attrs, ctrl){
        if(this.searchInput){
            let fn = debounce(() => {
                let options = this.dropdown::queryAll('span')
                let val = this.searchInput.value

                let cb1 = e => {
                    new RegExp(val, 'ig').test(e.innerText)
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
        if(this.mode === 'tags'){
            this.select::on('click', () => this.tagInput.focus())
            this.tagInput::on('keydown', e => {
                let value = this.tagInput.innerText
                //let wordCount = value.length
                //let ftsize = this.tagInput::getStyle('font-size','px')
                //this.tagInput.style.width = 5 + wordCount * ftsize+'px'
                if(e.keyCode !== 13 || value === '') return
                scope.$apply(() => {
                    scope.selection.push({item:value, data:{value}, $elem:null})
                    this.tagInput.innerText = ''
                })
            })
        }
    }

    passing(exports, scope){
        exports.select = option => {
            scope.$apply(() => {
                if(this.mode === 'multi' || this.mode === 'tags' ){
                    if(scope.selection.every(existOption => existOption !== option)){
                        scope.selection.push(option)
                        option.$elem.addClass('tagged')
                        option.$elem.attr('selected',true)
                    }
                } else if (false){
                    //multi
                } else {
                    scope.ngModel = option
                    scope.switchDropdownState()
                }
            })
        }
    }
}


//@value
//@data
//select option group
//single option disable
export class Option {
    constructor(){
        this.restrict = 'EA'
        this.replace = true
        this.require = '^fermiSelect'
        this.template = option
        this.transclude = true
        this.scope = { value:'=', data:'=' }
    }

    link(scope, $elem, attrs, parentCtrl){
        if(typeof attrs.value === "string" && scope.value === undefined){
            scope.value = attrs.value
        }

        let option = {
            item:scope.value,
            data:scope.data || {value: scope.value},
            $elem:$elem
        }

        $elem.bind('click', () => {
            parentCtrl.select(option)
        })
    }
}
