import { DOM as dom, WIN as win } from './browser'
import {
    transitionProp,
    transitionEndEvent,
    animationProp,
    animationEndEvent
} from './transitionEvents'

import {
    on,
    off,
    noop,
    isHidden,
    addClass,
    setStyle,
    removeClass
} from './index'



const UNMOUNTED = 0
const RUNNING = 999
const ANIMATION = 'animation'
const TRANSITION = 'transition'

const tick = 17
const defaultTimeout = 5000
const valueTypeError = "The type of value which is listened by transition should be Boolean."
const classTypeCache = {}


let getTransitionType = (el, className) => {
    if (!transitionEndEvent || dom.hidden || isHidden(el)) return

    let type
    if(className !== undefined) type = classTypeCache[className]
    if(type) return type

    let computed = win.getComputedStyle(el)
    let inline = el.style
    let transDuration = inline[`${transitionProp}Duration`] || computed[`${transitionProp}Duration`]
    if(transDuration && transDuration !== '0s'){
        type = TRANSITION
    } else {
        let animDuration = inline[`${animationProp}Duration`] || computed[`${animationProp}Duration`]
        if (animDuration && animDuration !== '0s') type = ANIMATION
    }

    if(className !==undefined && type) classTypeCache[className] = type
    return type
}

let setCSScallback = (el, event, callback, timeout = defaultTimeout) => {
    let timeoutId = null

    let handler = e => {
        if(e && e.target === el){
            if(timeoutId !== null) clearTimeout(timeoutId)
            el::off(event, handler)
            callback()
        }
    }

    el::on(event, handler)

    timeoutId = setTimeout(() => {
        el::off(event, handler)
        callback()
    }, timeout)

    return timeoutId
}

let defaultHooks = {
    onEnter:null,
    onLeave:null
}

export class transition{
    constructor(el, transitionName, initValue = false, maxTimeout = defaultTimeout, hooks = defaultHooks){
        if(typeof initValue !== 'boolean') throw new Error(valueTypeError)
        let data = initValue

        this.el = el
        this.transitionName = transitionName
        this.timeout = null
        this.maxTimeout = maxTimeout
        this.hooks = hooks

        let descriptor = {
            set:newValue => {
                if(data === newValue) return
                data = newValue
                if(this.__stage__ !== RUNNING){
                    this.__stage__ = RUNNING
                    if(data) return this.enter()
                    if(!data) return this.leave()
                }
            },
            get:() => data
        }

        Object.defineProperty(this, 'state', descriptor)
        if(data){
            this.el::addClass(`${this.transitionName}-entered`)
        }
    }

    enter(){
        this.el::addClass(`${this.transitionName}-enter`)
        setTimeout(() =>{
            this.el::addClass(`${this.transitionName}-enter-active`)
            this.enterNext()
        }, tick)
    }

    enterNext(){
        setTimeout(() => {
            let type = getTransitionType(this.el, this.transitionName)
            let recycle = () => {
                this.el::removeClass(`${this.transitionName}-enter ${this.transitionName}-enter-active`)
                this.el::addClass(`${this.transitionName}-entered`)
                this.enterDone()
            }

            if(type === TRANSITION){
                this.setUp(transitionEndEvent, recycle)
            } else if(type === ANIMATION) {
                this.setUp(animationEndEvent, recycle)
            } else {
                recycle()
                return
            }
        }, tick)
    }

    enterDone(){
        if(this.state !== true){
            return this.leave()
        }

        if(typeof this.hooks.onEnter === 'function'){
             this.hooks.onEnter()
        }

        this.__stage__ = UNMOUNTED
    }

    leave(){
        if(isHidden(this.el)){
            if(this.state !== false){
                return this.enter()
            }
            this.el::removeClass(`${this.transitionName}-entered`)
            return this.leaveNext()
        }

        /*
        this.__stage__ = UNMOUNTED
        return*/

        this.el::removeClass(`${this.transitionName}-entered`)
        this.el::addClass(`${this.transitionName}-leave`)
        setTimeout(() => {
            this.el::addClass(`${this.transitionName}-leave-active`)
            this.leaveNext()
        }, tick)
    }

    leaveNext(){
        setTimeout(() => {
            let type = getTransitionType(this.el, this.transitionName)

            let recycle = () => {
                this.el::removeClass(`${this.transitionName}-leave ${this.transitionName}-leave-active`)
                this.leaveDone()
            }

            if(type === TRANSITION){
                this.setUp(transitionEndEvent, recycle)
            } else if(type === ANIMATION) {
                this.setUp(animationEndEvent, recycle)
            } else {
                recycle()
                return
            }
        }, tick)
    }

    leaveDone(){
        if(this.state !== false){
            return this.enter()
        }

        if(typeof this.hooks.onLeave === 'function'){
            this.hooks.onLeave()
        }

        this.__stage__ = UNMOUNTED
    }

    setUp(event, cb){
        /*let handler = e => {
            if(e && e.target === this.el){
                if(this.timeout !== null) this.clear()
                this.el::off(event, handler)
                cb()
            }
        }

        this.el::on(event, handler)

        this.timeout = setTimeout(() => {
            this.el::off(event, handler)
            this.timeout = null
            cb()
        }, this.maxTimeout)*/

        let wrap = () => {
            this.timeout = null
            cb()
        }

        this.timeout = setCSScallback(this.el, event, wrap, this.maxTimeout)
    }

    clear(){
        clearTimeout(this.timeout)
        this.timeout = null
    }
}



export function onMotionEnd(el, cb, transitionName, timeout = defaultTimeout){
    if(typeof el === 'function') [el, cb] = [this, el]
    if(!isDOM(el) && !(el instanceof angular.element)) return
    if(el instanceof angular.element) el = el[0]

    /*let setUp = event => {
        let timeout = null

        let handler = e => {
            if(e && e.target === el){
                clearTimeout(timeout)
                el::off(event, handler)
                cb()
            }
        }

        el::on(event, handler)
        timeout = setTimeout(() => {
            el::off(event, handler)
            cb()
        }, defaultTimeout)
    }*/



    setTimeout(() => {
        if(isHidden(el)) return cb()

        let type = getTransitionType(el, transitionName)
        if(type === TRANSITION){
            setCSScallback(el, transitionEndEvent, cb, timeout)
        } else if(type === ANIMATION) {
            setCSScallback(el, animationEndEvent, cb, timeout)
        }
    }, tick)
}
