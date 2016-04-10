import { trim, getType } from './lang'

let testElem = document.createElement('div')
let reUnit = /width|height|top|left|right|bottom|margin|padding/i
let reBool = /true|false/i
let fragmentType = 11
let fetchLastEl = node => node.type === fragmentType ? node.lastChild : node
let fetchFirstEl = node => node.type === fragmentType ? node.firstChild : node

export function getCoords(el){
    if(el === undefined) el = this
    if(!isDOM(el)) return

    let box = el.getBoundingClientRect(),
    self = window,
    doc = el.ownerDocument,
    body = doc.body,
    html = doc.documentElement,
    clientTop = html.clientTop || body.clientTop || 0,
    clientLeft = html.clientLeft || body.clientLeft || 0

    return {
        top: (box.top + (self.pageYOffset || html.scrollTop || body.scrollTop ) - clientTop),
        left: (box.left + (self.pageXOffset || html.scrollLeft || body.scrollLeft) - clientLeft)
    }
}


export function getStyle(el, name, removedUnit = ""){
    if(typeof el === "string") [el, name, removedUnit] = [this, el, name === undefined ? "" : name]
    if(!isDOM(el)) return

    var style = window.getComputedStyle ? window.getComputedStyle(el, null)[name] : el.currentStyle[name]

    if((name === 'width' || name === 'height')){
        if(name == 'width') style = el.offsetWidth
        else if(name == 'height') style = el.offsetHeight
    }

    if(removedUnit !== "" && getType(style) === 'String') {
        style = ~~style.replace(new RegExp(removedUnit), "")
    }

    return style
}

export function hasClass(el, cls){
    if(typeof el === 'string') [el, cls] = [this, el]
    if(!isDOM(el)) return
    let clsList
    if (el.classList) {
        clsList = Array.from(el.classList)
    } else {
        clsList = (el.getAttribute('class') || '').split(' ')
    }

    return clsList.indexOf(cls) > -1
}

export function addClass(el, cls){
    if(typeof el === 'string') [el, cls] = [this, el]
    if(!isDOM(el)) return

    let clsList = cls.split(' ')

    while(cls = clsList.pop()){
        if (el.classList) {
            el.classList.add(cls)
        } else {
            let cur = ' ' + (el.getAttribute('class') || '') + ' '
            if (cur.indexOf(' ' + cls + ' ') < 0) {
                el.setAttribute('class', (cur + cls).trim())
            }
        }
    }
    return el
}

export function removeClass(el, cls){
    if(typeof el === 'string') [el, cls] = [this, el]
    if(!isDOM(el)) return

    let clsList = cls.split(' ')
    while(cls = clsList.pop()){
        if (el.classList) {
            el.classList.remove(cls)
        } else {
            let cur = ' ' + (el.getAttribute('class') || '') + ' '
            let tar = ' ' + cls + ' '
            while (cur.indexOf(tar) >= 0) {
                cur = cur.replace(tar, ' ')
            }

            el.setAttribute('class', cur.trim())
        }

        if (!el.className) {
            el.removeAttribute('class')
        }
    }
    return el
}

export function replaceClass(el, orig, mdi){
    if(typeof el === 'string') [el, orig, mdi] = [this, el, orig]
    if(!isDOM(el)) return
    el::removeClass(orig)
    el::addClass(mdi)
    return el
}

export function on (el, event, cb) {
    if(typeof el === 'string') [el, event, cb] = [this, el, event]
    if(!isDOM(el)) return
    let evts = event.split(' ')
    while (evts.length){
        el.addEventListener(evts.pop(), cb)
    }
    return el
}

export function off(el, event, cb){
    if(typeof el === 'string') [el, event, cb] = [this, el, event]
    if(!isDOM(el)) return
    let evts = event.split(' ')
    while (evts.length){
        el.removeEventListener(evts.pop(), cb)
    }
    return el
}


export function before(target, el){
    if(arguments.length === 1) [target, el] = [this, target]
    el = toDOM(el)
    let lastEl = fetchLastEl(el)
    target.parentNode.insertBefore(el, target)
    return lastEl
}


export function after(target, el){
    if(arguments.length === 1) [target, el] = [this, target]
    el = toDOM(el)
    let lastEl = fetchLastEl(el)
    return target.nextSibling? before(target.nextSibling, el) : target.parentNode.appendChild(el), lastEl
}

export function prepend(target, el){
    if(arguments.length === 1) [target, el] = [this, target]
    el = toDOM(el)
    let firstEl = fetchFirstEl(el)
    return target.firstChild ? target.firstChild::before(el) : target.appendChild(el), firstEl
}

