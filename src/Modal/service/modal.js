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
    prepend,
    setStyle,
    addClass,
    isPromise,
    escapeHTML,
    createElem,
    removeClass
} from '../../utils'
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
    title:'请确认',
    content:'',
    okText:'确认',
    dismissText:'取消',
    onOk:noop,
    onDismiss:noop,
    plain:false
}

const defaultNormalModal = {
    width:400,
    title:'',
    content:'',
    okText:'确认',
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

        this.closed = new Promise((resolve, reject) => {
            resolves.closed = resolve
        })

        this.opened = new Promise((resolve, reject) => {
            resolves.opened = resolve
        })

        this.close = null
    }
}

//support ngController
//close
//opened/closed   all promise like object?
//confirm ++ dismissed


//waitting for IMPLEMENT ngController plainContent

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

        if(modal){
            openedModals.splice(index, 1)
            this.__tryDispose__()
        }
    }

    open(options){
        if(options === undefined) throw new Error('No parameters passed in when call Fermi.Modal.open.')
        if(options.template === undefined) throw new Error(emptyTemplateError)
        this.__tryRender__()

        let className = options.className || 'fm-modal'
        let modalName = options.name || null
        let title = (options.title || '').toString()

        let template = reSelector.test(options.template)
        ? dom::query(options.template).innerHTML
        : options.template

        if(template::trim() === '') throw new Error(emptyTemplateError)

        let scope = options.scope.$new()
        let templateDOM = compile(template)(scope)[0]
        if(!/\$apply|\$digest/.test(scope.$root.$$phase)) scope.$apply()


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
                scope.$destroy()
            }
        })

        modalContainer::query('.fm-modal-content')::prepend(templateDOM)


        let modalIns = new ModalInstance({
            id:openedId,
            transition:modalTransition
        }, resolves)

        modalIns.close = () => {
            modalTransition.state = false
            this.__remove__(openedId)
        }

        openedModals.push(modalIns)

        let closeFn = e => modalIns.close()
        closeBtn::on('click', closeFn)
        body::last(modalContainer)

        modalTransition.state = true
        return modalIns
    }


    closeAll(){
        let modal, copyRef = openedModals.slice(0)
        while(modal = copyRef.pop()){
            modal.close()
        }
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
        let op = Object.assign({}, defaultConfirmModal, options)

        let width = op.width.toString()
        if(width.indexOf('px')) width = width.replace('px', '')
        let scope = rootScope.$new()


        scope.width = width
        scope.content = op.content
        scope.okText = op.okText
        scope.dismissText = op.dismissText

        op.scope = scope
        op.template = replacePlainTag(confirm, op.plain)

        let openedId, modal, dismiss, ok

        scope.onDismiss = () => {
            modal.dismiss.then(() => modal.close())
            dismiss()
        }

        scope.onOk = () => {
            modal.ok.then(() => modal.close())
            ok()
        }

        modal = this.open(op)
        modal.dismiss = new Promise(resolve => dismiss = resolve)
        modal.ok = new Promise(resolve => ok = resolve)

        return modal
    }

    normal(options){
        let op = Object.assign({}, defaultNormalModal, options)
        let width = op.width.toString()
        if(width.indexOf('px')) width = width.replace('px', '')
        let scope = rootScope.$new()

        scope.width = width
        scope.content = op.content
        scope.okText = op.okText

        op.scope = scope
        op.template = replacePlainTag(normal, op.plain)

        let openedId, modal, ok

        scope.onOk = () => {
            modal.ok.then(() => modal.close())
            ok()
        }

        modal = this.open(op)
        modal.ok = new Promise(resolve => ok = resolve)
        return modal
    }
}
