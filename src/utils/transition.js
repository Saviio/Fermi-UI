import { WIN } from './browser'

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


export function isHidden(el) {
  return !(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
}

let getTransitionType = (el, className) => {
    if (!transitionEndEvent || document.hidden || isHidden(el)) {
        return
    }

    let type = classTypeCache[className]
    if(type) return type

    let computed = window.getComputedStyle(el)
    let inline = el.style
    let transDuration = inline[`${transitionProp}Duration`] || computed[`${transitionProp}Duration`]
    if(transDuration && transDuration !== '0s'){
        type = TRANSITION
    } else {
        let animDuration = inline[`${animationProp}Duration`] || computed[`${animationProp}Duration`]
        if (animDuration && animDuration !== '0s') type = ANIMATION
    }

    if(type) classTypeCache[className] = type
    return type
}


export class transition{
    constructor(el, transitionName, initValue = false, maxTimeout = defaultTimeout){
        if(typeof initValue !== 'boolean'){
            throw new Error(valueTypeError)
        }
        let data = initValue

        this.el = el
        this.transitionName = transitionName
        this.timeout = null
        this.maxTimeout = maxTimeout

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
                this.enterDone()
                return
            }
        }, tick)
    }

    enterDone(){
        if(this.state !== true){
            return this.leave()
        }
        this.__stage__ = UNMOUNTED
    }

    leave(){
        if(isHidden(this.el)){
            if(this.state !== false){
                this.enter()
            } else {
                this.__stage__ = UNMOUNTED
            }
            return
        }

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
                this.leaveDone()
                return
            }

        }, tick)
    }

    leaveDone(){
        if(this.state !== false){
            return this.enter()
        }
        this.__stage__ = UNMOUNTED
    }

    setUp(event, cb){
        let handler = e => {
            if(e && e.target === this.el){
                if(this.timeout !== null) this.clear()
                this.el::off(event, handler)
                cb()
            }
        }

        this.el::on(event, handler)

        this.timeout = setTimeout(() => {
            this.timeout = null
            this.el::off(event, handler)
            cb()
        }, this.maxTimeout)
    }

    clear(){
        clearTimeout(this.timeout)
        this.timeout = null
    }

}