export function last(target, el){
    if(arguments.length === 1) [target, el] = [this, target]
    el = toDOM(el)
    let lastEl = fetchLastEl(el)
    return target.length > 0 ? target.lastChild::after(el) : target.appendChild(el), lastEl
}

export function remove(el){
    if(arguments.length === 0) [el] = [this]
    el.parentNode.removeChild(el)
}

export function replace(target, el){
    if(arguments.length === 1) [target, el] = [this, target]
    el = toDOM(el)

    let lastEl = fetchLastEl(el)
    let parent = target.parentNode
    if(parent){
        parent.replaceChild(el, target)
    }
    return lastEl
}

export function isDOM(el){
    if (el.nodeType && el.nodeName) return true
    return false
}

export function inDoc(el) {
    if(arguments.length === 0) el = this
    let doc = document.documentElement
    let parent = el && el.parentNode
    return doc === el || doc === parent || !!(parent && parent.nodeType === 1 && (doc.contains(parent)))
}


export function toDOM(el){
    if(arguments.length === 0) el = this
    if(typeof el === 'string'){
        el = trim(el)
        let dom = createElem('div')
        let fragment = document.createDocumentFragment()
        dom.innerHTML = el
        while(dom.firstChild){
            fragment.appendChild(dom.firstChild)
        }
        el = fragment.childNodes.length === 1 ? fragment.childNodes[0] : fragment
    }

    return el
}

/*
//not supported in old browsers
export function toDOM(el) {
    if(arguments.length === 0) el = this
    if(typeof el === 'string'){
        var temp = document.createElement('template');
        temp.innerHTML = strHTML;
        return temp.content;
    }
    return el
}
*/

export function query(el){
    let base = this
        ? this.__esModule ? document : this
        : document
    if (typeof el === 'string') {
        let selector = el
        el = base.querySelector(selector)
    }
    return el
}


export function queryAll(el){
    let base = this
        ? this.__esModule ? document : this
        : document
    if (typeof el === 'string') {
        let selector = el
        el = base.querySelectorAll(selector)
    }
    return el
}

export function createElem(tag){
    return document.createElement(tag)
}

export function isHidden(el){
  return !(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
}

export function forceReflow(el) {
    if(arguments.length === 0) el = this
    el.offsetHeight
}

export function setStyle(el, styles){
    if(arguments.length === 1) [el, styles] = [this, el]
    let hasCSSText = (typeof el.style.cssText) !== 'undefined'
    let oldStyleText
    let oldStyle = {}
    oldStyleText = hasCSSText ? el.style.cssText : el.getAttribute('style')
    oldStyleText.split(';').forEach(css => {
        if(css.indexOf(':') !== -1){
            let [key, value] = css.split(':')
            oldStyle[key.trim()] = value.trim()
        }
    })

    let newStyle = {}
    Object.keys(styles).forEach(key => {
        let value = styles[key]
        newStyle[key] = value
    })

    let mergedStyle = Object.assign({}, oldStyle, newStyle)
    let styleText = Object.keys(mergedStyle).map(key => key + ': ' + mergedStyle[key] + ';').join(' ')
    if(hasCSSText){
        el.style.cssText = styleText
    } else {
        el.setAttribute('style', styleText)
    }
    return el
}

export function removeStyle(el, shouldRemovedStyles){
    if(arguments.length === 1) [el, shouldRemovedStyles] = [this, el]

    let hasCSSText = (typeof el.style.cssText) !== 'undefined'
    let styleText, style = {}

    let ignoreKeys = Object.keys(shouldRemovedStyles)
    styleText = hasCSSText ? el.style.cssText : el.getAttribute('style')
    styleText.split(';').forEach(css => {
        if(css.indexOf(':') !== -1){
            let [key, value] = css.split(':')
            key = key.trim()
            if(ignoreKeys.indexOf(key) === -1){
                style[key.trim()] = value.trim()
            }
        }
    })

    let newStyleText = Object.keys(style).map(key => key + ': ' + style[key] + ';').join(' ')
    if(hasCSSText){
        el.style.cssText = newStyleText
    } else {
        el.setAttribute('style', newStyleText)
    }
    return el
}

export function props(el, key){
    if(typeof el === 'string') [el, key] = [this, el]

    let attr = null
    if(el instanceof angular.element) {
        attr = ::el.attr
    } else if(isDOM(el)) {
        attr = ::el.getAttribute
    } else {
        throw new Error("Element was not specified.")
    }

    let ret = attr(key)

    if(ret == undefined){
        return false
    } else if(key === 'disabled' && ret === 'disabled'){
        return true
    } else if(ret === ""){
        return true
    } else if(reBool.test(ret)){
        return ret === 'true'
    } else if(/^\d{1,}$/.test(ret)){
        return ~~ret
    }

    return ret
}
