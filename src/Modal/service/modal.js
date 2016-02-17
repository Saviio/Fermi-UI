import { dependencies } from '../../external/dependencies'
import { DOM as dom, BODY as body } from '../../utils/browser'
import { transition } from '../../utils/transition'
import {
    on,
    last,
    trim,
    toDOM,
    query,
    inDoc,
    remove,
    nextId,
    prepend,
    setStyle,
    addClass,
    createElem,
    removeClass
} from '../../utils'
import container from '../template/template.html'

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
    plain:true | false by default
}

.closeAll
.close(id)

id ::= Number

private:
  hasOverlay => boolean


*/


//自定义className + enter/leave
const overlayId = '__modalOverlay__'
const overlayInAnimation = 'fm-overlay-In'
const reSelector = /^[#|.]/
const emptyTemplateError = 'Template should not be set as empty / null / undefined.'


let openedModals = []
let compile = null

@dependencies('$compile')
export default class Modal{
    constructor($compile){
        this._hasOverlay = false
        this._overlayNode = null
        compile = $compile
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
        options.plain = options.scope === undefined ? true : false
        this.__tryRender__()

        let className = options.className || 'fm-modal'

        let template
        template = reSelector.test(options.template)
        ? dom::query(options.template).innerHTML
        : options.template

        if(template::trim() === '') throw new Error(emptyTemplateError)

        let templateDOM
        let scope = null
        if(!options.plain){
            scope = options.scope.$new()
            templateDOM = compile(template)(scope)[0]
            if(!/\$apply|\$digest/.test(scope.$root.$$phase)) scope.$apply()
        } else {
            templateDOM = toDOM(template)
        }


        let openedId = nextId()
        let modalContainer = toDOM(container)
        modalContainer.setAttribute('_FM-ModalId', openedId)
        let modalContent = modalContainer::query('.fm-modal')
        if(className !== 'fm-modal'){
            modalContent.className = className
        }
        let closeBtn = modalContainer::query('.fm-close')
        let modalTransition = new transition(modalContent, className, false, 5000, {
            onLeave:() => {
                modalContainer::remove()
                if(options.hooks && typeof options.hooks.onClose === 'function'){
                    options.hooks.onClose()
                }
                if(scope) scope.$destroy()
            }
        })

        let closeFn = e => this.__remove__(openedId)

        closeBtn::on('click', closeFn)
        modalContainer::query('.fm-modal-content')::prepend(templateDOM)
        openedModals.push({openedId, modal: {
            main:modalContent,
            transition:modalTransition
        }})

        body::last(modalContainer)
        modalTransition.state = true

        return openedId
    }

    close(id){
        this.__remove__(id)
    }

    closeAll(){
        this.__remove__(-1)
    }
}
