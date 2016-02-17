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




const overlayId = '__modalOverlay__'
const overlayInAnimation = 'fm-overlay-In'
const reSelector = /^[#|.]/
const emptyTemplateError = 'Template should not be set as empty / null / undefined.'

const defaultConfirm = {
    width:400,
    title:'请确认',
    content:'',
    okText:'确认',
    cancelText:'取消',
    onOk:noop,
    onCancel:noop,
}


let openedModals = []
let compile = null
let rootScope = null

class ModalInstance{
    constructor(id, close, events){
        this.openedId = id
        this.DOM = null
    }



    dispose(){
        this.DOM = null
    }
}

//support ngController
//close
//opened/closed   all promise like object?
//confirm ++ dismissed

@dependencies('$compile', '$rootScope')
export default class Modal{
    constructor($compile, $rootScope){
        this._hasOverlay = false
        this._overlayNode = null
        compile = $compile
        rootScope = $rootScope
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
        if(id < 0){
            while(targetModal = openedModals.pop()){
                targetModal.modal.transition.state = false
                if(targetModal.modal.event) targetModal.modal.event.leaving()
            }
            this.__tryDispose__()
            return
        }

        let targetModal
        let index

        for(let i = 0; i < openedModals.length; i++){
            if(openedModals[i].openedId === id){
                targetModal = openedModals[i]
                index = i
                break;
            }
        }

        if(targetModal){
            targetModal.modal.transition.state = false
            openedModals.splice(index, 1)
            this.__tryDispose__()
        }
    }

    open(options){
        if(options === undefined) throw new Error('No parameters passed in when call Fermi.Modal.open.')
        if(options.template === undefined) throw new Error(emptyTemplateError)
        //options.plain = options.scope === undefined ? true : false
        this.__tryRender__()

        let className = options.className || 'fm-modal'
        let modalName = options.name || null
        let title = (options.title || '').toString()

        let template = reSelector.test(options.template)
        ? dom::query(options.template).innerHTML
        : options.template

        if(template::trim() === '') throw new Error(emptyTemplateError)

        let templateDOM
        let scope = options.scope.$new()
        //if(!options.plain){//remark
            //scope =
        templateDOM = compile(template)(scope)[0]
        if(!/\$apply|\$digest/.test(scope.$root.$$phase)) scope.$apply()
        //} else {
            //templateDOM = toDOM(template)
        //}

        let registeredEvent = null
        if(modalName){
            registeredEvent = {
                opened  : ()  => scope.$emit('modal::opened', modalName),
                leaving : ()  => scope.$emit('modal::leaving', modalName),
                leaved  : ()  => scope.$emit('modal::leaved', modalName)
            }
        }


        let openedId = nextId()
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
            onLeave:() => {
                modalContainer::remove()
                if(options.hooks && typeof options.hooks.onClose === 'function'){
                    options.hooks.onClose()
                }

                //if(scope){
                if(registeredEvent) registeredEvent.leaved()
                scope.$destroy()
                //}
            }
        })

        let closeFn = e => {
            if(registeredEvent) registeredEvent.leaving()
            this.__remove__(openedId)
        }

        closeBtn::on('click', closeFn)
        modalContainer::query('.fm-modal-content')::prepend(templateDOM)
        openedModals.push({openedId, modal: {
            main:modalContent,
            transition:modalTransition,
            event:registeredEvent
        }})

        body::last(modalContainer)
        modalTransition.state = true

        if(registeredEvent){
            registeredEvent.opened()
        }

        return openedId
    }

    close(id){
        this.__remove__(id)
    }

    closeAll(){
        this.__remove__(-1)
    }


    /*
    特化Modal  confirm(options)
               normal(options)

    options::=
        onOk: Function | Promise
        onCancel: Function | Promise
        title
        okText
        cancelText
        width:400
        content
    */

    confirm(options = {}){
        let op = Object.assign({}, defaultConfirm, options)

        let width = op.width.toString()
        if(width.indexOf('px')) width = width.replace('px', '')
        let scope = rootScope.$new()

        scope.width = width
        scope.content = op.content
        scope.okText = op.okText
        scope.cancelText = op.cancelText
        scope.onOk = op.onOk


        let openedId

        op.scope = scope
        op.template = confirm
        scope.onCancel = () => {
            if(typeof op.onCancel === 'function'){
                let ret = op.onCancel()
                return isPromise(ret) ? ret.then(() => this.close(openedId)) : this.close(openedId)
            }
            return this.close(openedId)
        }

        scope.onOk = () => {
            if(typeof op.onOk === 'function'){
                let ret = op.onOk()
                return isPromise(ret) ? ret.then(() =>　this.close(openedId)) : this.close(openedId)
            }
            return this.close(openedId)
        }

        openedId = this.open(op)
    }

    normal(options){

    }
}







/*
//type1
let onOk = () => console.log('ok.')


//type2
let onOk = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(),1000)
    })
}


<Modal click=onOk />


function Modal(){}

Modal.prototype.clear = function(){
    //clean function
}

Modal.prototype.click = function(cb){
    let ret = cb()
    if(isPrmoise(ret)){
        ret.then(this.clear)
    } else {
        this.clear()
    }
}

*/
