import select from '../template/select.html'
import option from '../template/option.html'
import {
    getDOMState,
    getStyle,
    getType,
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


//do not use ngModel
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
        this.controller.$inject = ['$scope', '$attrs']
    }

    controller(scope, attrs){

        if(this.mode === 'multi' || this.mode ==='tags'){
            scope.ngModel = []
        }

        scope.remove = (index, e) => {
            let option = scope.ngModel.splice(index, 1).pop()
            if(option.$elem !== null){
                option.$elem.removeClass('tagged')
                option.$elem.removeAttr('selected')
            }
            e.stopPropagation()
        }

        let selected = () => {
            if(scope.ngModel::getType() !== 'Array') {
                return {
                    item:scope.ngModel.item,
                    data:scope.ngModel.data
                }
            } else {
                let list = []
                for(var i = 0; i< scope.ngModel.length; i++){
                    let model = scope.ngModel[i]
                    list.push({
                        item:model.item,
                        data:model.data
                    })
                }
                return list
            }
        }

        scope.control = {
            selected
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
                <li ng-repeat="model in ngModel track by $index" ng-click="remove($index, $event)">
                    <span>{{model.item}}</span>
                    <span class="tag-remove">×</span>
                </li>
                ${isTags ? '<li class="tag-input"><span contenteditable="true">&nbsp;</span></li>' : ''}
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
        scope.switchDropdownState = () => { //移到controller上
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
            let renderTag = value => {
                scope.ngModel.push({item:value, data:{value}, $elem:null})
                this.tagInput.innerHTML = '&nbsp;'
            }

            this.select::on('click', () => this.tagInput.focus())
            this.tagInput::on('keydown', e => {
                let value = this.tagInput.innerText.trim()
                if(e.keyCode !== 13) return
                e.preventDefault()
                if(value !== ''){
                    if(scope.ngModel.every(existOption => existOption.item !== value)){
                        scope.$apply(() => renderTag(value))
                    } else {
                        this.tagInput.innerHTML = '&nbsp;'
                    }
                }
            })
            this.tagInput::on('blur', e => {
                let value = this.tagInput.innerText.trim()
                if(value === '') return
                scope.$apply(() => renderTag(value))
            })
        }
    }

    passing(exports, scope){
        exports.select = (option, init = false) => {
            setTimeout(()=>{
                if(this.mode === 'multi' || this.mode === 'tags' ){
                    if(scope.ngModel.every(existOption => existOption !== option)){
                        scope.ngModel.push(option)
                        option.$elem.addClass('tagged')
                        option.$elem.attr('selected',true)
                    }
                } else {
                    scope.ngModel = option
                    if(!init) scope.switchDropdownState()
                }

                if(!/\$apply|\$digest/.test(scope.$root.$$phase)){
                    scope.$apply()
                }
            }, 0)
        }

        exports.mode = this.mode
    }
}


//select option group (IMPLEMENT ME!)
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

        let isSelected = $elem::getDOMState('selected')

        let option = {
            item:scope.value,
            data:scope.data || {value: scope.value},
            $elem:$elem
        }


        $elem.bind('click', () => {
            let isDisabled = $elem::getDOMState('disabled')
            if(isDisabled) return

            if(parentCtrl.mode === 'multi' || parentCtrl.mode === 'tags'){
                $elem.attr('selected', true)
            } else {
                $elem.parent().children().removeAttr('selected')
                $elem.attr('selected', true)
            }

            parentCtrl.select(option)
        })

        if(isSelected){
            parentCtrl.select(option, true)
        }
    }
}
