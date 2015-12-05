let testElem = document.createElement('div')
let prefix = null
let eventPrefix = null

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
    if(typeof el === "string") removeUnit = name === undefined ? "" : name, name = el, el = this
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
    let attr = null

    if(typeof el === 'string') key = el, el = this
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
    if(typeof el === 'string') cls = el, el = this
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
    if(typeof el === 'string') cls = el, el = this
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

export function on (el, event, cb) {
    if(typeof el === 'string') cb = event, event = el, el = this
    if(!isDOM(el)) return
    let evts = event.split(' ')
    while (evts.length){
        el.addEventListener(evts.pop(), cb)
    }
}

export function off(el, event, cb){
    if(typeof el === 'string') cb = event, event = el, el = this
    if(!isDOM(el)) return
    let evts = event.split(' ')
    while (evts.length){
        el.removeEventListener(evts.pop(), cb)
    }
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
    if(typeof el === 'function') cb = el, el = this
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

export function querySingle(el){
    if (typeof el === 'string') {
        let selector = el
        el = document.querySelector(el)
    }
    return el
}

export function createElem(tag){
    return document.createElement(tag)
}
