if(instance.controller){
    let controllerOrg = instance.controller;

    instance.controller = function (...controllerArgs) {
        let instance = new Directive(...args);
        controllerOrg.apply(instance, controllerArgs);

        if(typeof instance.passing === 'function'){
            instance.passing.apply(instance, [this].concat(controllerArgs))
        }
    };

    instance.controller.$inject = controllerOrg.$inject || ["$scope", "$element"];
}

if(instance.compile){
    let compileOrg = instance.compile;
    instance.compile = function (...compileArgs){
        let postLink = compileOrg.apply(instance, compileArgs);
        if(postLink !== undefined){
            return postLink.bind(instance)
        }
    }
}

if(instance.link){
    instance.link = instance.link.bind(instance)
}








"use strict";

export default class DirectiveFactory {
	static create(Directive) {
		let factory = function (...args) {
			let instance = new Directive(...args);
			for (let key in instance) {
				instance[key] = instance[key];
			}

			let controllerFn = null

			if(instance.controller){
				controllerFn = instance.controller
			}

			if (instance.link) {
				let linkOrg = instance.link;
				instance.link = function (...linkArgs) {
					let ins = new Directive(...args);
					linkOrg.apply(ins, linkArgs);
					if(instance.controller){

						instance.controller = function (...controllerArgs) {

							console.log(...controllerArgs)
							controllerFn.apply(ins, controllerArgs);

							if(typeof instance.passing === 'function'){
								instance.passing.apply(ins, [this].concat(controllerArgs))
							}
						}
					}
				};
			}

			if (instance.compile) {
				let compileOrg = instance.compile;
				instance.compile = function (...compileArgs) {
					let ins = new Directive(...args);
					let postLink = compileOrg.apply(ins, compileArgs);
					if(postLink !== undefined){
						return postLink.bind(ins)
					}
				};
			}

			if (instance.controller ) {
				let controllerOrg = instance.controller;

				instance.controller = function (...controllerArgs) {
					let ins = new Directive(...args);
					controllerOrg.apply(ins, controllerArgs);

					if(typeof instance.passing === 'function'){
						instance.passing.apply(ins, [this].concat(controllerArgs))
					}
				};

				instance.controller.$inject = controllerOrg.$inject || ["$scope", "$element"];
			}

			return instance;
		};

		factory.$inject = Directive.$inject || [];

		return factory;
	}
}

DirectiveFactory.$inject = [];

















let mixin = function(instance){
	let dest = this
	if(!dest.$new) throw new Error("caller was not a angular scope object.")

	for (let key in instance) {
		if (!dest[key] && instance.hasOwnProperty(key)) {
			dest[key] = instance[key]
		}
	}
}

//为了看起来比较“完整”的支持使用ES6 Class 来编写Angular Directive，因此做了一下属性糅杂的小技巧来保证开发体验是一致的。
//so 可能在某些corner case可能会导致工作失常，尚在斟酌中。

export default class DirectiveFactory {
	static create(Directive) {
		let factory = function (...args) {
			let instance = new Directive(...args)
			for (let key in instance) {
				instance[key] = instance[key]
			}

			if (typeof instance.controller === 'function') {
				let controllerOrg = instance.controller

				instance.controller = function (_caller_) {
					return function (...controllerArgs){
						let ins = new Directive(...args)
						let index = controllerOrg.$inject && controllerOrg.$inject.indexOf('$scope')
						let caller = controllerArgs.length > 0 && index !== -1 && index !== undefined
									? controllerArgs[index]
									: ins

						controllerOrg.apply(_caller_ === null ? ins : _caller_, controllerArgs)
						if(typeof ins.passing === 'function'){
							ins.passing.apply(caller, [this].concat(controllerArgs))
						}
					}
				}

				instance.controller.$inject = controllerOrg.$inject || ['$scope']

			} else if(typeof instance.passing === 'function'){
				instance.controller = function (...controllerArgs){
					let [caller] = controllerArgs
					instance.passing.apply(caller, [this])
				}

				instance.controller = () => {}
				instance.controller.$inject = ["$scope"]
			}

			if (typeof instance.compile === 'function') {
				let compileOrg = instance.compile
				instance.compile = function (...compileArgs) {
					let ins = new Directive(...args)
					let postLink = compileOrg.apply(ins, compileArgs)

					if(typeof instance.controller === 'function'){
						let inject = instance.controller.$inject
						instance.controller = instance.controller(ins)
						if(instance.controller){
							instance.controller.$inject = inject
						}
					}

					return (...linkArgs) => {
						let scope = linkArgs[0]
						if(postLink !== undefined){
							postLink.apply(ins, linkArgs)
						}
						scope::mixin(ins)
					}
				}
			} else if(typeof instance.link === 'function') {
				let linkOrg = instance.link
				instance.link = function (...linkArgs) {
					let scope = linkArgs[0]
					let ins = new Directive(...args)
					linkOrg.apply(ins, linkArgs)
					scope::mixin(ins)
				}
			}

			if(!instance.compile && instance.controller){
				let controllerOrg = instance.controller
				instance.controller = controllerOrg(null)
				instance.controller.$inject = controllerOrg.$inject
			}

			return instance
		}

		factory.$inject = Directive.$inject || []
		return factory
	}
}

