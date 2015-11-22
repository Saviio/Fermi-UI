import template from '../template/loading.html'

let clamp = (n, min, max) => {
    if (n < min) return min
    if (n > max) return max
    return n
}

let queue = (function() {
    let waiting = []

    let next = () => {
        let fn = waiting.shift()
        if(fn) fn(next)
    }

    return (fn) => {
        waiting.push(fn)
        if (waiting.length === 1) next()
    }
})()

export default class Loading{

    constructor(){
        this.status = null
        this.speed = 200
        this.instance = null
        this.rate = 700
    }

    __dispose__(){
        if(this.instance !== null){
            this.instance = this.status = null
            document.body.removeChild(document.querySelector('#progress-loading-elem'))
        }
    }

    __render__(fromZero){
        if(this.instance !== null)
            return this.instance

        if(document.body.insertAdjacentHTML){
            document.body.insertAdjacentHTML('beforeEnd',template)
        } else {
            let div = document.createElement('div')
            div.innerHTML = template
            document.body.appendChild(div.firstChild)
        }

        let ins = document.querySelector('#progress-loading-elem')
        if(ins !== null){
            this.instance = angular.element(ins)
            this.instance.css('width',`${fromZero ? 0 : (this.status || 0) * 100}%`)
            this.instance.css('transition',`width ${this.speed}ms ease-out, opacity ${this.speed}ms linear`)
            ins.offsetWidth
            return this.instance
        }
    }

    start(){
        if (!this.status)
            this.set(0)

        let exec = () => {
            setTimeout(() => {
                if (!this.status) return
                this.inc(Math.random() * 0.1)
                exec()
            }, this.rate)
        }

        exec()
    }

    set(n){
        let started = typeof this.status === 'number'
        n = !started ?  0.01 : clamp(n, 0.05, 1)
        this.status = (n >= 1 ? null : n)
        this.__render__(!started)

        queue((next) => {
            this.instance.css('width',`${n * 100}%`)

            if (n >= 1) {
                setTimeout(() => {
                    this.instance.addClass('disappear')
                    setTimeout(() => {
                        this.__dispose__()
                        next()
                    }, this.speed)
                }, this.speed)
            } else {
                setTimeout(next, this.speed)
            }
        })
    }

    inc(amount = (1 - n) * Math.random() * n){
        let n = this.status
        return !n ? this.start() : this.set(clamp(n + amount, 0.1, 0.99))
    }

    done(){
        if(this.instance)
            this.set(1)
    }
}
