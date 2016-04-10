
export function noop(){}

export function is(v1, v2){
    if(this !== undefined){
        [v1, v2] = [this, v1]
    }

    if(!Object.is){
        if (v1 === 0 && v2 === 0) return 1 / v1 === 1 / v2
        if (v1 !== v1) return v2 !== v2
        return v1 === v2
    } else {
        return Object.is(v1, v2)
    }
}


let _FMId = 1
export function nextFid(){
    _FMId++
    let id = _FMId.toString().split('')
    let len = id.length
    for(let i = 0; i < (5 - len); i++) id.unshift("0")
    return id.join('.').toString()
}

export function nextId(){
    return _FMId++
}

export function nextUid(){
   return '_F' + ("0000" + (Math.random() * Math.pow(36,6) << 0).toString(36)).slice(-6) + nextId()
}

export function clamp(val, min, max){
    return val < min ? min : (val > max ? max : val)
}

export function range(size, start = 0){
    let arr = []
    for(let i = start; i <= size; i++) arr.push(i)
    return arr
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


export function trim(str){
    if(arguments.length === 0) str = this
    return str.replace(/^\s+|\s+$/g, '')
}


export function isPromise(obj){
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
}


export function getType(obj){
    if(arguments.length === 0) obj = this
    return Object.prototype.toString.call(obj).replace(/^\[object (\w+)\]$/,'$1')
}

export function escapeHTML(str){
    return str.replace(/&/g,"&amp;")
              .replace(/</g,"&lt;")
              .replace(/>/g,"&gt;")
              .replace(/"/g,"&#34;")
              .replace(/'/g,"&#39;")
}
