let testElem = document.createElement('div')
let prefix = null
let eventPrefix = null
let reUnit = /width|height|top|left|right|bottom|margin|padding/i
let reBool = /true|false/i

export function noop(){}

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

    if((name === 'width' || name === 'height') && style === 'auto'){
        if(name == 'width') style = el.offsetWidth
        else if(name == 'height') style = el.offsetHeight
    }

    if(removedUnit !== "" && getType(style) === 'String') {
        style = ~~style.replace(new RegExp(removedUnit), "")
    }

    return style
}

export function escapeHTML(str){
    return str.replace(/&/g,"&amp;")
              .replace(/</g,"&lt;")
              .replace(/>/g,"&gt;")
              .replace(/"/g,"&#34;")
              .replace(/'/g,"&#39;")
}

export function getDOMState(el, key){
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
    } else if(ret === ""){
        return true
    } else if(reBool.test(ret)){
        return ret === 'true'
    } else if(/^\d{1,}$/.test(ret)){
        return ~~ret
    }

    return ret
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

export function before(el, target) {
    if(arguments.length === 1) [el, target] = [this, el]
    el = toDOM(el)
    target.parentNode.insertBefore(el, target)
    return el
}

export function after(el, target) {
    if(arguments.length === 1) [el, target] = [this, el]
    el = toDOM(el)
    return el.nextSibling ? before(target,el.nextSibling) : el.parentNode.appendChild(target), target
}

export function prepend(target, el){
    if(arguments.length === 1) [target, el] = [this, target]
    el = toDOM(el)
    return target.firstChild ? el::before(target.firstChild) : target.appendChild(el), el
}

export function last(target, el){
    if(arguments.length === 1) [target, el] = [this, target]
    el = toDOM(el)
    return target.length > 0 ? el::after(target.lastChild) : target.appendChild(el), el
}

export function remove(el){
    if(arguments.length === 0) [el] = [this]
    el.parentNode.removeChild(el)
}

export function replace(target, el){
    if(arguments.length === 1) [target, el] = [this, target]
    el = toDOM(el)

    let parent = target.parentNode
    if(parent){
        parent.replaceChild(el, target)
    }
    return el
}

export function isDOM(el){
    if (el.nodeType && el.nodeName) return true
    return false
}

export function toDOM(el){ //remark 支持多个元素 类似<span>123</span><div>321</div>  用fragment?
    if(arguments.length === 0) el = this
    if(typeof el === 'string'){
        el = trim(el)
        let dom = createElem('div')
        dom.innerHTML = el
        el = dom.firstChild
    }

    return el
}

/*
function fragmentFromString(strHTML) {
    var temp = document.createElement('template');
    temp.innerHTML = strHTML;
    return temp.content;
}
*/

export function detechPrefix(){
    if(prefix !== null && eventPrefix !== null) return { prefix, eventPrefix }

    let vendor = { Webkit: 'webkit', Moz: '', O: 'o' }

    for(var i in vendor){
        if (testElem.style[i + 'TransitionProperty'] !== undefined) {
            prefix = '-' + i.toLowerCase() + '-'
            eventPrefix = vendor[i]
            return { prefix, eventPrefix }
        }
    }

    prefix = eventPrefix = ""
    return { prefix, eventPrefix }
}

export function onMotionEnd(el, cb){
    if(typeof el === 'function') [el, cb] = [this, el]
    if(!isDOM(el) && !(el instanceof angular.element)) return
    if(el instanceof angular.element) el = el[0]

    let {prefix, eventPrefix} = detechPrefix()

    let handler = e => { //remark
        if(e && e.target === el){
            el::off(eventPrefix + 'TransitionEnd', handler)
            el::off('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', handler)
            cb()
        }
    }
    el::on(eventPrefix + 'TransitionEnd', handler)
    el::on('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', handler)
    return el
}

export function debounce(func, wait){
    let timeout, args, ctx, timestamp, ret
    let later = () => {
        let last = Date.now() - timestamp
        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last)
        } else {
            timeout = null
            ret = func.apply(ctx, args)
            if (!timeout) ctx = args = null
        }
    }

    return function() {
        ctx = this
        args = arguments
        timestamp = Date.now()
        if (!timeout)  timeout = setTimeout(later, wait)
        return ret
    }
}

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

export function getType(obj){
    if(arguments.length === 0) obj = this
    return Object.prototype.toString.call(obj).replace(/^\[object (\w+)\]$/,'$1')
}

export function is(v1, v2){
    if(this !== undefined){
        [v1, v2] = [this, v1]
    }

    if(!Object.is){
        if (v1 === 0 && v2 === 0) {
            return 1 / v1 === 1 / v2
        }

        if (v1 !== v1) {
            return v2 !== v2
        }

        return v1 === v2
    } else {
        return Object.is(v1, v2)
    }
}

let _FMId = 1
export function generateFermiId(){
    let id = _FMId.toString().split('')
    let len = id.length
    for(let i = 0; i < (5 - len); i++) id.unshift("0")
    _FMId++
    return id.join('.')
}

export function nextId(){
    return _FMId++
}

export function clamp(val, min, max){
    return val < min ? min : (val > max ? max : val)
}

export function def(obj, key, option){
    Object.defineProperty(obj, key, option)
}

export function inDoc(el) {
    if(arguments.length === 0) el = this
    let doc = document.documentElement
    let parent = el && el.parentNode
    return doc === el || doc === parent || !!(parent && parent.nodeType === 1 && (doc.contains(parent)))
}

export function range(size, start = 0){
    let arr = []
    for(let i = start; i <= size; i++) arr.push(i)
    return arr
}

export function generateUID(){
   return '_F' + ("0000" + (Math.random() * Math.pow(36,6) << 0).toString(36)).slice(-6) + nextId()
}


export function queue(isAsync = false, interval = 0){
    let waiting = []

    let next = () => {
        let fn = waiting.shift()
        if(fn){
            isAsync
            ? setTimeout(() => fn(next), interval)
            : fn(next)
        }
    }

    let entry = fn => {
        waiting.push(fn)
        if (waiting.length === 1) next()
    }

    entry.count = () => waiting.length
    return entry
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
            originStyle[key.trim()] = value.trim()
        }
    })

    let newStyle = {}
    Object.keys(styles).forEach(key => {
        let value = styles[key]
        if(reUnit.test(styles[key])) value += 'px'
        newStyle[key] = value
    })

    let mergedStyle = Object.assign({}, oldStyle, newStyle)
    let styleText = Object.keys(mergedStyle).map(key => key + ': ' + mergedStyle[key] + ';').join(' ')
    if(hasCSSText){
        el.style.cssText = styleText
    } else {
        el.setAttribute('style', styleText)
    }
}

export function trim(str){
    if(arguments.length === 0) str = this
    return str.replace(/^\s+|\s+$/g, '')
}

export function isPromise(obj){
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
}


export function props(el, key){//remark
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
    } else if(ret === ""){
        return true
    } else if(reBool.test(ret)){
        return ret === 'true'
    } else if(/^\d{1,}$/.test(ret)){
        return ~~ret
    }

    return ret
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
