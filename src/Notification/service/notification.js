import { DOM, BODY } from '../../utils/browser'
import container from '../template/container.html'
import defaultMessage from '../template/default.html'


import{
    after,
    last,
    prepend,
    query,
    setStyle,
    addClass,
    onMotionEnd
} from '../../utils'

let defaultConfig = {
    top:'25px',
    right:'0px',
    duration:4.5
}

export default class Notification{
    constructor(){
        this.$rendered = false
        this.$container = null
    }

    __dispose__(){
        this.$rendered = false
        this.$container = this.$body = null
    }

    __render__(){
        if(this.$render) return
        this.$container = BODY::prepend(container)
        this.$body = this.$container::query('div')
        this.$container::setStyle({
            top:this.getConfig().top,
            right:this.getConfig().right
        })
        this.$render = true
    }

    send(message, type = 'normal'){
        this.__render__()
        let notification = this.$body::last(defaultMessage)
        let status = notification::query('i')
        notification::addClass(`fermi-noticeStatus-${type}`)
        status::addClass(`icon-${type}`)
        setTimeout(() => notification::addClass('fermi-notice-show'), 10)
    }

    config(option){
        if(this.customConfig === undefined){
            this.customConfig = option
            Object.defineProperty(this,'customConfiguration',{
                value:option,
                enumerable:false,
                configurable:false,
                writable:false
            })
        }
    }

    getConfig(){
        return this.customConfig || defaultConfig
    }
}
