let testElem = document.createElement('div')
let prefix = null
let eventPrefix = null

export function noop(){}

export function getCoords(el){
    if(el === undefined) el = this
    if(!isDOM(el)) return

    let box = el.getBoundingClientRect(),
    self= window,
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


export function getStyle(el, name, removeUnit = ""){
    if(typeof el === "string") [el, name, removeUnit] = [this, el, name === undefined ? "" : name]
    if(!isDOM(el)) return

    var style = window.getComputedStyle ? window.getComputedStyle(el, null)[name] : el.currentStyle[name]

    if((name === 'width' || name === 'height') && style === 'auto'){
        if(name == 'width') style = el.offsetWidth
        else if(name == 'height') style = el.offsetHeight
    }

    if(removeUnit !== "") style = ~~style.replace(new RegExp(removeUnit),"")

    return style
}

export function escapeHTML(str){
    return str.replace(/&/g,"&amp;")
              .replace(/</g,"&lt;")
              .replace(/>/g,"&gt;")
              .replace(/ /g,"&nbsp;")
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
    } else if(/true|false/i.test(ret)){
        return !!v
    } else if(/^\d{1,}$/.test(ret)){
        return ~~v
    }

    return ret
}

export function addClass(el, cls){
    if(typeof el === 'string') [el, cls] = [this, el]
    if(!isDOM(el)) return

    if (el.classList) {
        el.classList.add(cls)
    } else {
        let cur = ' ' + (el.getAttribute('class') || '') + ' '
        if (cur.indexOf(' ' + cls + ' ') < 0) {
            el.setAttribute('class', (cur + cls).trim())
        }
    }
}

export function removeClass(el, cls){
    if(typeof el === 'string') [el, cls] = [this, el]
    if(!isDOM(el)) return


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
    target.parentNode.insertBefore(el, target)
    return el
}

export function after(el, target) {
    if(arguments.length === 1) [el, target] = [this, el]
    return target.nextSibling ? before(el, target.nextSibling) : target.parentNode.appendChild(el), el
}

export function prepend(target, el){
    if(arguments.length === 1) [target, el] = [this, target]

    if(typeof el === 'string'){
        let dom = createElem('div')
        dom.innerHTML = el
        el = dom.firstChild
    }

    return target.firstChild ? el::before(target.firstChild) : target.appendChild(el), el
}

export function remove(el){
    if(arguments.length === 0) [el] = [this]
    el.parentNode.removeChild(el)
}

export function replace(target, el){
    if(arguments.length === 1) [target, el] = [this, target]
    if(typeof el === 'string'){
        let dom = createElem('div')
        dom.innerHTML = el
        el = dom.firstChild
    }

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
    let isNgElement = false
    if(typeof el === 'function') [el, cb] = [this, el]
    if(!isDOM(el) && !(el instanceof angular.element)) return
    if(el instanceof angular.element) el = el[0]

    let {prefix, eventPrefix} = detechPrefix()

    let handler = (e) => {
        //debugger
        if(e.target === el){
            el::off(eventPrefix+'TransitionEnd', handler)
            el::off('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', handler)
            cb()
        }
    }
    //debugger
    el::on(eventPrefix + 'TransitionEnd', handler)
    el::on('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', handler)
    return el
}

export function debounce(func, wait){
    let timeout, args, context, timestamp, result
    let later = () => {
        let last = Date.now() - timestamp
        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last)
        } else {
            timeout = null
            result = func.apply(context, args)
            if (!timeout) context = args = null
        }
    }

    return function() {
        context = this
        args = arguments
        timestamp = Date.now()
        if (!timeout)  timeout = setTimeout(later, wait)
        return result
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

export function getType(){
    return Object.prototype.toString.call(this).replace(/^\[object (\w+)\]$/,'$1')
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

let $FMId = 1
export function generateFermiId(){
    let id = $FMId.toString().split('')
    let len = id.length
    for(let i = 0; i < (5 - len); i++){
        id.unshift("0")
    }
    $FMId++
    return id.join('.')
}


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
}*/