DirectiveFactory.$inject = []













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

/*
  props::=
     id,
     transition,
     events
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

    /*
    dispose(){
        this.DOM = null
    }
    */
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
        /*
        if(id < 0){
            while(targetModal = openedModals.pop()){
                //targetModal.close()
                //if(targetModal.modal.event) targetModal.modal.event.leaving()
            }
            this.__tryDispose__()
            return
        }
        */

        let modal, index

        for(let i = 0; i < openedModals.length; i++){
            if(openedModals[i].id === id){
                modal = openedModals[i]
                index = i
                break
            }
        }

        if(modal){
            //modal.close()
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

        //let templateDOM
        let scope = options.scope.$new()
        //if(!options.plain){//remark
            //scope =
        let templateDOM = compile(template)(scope)[0]
        if(!/\$apply|\$digest/.test(scope.$root.$$phase)) scope.$apply()
        //} else {
            //templateDOM = toDOM(template)
        //}

        /*
        let registeredEvent = null
        if(modalName){
            registeredEvent = {
                opened  : ()  => scope.$emit('modal::opened', modalName),
                leaving : ()  => scope.$emit('modal::leaving', modalName),
                leaved  : ()  => scope.$emit('modal::leaved', modalName)
            }
        }
        */

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
            opEnter:() => {
                if(resolves.opened) resolves.opened()
            },
            onLeave:() => {
                modalContainer::remove()
                /*if(options.hooks && typeof options.hooks.onClose === 'function'){
                    options.hooks.onClose()
                }*/
                //debugger
                if(resolves.closed) resolves.closed()

                //if(scope){
                //if(registeredEvent) registeredEvent.leaved()
                scope.$destroy()
                //}
            }
        })

        modalContainer::query('.fm-modal-content')::prepend(templateDOM)


        let modalIns = new ModalInstance({
            id:openedId,
            transition:modalTransition
        }, resolves)
        //debugger

        modalIns.close = () => {
            modalTransition.state = false
            this.__remove__(openedId)
        }

        let closeFn = e => {
            //if(registeredEvent) registeredEvent.leaving()
            modalIns.close()
        }

        closeBtn::on('click', closeFn)


        /*
        if(options.hooks){
            if(typeof options.hooks.onEnter === 'function'){
                modalIns.opened.then(() => options.hooks.onEnter())
            }

            if(typeof options.hooks.onLeave === 'function'){
                modalIns.closing.then(() => options.hooks.onLeave())
            }
        }*/


        openedModals.push(modalIns)

        /*
        openedModals.push({openedId, modal: {
            main:modalContent,
            transition:modalTransition,
            event:registeredEvent
        }})
        */

        body::last(modalContainer)
        modalTransition.state = true

        /*
        if(registeredEvent){
            registeredEvent.opened()
        }*/

        return modalIns
    }

    /*
    close(id){
        this.__remove__(id)
    }
    */

    closeAll(){
        openedModals.forEach(m => m.close())
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

        let openedId, modal, dismiss, ok

        op.scope = scope
        op.template = confirm


        scope.onCancel = () => {//
            modal.dismiss.then(() => modal.close())
            dismiss()
        }

        scope.onOk = () => {
            modal.ok.then(() => modal.close())
            ok()
        }

        modal = this.open(op)
        modal.dismiss = new Promise((resolve, reject) => dismiss = resolve)
        modal.ok = new Promise((resolve, reject) => ok = resolve)

        return modal
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



export class Radio{
    constructor(){
        this.restrict = 'EA'
        this.replace = true
        this.scope = {
            onchange:'=?',
            label:'@',
            control:'=?',
            name:'@'
        }
        this.template = template
        this.refRadioGroup = []
    }

    compile($tElement, tAttrs, transclude){
        this.rootDOM = $tElement[0]
        this.radioElem = this.rootDOM::query('.fm-radio')
        this.input = this.rootDOM::query('[type=radio]')
        return this.link
    }

    @dependencies('$scope')
    controller(scope){

        let disable = () => {}
        let allow = () => {}

        scope.control = {
            disable,
            allow,
        }


        this.callback = typeof scope.onchange === 'function'
        ? scope.onchange
        : noop
    }

    link(scope, $elem, attrs, ctrl){
        let defaultValue
        this.input.value = this.rootDOM::props('default')
        this.refRadioGroup = []
        if(scope.name !== undefined || scope.name !== null){
            setTimeout(() => {
                let ret = dom::queryAll(`.fm-radio > input[type=radio][name=${scope.name}]`)
                for(let i = 0; i < ret.length ; i++) this.refRadioGroup.push(ret[i])
            }, 0)
        } else {
            this.refRadioGroup.push(this.input)
        }

        this.input::on('click', ::this.handle)
    }

    choose(){
        this.radioElem::addClass('fm-radio-checked')
    }

    handle(e){
        this.refRadioGroup.forEach(i => {
            if(i !== this.input){
                i.parentNode::removeClass('fm-radio-checked')
            } else {
                this.choose()
            }
        })

        this.callback(this.input.value)
    }
}




import { dependencies } from '../../external/dependencies'
import template from '../template/template.html'
import { DOM as dom } from '../../utils/browser'
import {
    on,
    noop,
    props,
    query,
    addClass,
    queryAll,
    removeClass
} from '../../utils'


const SEPARATED = 1
const GROUP = 2

//disable
//default
//onchange

export class Radio{
    constructor(){
        this.restrict = 'EA'
        this.replace = true
        this.scope = {
            onchange:'=?',
            label:'@',
            control:'=?',
            name:'@'
        }
        this.template = template
    }

    compile($tElement, tAttrs, transclude){
        this.rootDOM = $tElement[0]
        this.radioElem = this.rootDOM::query('.fm-radio')
        this.input = this.rootDOM::query('[type=radio]')
        return this.link
    }

    @dependencies('$scope')
    controller(scope){

        let disable = () => {}
        let allow = () => {}

        scope.control = {
            disable,
            allow,
        }


        this.callback = typeof scope.onchange === 'function'
        ? scope.onchange
        : noop

        if(scope.name !== undefined || scope.name !==null){
            Object.defineProperty(this, 'refRadioGroup', {
                set:() => {},
                get:() => [].slice.call(dom::queryAll(`.fm-radio > input[type=radio][name=${scope.name}]`),0)
            })
        } else {
            this.refRadioGroup = this.input
        }
    }

    link(scope, $elem, attrs, ctrl){
        this.input.value = this.rootDOM::props('default')
        this.input::on('click', ::this.handle)
    }

    choose(){
        this.radioElem::addClass('fm-radio-checked')
    }

    handle(e){
        this.refRadioGroup.forEach(i => {
            if(i !== this.input){
                i.parentNode::removeClass('fm-radio-checked')
            } else {
                this.choose()
            }
        })

        this.callback(this.input.value)
    }
}


export class RadioGroup{

}



/*
export function setAttr(el, key, value){
    if(arguments.length === 2 && typeof el ==='string') [el, key, value] = [this, el, key]
    if(arguments.length === 1) [el, key] = [this, el]
    el.setAttribute(key, value)
    return el
}

export function getAttr(el, key){
    if(arguments.length === 1) [el, key] = [this, el]
    return el.getAttribute(key)
}

export function removeAttr(el, key){
    if(arguments.length === 1) [el, key] = [this, el]
     el.removeAttr(key)
    return el
}
*/

/*export function extend(target){
    if(!this.$new) throw new Error("caller was not a angular scope variable.")
    let dest = this
    let ignore = []
    if(target.constructor){
        let re = /(?:this\.)(\w+)/gm
        let source = target.constructor.toString()
        source.match(re).forEach(e => ignore.push(e.substr(5)))
    }

    for (let key in target) {
        if (!dest[key] && ignore.indexOf(key) ===-1 && target.hasOwnProperty(key)) {
            dest[key] = target[key]
        }
    }

    export function toggleClass(el, namespace, state, suffix){
        if(arguments.length === 3) [el, namespace, state, suffix] = [this, el, namespace, state]

        return function(){

            state
            ? el::replaceClass('hide', namespace + '-' + suffix['true'])
            : el::replaceClass(namespace + '-' + suffix['true'], namespace + '-' + suffix['false'])::onMotionEnd(() => {
                //debugger
                el::replaceClass(namespace + '-' + suffix['false'], 'hide')
            })

            state = !state
        }
    }
}*/



import cache from '../utils/cache'
import { nextFid } from '../utils'


//为了看起来比较“完整”的支持使用ES6 Class 来编写Angular Directive，因此做了些小技巧来保证开发体验是一致的，directive的controller方法会在运行时多传入一个或两个依赖。
//directive 流程： compile => controller => link
//可能在某些corner case可能会导致工作失常，尚在斟酌中。

const FermiIdenitifer = 'data-fermiId'
let _cache = new Map() //remark 考虑一下究竟是不是需要在DOM上tag，还是干脆以DOM为key做数据映射  domRef

window.caccc = _cache
export default class DirectiveFactory {
	static create(Directive) {
		let factory = function (...args) {
			let instance = new Directive(...args)


			if (typeof instance.compile === 'function') {
				let compileOrg = instance.compile
				instance.compile = function (...compileArgs) {
					let ins = new Directive(...args)
					let [$elem, ...restArgs] = compileArgs
					let postLink = compileOrg.apply(ins, compileArgs)

					let domRef = $elem[0]
					_cache.set(domRef, ins)

					return (...linkArgs) => {
						let [scope, $elem, ...restArgs] = linkArgs
						if(postLink !== undefined){
							postLink.apply(ins, linkArgs)
						}

						_cache.delete(domRef)
					}
				}
			} else if(typeof instance.link === 'function') {
				let linkOrg = instance.link
				instance.link = function (...linkArgs) {
					let [scope, $elem, ...restArgs] = linkArgs
					let domRef = $elem[0]
					let caller = _cache.get(domRef)

					if(caller !== undefined){
						_cache.delete(domRef)
					} else {
						caller = new Directive(...args)
					}

					linkOrg.apply(caller, linkArgs)
				}
			}

			if (typeof instance.controller === 'function') {
				let controllerOrg = instance.controller
				instance.controller.$inject = instance.controller.$inject || ['$scope', '$element']


				if(instance.controller.$inject.indexOf('$scope') === -1){
					instance.controller.$inject = [
						...instance.controller.$inject , '$scope'
					]
				}

				if(instance.controller.$inject.indexOf('$element') === -1){
					instance.controller.$inject  = [
						...instance.controller.$inject , '$element'
					]
				}

				instance.controller = function (...controllerArgs) {
					let scopeIndex = instance.controller.$inject && instance.controller.$inject.indexOf('$scope')
					let elemIndex = instance.controller.$inject && instance.controller.$inject.indexOf('$element')
					let $elem = elemIndex !== -1 && elemIndex !== undefined && controllerArgs[elemIndex]

					let domRef = $elem[0]
					let caller = _cache.get(domRef)

					if(caller === undefined){
						caller = new Directive(...args)
						_cache.set(domRef, caller)
					}

					controllerOrg.apply(caller, controllerArgs)

					if(typeof instance.passing === 'function'){
						instance.passing.apply(caller, [this].concat(controllerArgs))
					}

					if(typeof instance.link !== 'function'){
						_cache.delete(domRef)
					}
				}

				instance.controller.$inject = controllerOrg.$inject

			} else if(typeof instance.passing === 'function'){

				instance.controller = function (...controllerArgs){
					let [scope, $elem, ...restArgs] = controllerArgs

					let domRef = $elem[0]
					let caller = _cache.get(domRef)

					if(caller === undefined){
						caller = new Directive(...args)
						_cache.set(domRef, caller)
					}

					instance.passing.apply(caller, [this])
				}

				instance.controller.$inject = ['$scope', '$element']
			}

			return instance
		}

		factory.$inject = Directive.$inject || []
		return factory
	}
}





import cache from '../utils/cache'
import { nextFid } from '../utils'


//为了看起来比较“完整”的支持使用ES6 Class 来编写Angular Directive，因此做了些小技巧来保证开发体验是一致的，directive的controller方法会在运行时多传入一个或两个依赖。
//directive 流程： compile => controller => link
//可能在某些corner case可能会导致工作失常，尚在斟酌中。

const FermiIdenitifer = 'data-fermiId'
let _cache = new cache() //remark 考虑一下究竟是不是需要在DOM上tag，还是干脆以DOM为key做数据映射  domRef

window.ca=_cache
export default class Factory {
	static create(Directive) {
		let factory = function (...args) {
			let instance = new Directive(...args)


			if (typeof instance.compile === 'function') {
				let compileOrg = instance.compile
				instance.compile = function (...compileArgs) {
					let ins = new Directive(...args)
					let [$elem, ...restArgs] = compileArgs
					let postLink = compileOrg.apply(ins, compileArgs)
					let domRef = $elem[0]
					let fmId = nextFid()
					_cache.add(fmId, ins)
					//$elem.attr(FermiIdenitifer, fmId)
					domRef.setAttribute(FermiIdenitifer, fmId)

					if(Directive.name === 'Line'){
						//debugger
					}

					return (...linkArgs) => {
						let [scope, $elem, ...restArgs] = linkArgs
						if(postLink !== undefined){
							postLink.apply(ins, linkArgs)
						}

						//$elem.removeAttr(FermiIdenitifer)
						domRef.removeAttribute(FermiIdenitifer)
						_cache.remove(fmId)
					}
				}
			} else if(typeof instance.link === 'function') {
				let linkOrg = instance.link
				instance.link = function (...linkArgs) {
					let [scope, $elem, ...restArgs] = linkArgs
					let domRef = $elem[0]
					//let fmId = $elem.attr(FermiIdenitifer)
					let fmId =  domRef.getAttribute(FermiIdenitifer)
					let caller
					if(fmId !== undefined){
						caller = _cache.remove(fmId)
						//$elem.removeAttr(FermiIdenitifer)
						domRef.removeAttribute(FermiIdenitifer)
					} else {
						caller = new Directive(...args)
					}

					linkOrg.apply(caller, linkArgs)
				}
			}

			if (typeof instance.controller === 'function') {
				let controllerOrg = instance.controller
				instance.controller.$inject = instance.controller.$inject || ['$scope', '$element']


				if(instance.controller.$inject.indexOf('$scope') === -1){
					instance.controller.$inject = [
						...instance.controller.$inject , '$scope'
					]
				}

				if(instance.controller.$inject.indexOf('$element') === -1){
					instance.controller.$inject  = [
						...instance.controller.$inject , '$element'
					]
				}

				instance.controller = function (...controllerArgs) {
					let scopeIndex = instance.controller.$inject && instance.controller.$inject.indexOf('$scope')
					let elemIndex = instance.controller.$inject && instance.controller.$inject.indexOf('$element')
					let $elem = elemIndex !== -1 && elemIndex !== undefined && controllerArgs[elemIndex]

					let domRef = $elem[0]
					//let fmId = $elem.attr(FermiIdenitifer)
					let fmId = domRef.getAttribute(FermiIdenitifer)
					let caller
					if(fmId !== undefined || fmId !== null){
						caller = _cache.get(fmId)
						if(caller === undefined){
							debugger
						}
					} else {
						if(Directive.name === 'Line'){
							//debugger
						}
						caller = new Directive(...args)
						fmId = nextFid()
						_cache.add(fmId, caller)
						//$elem.attr(FermiIdenitifer, fmId)
						domRef.setAttribute(FermiIdenitifer, fmId)
					}

					controllerOrg.apply(caller, controllerArgs)

					if(typeof instance.passing === 'function'){
						instance.passing.apply(caller, [this].concat(controllerArgs))
					}

					if(typeof instance.link !== 'function' && fmId !== undefined){
						//$elem.removeAttr(FermiIdenitifer)
						domRef.removeAttribute(FermiIdenitifer)
						_cache.remove(fmId)
					}
				}

				instance.controller.$inject = controllerOrg.$inject

			} else if(typeof instance.passing === 'function'){

				instance.controller = function (...controllerArgs){
					let [scope, $elem, ...restArgs] = controllerArgs
					let domRef = $elem[0]
					//let fmId = $elem.attr(FermiIdenitifer)
					let fmId = domRef.getAttribute(FermiIdenitifer)
					let caller
					if(fmId !== undefined){
						caller = _cache.get(fmId)
					} else {
						caller = new Directive(...args)
						let id = nextFid()
						_cache.add(id, caller)
						//$elem.attr(FermiIdenitifer, id)
						domRef.setAttribute(FermiIdenitifer, id)
					}
					instance.passing.apply(caller, [this])

					if(typeof instance.link !== 'function' && fmId !== undefined){
					    _cache.remove(fmId)
					}
				}

				instance.controller.$inject = ['$scope', '$element']
			}

			return instance
		}

		factory.$inject = Directive.$inject || []
		return factory
	}
}
