import template from '../template/loading.html'
import { DOM as dom, BODY as body} from '../../utils/browser'
import { onMotionEnd } from '../../utils/transition'
import {
    last,
    clamp,
    query,
    queue,
    setStyle,
    addClass,
    createElem
} from '../../utils'


let q = queue()

export default class Loading{
    constructor(){
        this.status = null
        this.speed = 200
        this.instance = null
        this.rate = 700
    }

    __tryDispose__(){
        if(this.instance !== null){
            this.instance = this.status = null
            body.removeChild(dom::query('#progress-loading-elem'))
        }
    }

    __tryRender__(fromZero = true){
        if(this.instance !== null) return this.instance
        body::last(template)

        let ins = dom::query('#progress-loading-elem')
        if(ins !== null){
            ins::setStyle({
                transition: `width ${this.speed}ms ease-out, opacity ${this.speed}ms linear`,
                width:`${fromZero ? 0 : (this.status || 0) * 100}%`
            })

            this.instance = ins
            return this.instance
        }
    }

    start(){
        if (!this.status) this.set(0)

        let exec = () => {
            setTimeout(() => {
                if (!this.status) return
                this.inc(Math.random() * 0.1)
                exec()
            }, this.rate)
        }

        exec()
        return this
    }

    set(n){
        let started = typeof this.status === 'number'
        n = !started ?  0.01 : clamp(n, 0.05, 1)
        this.status = (n >= 1 ? null : n)
        this.__tryRender__(!started)

        q(next => {
            this.instance::setStyle({
                'width':`${n * 100}%`
            })

            if (n >= 1) {
                setTimeout(() => {
                    this.instance
                        ::addClass('fm-progress-loading-disappear')
                        ::onMotionEnd(() => {
                            this.__tryDispose__()
                            next()
                        }, 'fm-progress-loading-disappear')
                }, this.speed)
            } else {
                setTimeout(next, this.speed)
            }
        })
        return this
    }

    inc(amount = (1 - n) * Math.random() * n){
        let n = this.status
        return !n ? this.start() : this.set(clamp(n + amount, 0.1, 0.99))
    }

    done(){
        if(this.instance) this.set(1)
    }
}
