import { dependencies } from '../../external/dependencies'
import { onMotionEnd, transition } from '../../utils/transition'
import select from '../template/select.html'
import option from '../template/option.html'
import tags from '../template/tags.html'
import {
    on,
    last,
    toDOM,
    query,
    props,
    remove,
    replace,
    prepend,
    getType,
    debounce,
    getStyle,
    addClass,
    queryAll,
    getDOMState,
    removeClass,
    replaceClass
} from '../../utils'




//do not use ngModel
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
    }

    compile($tElement, tAttrs, transclude){
        let isSearch = $tElement::props('search')
        let isMulti = $tElement::props('multi')
        let isTags = $tElement::props('tags')

        this.rootDOM = $tElement[0]
        this.select = this.rootDOM::query('.fm-select-inner')
        this.optionList = this.rootDOM::query('.fm-select-optionList')
        this.icon = this.rootDOM::query('.fm-select-icon')
        this.size = ($tElement::props('size') || 'default').toLowerCase()

        if(!(isMulti || isTags) && isSearch){
            let searchTmpl = '<div><input placeholder="输入"/></div>'
            this.searchInput = this.optionList
                                    ::prepend(searchTmpl)
                                    ::query('input')
        }

        if(isMulti || isTags){
            this.mode = isTags ? 'tags' : 'multi'
            let tagsDOM = toDOM(tags)
            if(isTags){
                tagsDOM::last(`
                    <li class="fm-tag-input">
                        <span contenteditable="true">&nbsp;</span>
                    </li>
                `)
            }
            let selection = this.select::query('.fm-select-selection')
            this.select::addClass('fm-select-tags')
            selection::replace(tagsDOM)
            this.icon = this.icon::remove()
            if(isTags){
                this.tagInput = this.rootDOM::query('.fm-tag-input > span')
            }
        }

        return this.link
    }

    @dependencies('$scope', '$attrs')
    controller(scope, attrs){
        if(this.mode === 'multi' || this.mode ==='tags'){
            scope.ngModel = []
            scope.tagsRef = []
        } else {
            scope.$on('option::selected', (e, target) => {
                let options = Array.from(this.optionList::queryAll('ul > li'))
                options.forEach(i => {
                    if(i !== target) i.removeAttribute('selected')
                })

                e.stopPropagation()
            })
        }

        scope.remove = (index, e) => {
            scope.ngModel.splice(index, 1).pop()
            if(this.mode !== 'tags'){
                let elem = scope.tagsRef.splice(index, 1).pop()
                elem::removeClass('tagged').removeAttribute('selected')
            }
            e.stopPropagation()
        }

        let selected = () => {
            if(scope.ngModel::getType() !== 'Array') {
                return {
                    item: scope.ngModel.item,
                    data: scope.ngModel.data
                }
            } else {
                let list = []
                for(var i = 0; i< scope.ngModel.length; i++){
                    let model = scope.ngModel[i]
                    list.push({
                        item: model.item,
                        data: model.data
                    })
                }
                return list
            }
        }

        scope.control = { selected }
        let listTransition = new transition(this.optionList, 'fm-select-list', false)

        scope.showOptionList = () => {
            if(this.icon){
                !listTransition.state
                ? this.icon::addClass('fm-icon-actived')
                : this.icon::removeClass('fm-icon-actived')
            }

            listTransition.state = !listTransition.state
        }
    }


    link(scope, $elem, attrs, ctrl){
        if(this.searchInput){
            let fn = debounce(() => {
                let options = this.optionList::queryAll('span')
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

        this.rootDOM::addClass(`fm-select-wrapper-${this.size}`)
        this.select::on('click', scope.showOptionList)

        if(this.mode === 'tags'){
            let renderTag = value => {
                scope.ngModel.push({ item: value, data: { value }, $elem: null })
                this.tagInput.innerHTML = '&nbsp;'
                scope.$apply()
            }

            this.select::on('click', () => this.tagInput.focus())
            this.tagInput::on('keydown', e => {
                let value = this.tagInput.innerText.trim()
                if(e.keyCode !== 13) return
                e.preventDefault()
                if(value !== ''){
                    if(scope.ngModel.every(existOption => existOption.item !== value)){
                        renderTag(value)
                    } else {
                        this.tagInput.innerHTML = '&nbsp;'
                    }
                }
            })

            this.tagInput::on('blur', e => {
                let value = this.tagInput.innerText.trim()
                if(value === '') return
                renderTag(value)
            })
        }
    }

    passing(exports, scope){
        exports.select = (option, elem) => {
            if(this.mode === 'multi' || this.mode === 'tags' ){
                if(scope.ngModel.every(existOption => existOption !== option)){
                    scope.ngModel.push(option)
                    scope.tagsRef.push(elem)
                }
            } else {
                scope.ngModel = option
            }

            if(!/\$apply|\$digest/.test(scope.$root.$$phase)){
                scope.$apply()
            }
        }
        exports.showList = () => scope.showOptionList()
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
        let rootDOM = $elem[0]
        if(typeof attrs.value === "string" && scope.value === undefined){
            scope.value = attrs.value
        }

        let isSelected = $elem::props('selected')
        let option = {
            item:scope.value,
            data:scope.data || {value: scope.value}
        }

        rootDOM::on('click', e => {
            let disabled = rootDOM::props('disabled')
            if(disabled) return

            if(parentCtrl.mode !== 'multi' && parentCtrl.mode !== 'tags'){
                scope.$emit('option::selected', rootDOM)
                parentCtrl.showList()
            } else {
                rootDOM::addClass('tagged')
            }

            rootDOM.setAttribute('selected', true)
            parentCtrl.select(option, rootDOM)
        })

        if(isSelected){
            parentCtrl.select(option, rootDOM)
        }
    }
}
