import { dependencies } from '../../external/dependencies'
import { DOM as dom } from '../../utils/browser'
import template from '../template/template.html'
import popoverTmpl from '../template/popover.html'
import {
    on,
    toDOM,
    query,
    props,
    prepend,
    nextUid,
    isHidden,
    setStyle,
    getStyle,
    getCoords,
    escapeHTML,
    createElem,
    forceReflow,
    getDOMState,
    removeStyle
} from '../../utils'
 import { transition } from '../../utils/transition'

const reEvent = /click|hover|focus|manual/
const reAutoHide = /auto|true/i
const reDirection = /top|bottom|left|right/
const reOffset =  /^\d{1,}$/

const unSupportedDirection = 'Popover direction is not in announced list [top,bottom,left,right].'
const unSupportedEvent = 'Event is not supported, it should one of the following values: [click, hover, focus, manual].'
const noTriggerSpecified = 'No trigger element was binded for popover component.'
const noTriggerFound = 'Trigger element cannot be found in component scope.'

//add disable function
export default class Popover{
    constructor(){
        this.restrict = 'EA'
        this.replace = true
        this.scope = {
            title:'@',
            manual:'='
        }
        this.transclude = true
        this.template = template
    }

    compile($tElement, tAttrs, transclude){
        let dire = (tAttrs.placement || "top").toLowerCase()
        if(!reDirection.test(dire)) throw Error(unSupportedDirection)

        let tmpl = popoverTmpl.replace(/#{dire}/, dire)::toDOM()
        if($tElement::props('close')){
            tmpl::prepend('<button class="fm-close" ng-click="close()">×</button>')
        }

        $tElement.append(tmpl)
        if(tAttrs.trigger == undefined) throw new Error(noTriggerSpecified)

        return this.link
    }

    @dependencies('$scope')
    controller(scope){
        scope.open = () => this.popoverTrans.state = true
        scope.close = () => this.popoverTrans.state = false
        scope.toggle = () => this.popoverTrans.state ? scope.close() : scope.open()
    }

    link(scope, $element, attr, ctrl){
        this.rootDOM = $element[0]
        let popoverElem = this.rootDOM::query('.fm-popover')
        let trigger = this.rootDOM::query(attr.trigger)

        if(trigger === undefined) throw new Error(noTriggerFound)

        this.rootDOM::prepend(trigger)
        this.placement = attr.placement.toLowerCase()
        this.triggerLiteral = attr.trigger

        let actived = $element::props('actived')
        let offset = $element::props('offset')
        let event = attr.action || 'click'

        if(!reEvent.test(event)){
            throw new Error(unSupportedEvent)
        } else if(event === 'hover'){
            event = 'mouseenter'
        } else if(event === 'manual'){
            scope.manual = {
                open:scope.open,
                close:scope.close
            }
        }

        if(reAutoHide.test(attr.hide)){
            let expr = event === 'mouseenter' ? 'mouseleave' : 'blur'
            trigger::on(expr, ::scope.close)
        }

        if(event !== 'manual'){
            trigger::on(event, ::scope.toggle)
        }

        this.offset = reOffset.test(offset) ? offset : 5
        this.title = attr.title
        this.popoverTrans = new transition(popoverElem, 'fm-popover-effect', actived)

        let arrowColor = attr.arrow || null

        setTimeout(() => {
            let init = false

            if(isHidden(popoverElem)){
                let display = 'block', opacity = 1, transform = 'scale(1)'
                popoverElem::setStyle({ display, opacity, transform })
                popoverElem::forceReflow()
                init = true
            }

            let trig = {
                height:trigger::getStyle('height','px'),
                width:trigger::getStyle('width','px')
            }

            let popover = {
                height:popoverElem::getStyle('height','px'),
                width:popoverElem::getStyle('width','px')
            }

            let left , top
            switch (this.placement) {
                case 'top':
                    left = `${-popover.width / 2 + trig.width / 2}px`
                    top = `${-popover.height + (-10) + (-this.offset)}px`
                    break
                case 'bottom':
                    left = `${-popover.width / 2 + trig.width / 2}px`
                    top = `${trig.height + 10 + this.offset}px`
                    break
                case 'left':
                    left = `${-popover.width + (-10) + (-this.offset)}px`
                    top = `${trig.height / 2 - popover.height / 2}px`
                    break
                case 'right':
                    left = `${trig.width + 10 + this.offset}px`
                    top = `${trig.height / 2 - popover.height / 2}px`
                    break
                default:
                    return
            }

            popoverElem::setStyle({ left, top})
            if(init){
                let display, opacity, transform
                popoverElem::removeStyle({ display, opacity, transform })
            }
            this.reColor(arrowColor)
        }, 0)
    }

    //auto calc arrow color
    reColor(color){
        let dire = this.placement
        let trigger = this.triggerLiteral
        if(color === null){
            let selector = dire === 'bottom' && this.title
            ? '+.fm-popover > .fm-popover-title'
            : '+.fm-popover > .fm-popover-content > *'

            let popoverMainElem = this.rootDOM::query(trigger + selector)
            color = popoverMainElem::getStyle('background-color')
        }

        let style = dom::query('#__arrowColor__')

        if(style === null){
            style = createElem('style')
            style.id = '__arrowColor__'
            dom::query('head').appendChild(style)
        }

        let triggerBtn = this.rootDOM::query(trigger)
        let uid = nextUid()
        triggerBtn.setAttribute(uid, '')

        let css = `
            ${escapeHTML(trigger)}[${uid}] + div.fm-popover > .fm-popover-arrow:after{
                border-${escapeHTML(dire)}-color:${color};
            }
        `
        style.innerHTML += css
    }
}
