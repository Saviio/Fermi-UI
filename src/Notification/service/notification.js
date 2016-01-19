import { dependencies } from '../../external/dependencies'
import { DOM, BODY } from '../../utils/browser'
import container from '../template/container.html'
import defaultMessage from '../template/message.html'

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

let compile = null
let rootScope = null
//let compiledTmpl = 

//custom(tmpl, scope){} 实现自定义模板
//close 函数？
//remark DOM leak

@dependencies('$compile', '$rootScope')
export default class Notification{
    constructor($compile, $rootScope){
        this._rendered = false
        this._container = null
        compile = $compile
        rootScope = $rootScope
    }

    __dispose__(){
        if(this._body::queryAll('div').length > 0) return
        this._container::remove()
        this._rendered = false
        this._container = this._body = null
    }

    __tryRender__(){
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

    __remove__(notificationNode, callback){
        if(!notificationNode::inDoc()) return
        notificationNode
                ::removeClass(`fm-notice-show`)
                ::onMotionEnd(() => {
                    notificationNode::remove()
                    this.__dispose__()
                })
        if(typeof callback === 'function'){
            callback()
        }
    }


    send(option){
        if(!/default|normal|success|warn|error/.test(option.type)){
            throw new Error(`
                    Message Type is not a valid value, it should be one of following values: [default, normal, success, warn, error].`)
            return
        }

        this.__tryRender__()
        let cancellId
        let scope = rootScope.$new()

        scope.message = option.message || ''
        scope.topic = option.topic || ''
        scope.type = option.type
        scope.callback = option.callback ? option.callback : null
        scope.destory = e => {
            if(cancellId !== undefined) clearTimeout(cancellId)
            this.__remove__(e.target.parentNode, scope.callback)
            scope.$destroy()
        }

        let content = compile(defaultMessage)(scope)[0]
        let notification = this._body::prepend(content)
        setTimeout(() => notification::addClass('fm-notice-show'), 50)

        if(option.duration !== null && option.duration !== 0){
            let duration = option.duration || this.__getConfig__('duration')
            cancellId = setTimeout(() => {
                this.__remove__(notification, scope.callback)
            }, duration * 1000)
        }
    }

    config(option){
        if(this.customConfig === undefined){
            this.customConfig = option
            Object.freeze(this.customConfig)
        }
    }

    normal(message = '', topic = ''){
        return this.send({
            message,
            topic,
            type:'normal'
        })
    }

    success(message = '', topic = ''){
        return this.send({
            message,
            topic,
            type:'success'
        })
    }

    warn(message = '', topic = ''){
        return this.send({
            message,
            topic,
            type:'warn'
        })
    }

    error(message = '', topic = ''){
        return this.send({
            message,
            topic,
            type:'error'
        })
    }

    default(message = '', topic = ''){
        return this.send({
            message,
            topic,
            type:'default'
        })
    }
}
