import { dependencies } from '../../external/dependencies'
import { DOM as dom, BODY as body } from '../../utils/browser'
import { transition } from '../../utils/transition'
import {
    on,
    last,
    trim,
    noop,
    toDOM,
    query,
    inDoc,
    remove,
    nextId,
    getType,
    prepend,
    setStyle,
    addClass,
    isPromise,
    escapeHTML,
    createElem,
    removeClass
} from '../../utils'
import i18n from '../../Core/i18n'
import container from '../template/template.html'
import confirm from '../template/confirm.html'
import normal from '../template/normal.html'



/*

API:

.open(options) => Number

options ::= {
    template: String | dom<class|Id>,
    className: String,
    scope: AngularScope,
    hooks:{
        onOpen: Function,
        onClose: Function
    },
    controller:String,
    controllerAs:String,
    name: String | optional (support for Events: modal::opened, modal::leaving, modal::leaved)
    title: String
}

.closeAll
.close(id)

id ::= Number

private:
  hasOverlay => boolean


*/

const defaultConfirmModal = {
    width:400,
    title:'PleaseConfirm',
    content:'',
    okText:'ok',
    dismissText:'dismiss',
    onOk:noop,
    onDismiss:noop,
    plain:false
}

const defaultNormalModal = {
    width:400,
    title:'',
    content:'',
    okText:'ok',
    onOk:noop,
    plain:false
}

