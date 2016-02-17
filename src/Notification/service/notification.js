import { dependencies } from '../../external/dependencies'
import { BODY as body } from '../../utils/browser'
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
let reType = /default|normal|success|warn|error/
let errTypeMessage = `Message Type is not a valid value, it should be set from one of following values: [default, normal, success, warn, error].`


//custom(tmpl, scope){} 实现自定义模板
//close 函数？
//remark DOM leak check

@dependencies('$compile', '$rootScope')
export default class Notification{
    constructor($compile, $rootScope){
        this._rendered = false
        this._container = null
        this._config = defaultConfig

        compile = $compile
        rootScope = $rootScope
    }

    __tryDispose__(){
        if(this._body::queryAll('div').length > 0) return
        this._container::remove()
        this._rendered = false
        this._container = this._body = null
    }

    __tryRender__(){
        if(this._rendered) return
        this._container = body::last(container)
        this._body = this._container::query('div')
        this._container::setStyle({
            top:this._config.top,
            right:this._config.right
        })
        this._rendered = true
    }

    __remove__(notificationNode, callback){
        if(!notificationNode::inDoc()) return
        notificationNode
                ::removeClass(`fm-notice-show`)
                ::onMotionEnd(() => {
                    notificationNode::remove()
                    this.__tryDispose__()
                })
        if(typeof callback === 'function'){
            callback()
        }
    }


    send(option){
        if(!reType.test(option.type)){
            throw new Error(errTypeMessage)
            return
        }

        this.__tryRender__()
        let cancellId
        let scope = rootScope.$new()

        scope.message = option.message || ''
        scope.topic = option.topic || ''
        scope.type = option.type
        scope.callback = option.callback ? option.callback : null
        scope.close = e => {
            if(cancellId !== undefined) clearTimeout(cancellId)
            this.__remove__(e.target.parentNode, scope.callback)
            scope.$destroy()
        }

        let content = compile(defaultMessage)(scope)[0]
        let notification = this._body::prepend(content)
        setTimeout(() => notification::addClass('fm-notice-show'), 50)

        if(option.duration !== null && option.duration !== 0){
            let duration = option.duration || this._config.duration
            cancellId = setTimeout(() => {
                this.__remove__(notification, scope.callback)
            }, duration * 1000)
        }
    }

    config(config){
        this._config = Object.assign({}, this._config, config)
        Object.freeze(this._config)
    }

    normal(message = '', topic = ''){
        return this.send({message, topic, type:'normal'})
    }

    success(message = '', topic = ''){
        return this.send({message, topic, type:'success'})
    }

    warn(message = '', topic = ''){
        return this.send({message, topic, type:'warn'})
    }

    error(message = '', topic = ''){
        return this.send({message, topic, type:'error'})
    }

    default(message = '', topic = ''){
        return this.send({message, topic, type:'default'})
    }
}
