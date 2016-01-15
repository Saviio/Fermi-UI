import { DOM, BODY } from '../../utils/browser'
import container from '../template/container.html'
import defaultMessage from '../template/default.html'


import{
    on,
    last,
    after,
    query,
    inDoc,
    remove,
    prepend,
    setStyle,
    queryAll,
    addClass,
    removeClass,
    onMotionEnd
} from '../../utils'

let defaultConfig = {
    top:'25px',
    right:'0px',
    duration:4.5
}

//callback
//default
//params
export default class Notification{
    constructor(){
        this._rendered = false
        this._container = null
    }

    __dispose__(){
        if(this._body::queryAll('div').length > 0) return
        this._container::remove()
        this._rendered = false
        this._container = this._body = null
    }

    __render__(){
        if(this._rendered) return
        this._container = BODY::last(container)
        this._body = this._container::query('div')
        this._container::setStyle({
            top:this.__getConfig__('top'),
            right:this.__getConfig__('right')
        })
        this._rendered = true
    }

    __getConfig__(key){
        return (this.customConfig || defaultConfig)[key] || defaultConfig[key]
    }

    send(message, type = 'normal', autoClose = true){
        this.__render__()
        let notification = this._body::prepend(defaultMessage)
        let icon = notification::query('i')
        let closeBtn = notification::query('.fm-close')
        notification::query('.fm-notice-content').innerText = message
        notification::addClass(`fm-noticeStatus-${type}`)
        icon::addClass(`icon-${type}`)
        setTimeout(() => notification::addClass('fm-notice-show'), 50)

        let destory = () => {
            if(!notification::inDoc()) return
            notification
                    ::removeClass(`fm-notice-show`)
                    ::onMotionEnd(() => {
                        notification::remove()
                        this.__dispose__()
                    })
        }

        let cancellId
        let duration = this.__getConfig__('duration')
        if(autoClose){
            cancellId = setTimeout(destory, duration * 1000)
        }

        closeBtn::on('click', e => {
            if(cancellId !== undefined) clearTimeout(cancellId)
            destory()
        })
    }

    config(option){
        if(this.customConfig === undefined){
            this.customConfig = option
            Object.frezz(this.customConfig)
        }
    }

    normal(){}
    success(){}
    warn(){}
    error(){}
    default(){}
}