let replacePlainTag = (template, isPlain) => template.replace(/#plain\-directive#/m, isPlain ? 'ng-bind-html="content | plain"' : '')


const overlayId = '__modalOverlay__'
const overlayInAnimation = 'fm-overlay-In'
const reSelector = /^[#|.]/
const emptyTemplateError = 'Template should not be set as empty / null / undefined.'


let openedModals = []
let compile = null
let rootScope = null
let controllerGetter = null


/*
  props::=
     id,
     transition
*/
class ModalInstance{
    constructor(props, resolves = {}, ...restArgs){
        this.id = props.id
        this.closed = new Promise(resolve => resolves.closed = resolve)
        this.opened = new Promise(resolve => resolves.opened = resolve)
        this.close = null
        this.isClosed = false
    }
}

//support ngController
//close
//opened/closed   all promise like object?
//confirm ++ dismissed


@dependencies('$compile', '$controller', '$rootScope')
export default class Modal{
    constructor($compile, $controller, $rootScope){
        this._hasOverlay = false
        this._overlayNode = null
        compile = $compile
        rootScope = $rootScope
        controllerGetter = $controller
    }

    __tryRender__(){
        if(this._hasOverlay) return

        let overlay = createElem('div')
        overlay.id = overlayId
        this._overlayNode = body::last(overlay)
        this._hasOverlay = true
        setTimeout(() =>
            overlay::addClass(overlayInAnimation), 17)
    }

    __tryDispose__(){
        if(openedModals.length > 0) return
        if(!this._hasOverlay || this._overlayNode === null || !this._overlayNode::inDoc()) return

        let overlayNode = this._overlayNode
        overlayNode::removeClass(overlayInAnimation)
        this._hasOverlay = false
        this._overlayNode = null
        setTimeout(() => overlayNode::remove(), 400)
    }

    __remove__(id){
        let index
        for(let i = 0; i < openedModals.length; i++){
            if(openedModals[i].id === id){
                index = i
                break
            }
        }

        if(index != undefined){
            openedModals.splice(index, 1)
            this.__tryDispose__()
        }
    }

    open(options){
        if(options === undefined) throw new Error('No parameters passed in when call Function: Fermi.Modal.open.')
        if(options.template === undefined) throw new Error(emptyTemplateError)
        this.__tryRender__()

        let className = options.className || 'fm-modal'
        //let modalName = options.name || null
        let title = (options.title || '').toString()

        let template = reSelector.test(options.template)
        ? dom::query(options.template).innerHTML
        : options.template

        if(template::trim() === '') throw new Error(emptyTemplateError)
        let $template = angular.element(template)

        let passInScope = (options.scope || rootScope)
        passInScope = passInScope.__NEW__ ? passInScope : passInScope.$new()
        let modalScope = passInScope
        let type = options.controller::getType()
        if(type === 'String' || type === 'Array' || type === 'Function'){
            let alias = options.controllerAs || null

            let controller

            if(type === 'String' || type === 'Function'){
                controller = controllerGetter(
                    options.controller,
                    {
                        $scope: modalScope,
                        $element: $template
                    },
                    false,
                    alias
                )
            } else if(type === 'Array') {
                let f = options.controller.pop()
                if(f::getType() !== 'Function') throw Error('Controller should be a Function type.')
                f.$inject = options.controller

                controller = controllerGetter(
                    f,
                    {
                        $scope: modalScope,
                        $element: $template
                    },
                    false,
                    alias
                )
            }

            controller.$scope = modalScope
            if(alias !== null){
                if(type === 'String') modalScope[alias] = controller
                else if(type === 'Array' || type === 'Function') modalScope[alias] = controller.$scope
            }
        }

        let templateDOM = compile($template)(modalScope)[0]
        if(!/\$apply|\$digest/.test(modalScope.$root.$$phase)) modalScope.$apply()


        let openedId = nextId()
        let resolves = {}

        let modalContainer = toDOM(container)
        modalContainer.setAttribute('_FM-ModalId', openedId)
        let modalContent = modalContainer::query('.fm-modal')
        if(className !== 'fm-modal'){
            modalContent.className = className
        }

        if(title::trim() !== ''){
            modalContent::query('.fm-modal-title').innerHTML = escapeHTML(title)
        }

        let closeBtn = modalContainer::query('.fm-close')
        let modalTransition = new transition(modalContent, className, false, 5000, {
            onEnter:() => {
                if(resolves.opened) resolves.opened()
            },
            onLeave:() => {
                modalContainer::remove()
                if(resolves.closed) resolves.closed()
                modalScope.$destroy()
            }
        })

        modalContainer::query('.fm-modal-content')::prepend(templateDOM)


        let modalIns = new ModalInstance({
            id:openedId,
            transition:modalTransition
        }, resolves)

        modalIns.close = () => {
            if(!modalIns.isClosed){
                modalTransition.state = false
                this.__remove__(openedId)
                modalIns.isClosed = true
            }
        }

        openedModals.push(modalIns)

        closeBtn::on('click',  e => modalIns.close())
        body::last(modalContainer)

        modalTransition.state = true
        return modalIns
    }


    closeAll(){
        let modal, copyRef = openedModals.slice(0)
        while(modal = copyRef.pop()) modal.close()
    }


    /*
    特化Modal  confirm(options)
               normal(options)

    options::=
        title
        okText
        cancelText
        width:400
        content
        plain
    */

    confirm(options = {}){
        options = Object.assign({}, defaultConfirmModal, options)
        let width = options.width.toString().replace('px', '')
        let scope = rootScope.$new()
        let modal, dismiss, ok

        scope.__NEW__ = true

        angular.extend(scope, {
            width:width,
            content:options.content,
            okText:options.okText,
            dismissText:options.dismissText,
            onDismiss: () => {
                if(!modal.prevent){
                    modal.dismiss.then(() => modal.close())
                }
                dismiss(scope.okBtn, scope.dismissBtn)
            },
            onOk: () => {
                if(!modal.prevent){
                    modal.ok.then(() => modal.close())
                }
                ok(scope.okBtn, scope.dismissBtn)
            }
        })
        
        if(options.title === 'PleaseConfirm'){
             options.title = i18n.transform()(options.title)
        }

        options.scope = scope
        options.template = replacePlainTag(confirm, options.plain)

        if(options.title === 'PleaseConfirm'){
            options.title = i18n.transform()(options.title)
        }

        modal = this.open(options)
        modal.dismiss = new Promise(resolve => dismiss = resolve)
        modal.ok = new Promise(resolve => ok = resolve)
        modal.prevent = false

        return modal
    }

    normal(options){
        options = Object.assign({}, defaultNormalModal, options)
        let width = options.width.toString().replace('px', '')
        let scope = rootScope.$new()
        let modal, ok

        angular.extend(scope, {
            width: width,
            content: options.content,
            okText: options.okText,
            onOk: () => {
                if(!modal.prevent){
                    modal.ok.then(() => modal.close())
                }
                ok(scope.okBtn)
            }
        })

        options.scope = scope
        options.template = replacePlainTag(normal, options.plain)

        modal = this.open(options)
        modal.ok = new Promise(resolve => ok = resolve)

        return modal
    }
}
