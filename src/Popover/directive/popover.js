import { dependencies } from '../../external/dependencies'
import { DOM } from '../../utils/browser'
import template from '../template/template.html'
import popoverTmpl from '../template/popover.html'
import {
    nextUid,
    isHidden,
    getDOMState,
    getStyle,
    escapeHTML,
    getCoords,
    query,
    props,
    createElem,
    prepend,
    toDOM,
    on
} from '../../utils'



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
        if(["top","bottom","left","right"].indexOf(dire) === -1){
            throw Error("Popover direction is not in announced list [top,bottom,left,right].")
        }

        let tmpl = popoverTmpl.replace(/#{dire}/, dire)::toDOM()
        if($tElement::props('close')){
            tmpl::prepend('<button class="fm-close">×</button>')
        }

        $tElement.append(tmpl)
        if(tAttrs.trigger == undefined){
            throw new Error("No trigger element was binded for popover component.")
        }

        return this.link
    }

    @dependencies('$scope')
    controller(scope){
        scope.open = () => {
            if(scope.isOpen === false){
                scope.isOpen = !scope.isOpen
                scope.$layer.removeClass('pop-disappear-animation')
            }
        }

        scope.close = (force = false) => {
            if(force) scope.isOpen = false
            else if(scope.isOpen !== false) scope.isOpen = !scope.isOpen
            scope.$layer.addClass('pop-disappear-animation')
        }

        scope.toggle = () => scope.isOpen ? scope.close() : scope.open()
    }

    link(scope, $element, attr, ctrl){
        this.rootDOM = $element[0]
        let layerElem = this.rootDOM::query('.popover')
        let trigger = this.rootDOM::query(attr.trigger)

        if(trigger === undefined){
            throw new Error("trigger element cannot be finded in component scope.")
        }

        this.rootDOM::prepend(trigger)
        this.placement = attr.placement.toLowerCase()
        this.triggerLiteral = attr.trigger
        let $ngLayer = angular.element(layerElem)


        var setLocation = () => {
            let offset = scope.offset

            let triggerBtn = {
                height:trigger::getStyle('height','px'),
                width:trigger::getStyle('width','px')
            }

            let layer = {
                height:layerElem::getStyle('height','px'),
                width:layerElem::getStyle('width','px')
            }

            let left , top
            switch (this.placement) {
                case 'top':
                    left = `${-layer.width / 2 + triggerBtn.width / 2}px`
                    top = `${-layer.height + (-10) + (-offset)}px`
                    break
                case 'bottom':
                    left = `${-layer.width / 2 + triggerBtn.width / 2}px`
                    top = `${triggerBtn.height + 10 + offset}px`
                    break
                case 'left':
                    left = `${-layer.width + (-10) + (-offset)}px`
                    top = `${triggerBtn.height / 2 - layer.height / 2}px`
                    break
                case 'right':
                    left = `${triggerBtn.width + 10 + offset}px`
                    top = `${triggerBtn.height / 2 - layer.height / 2}px`
                    break
                default:
                    return
            }

            $ngLayer.css({ left, top })
        }

        scope.$layer = $ngLayer


        let actived = $element::props('actived')
        let offset = $element::props('offset')
        let hasClose = $element::props('close')
        let event = attr.action || 'click'

        if(!/click|hover|focus|manual/.test(event)){
            throw new Error("Event is not supported, it should one of the following values: [click, hover, focus, manual]")
        } else if(event === 'hover'){
            event = 'mouseenter'
        } else if(event === 'manual'){
            scope.manual = {
                open:scope.open.bind(scope),
                close:scope.close.bind(scope)
            }
        }

        scope.offset = /^\d{1,}$/.test(offset) ? offset : 5
        scope.isOpen = actived


        if(/auto|true/i.test(attr.hide)){
            trigger::on(event === 'mouseenter'
                ? 'mouseleave'
                : 'blur', () => scope.close(true))
        }

        if(event !== 'manual'){
            trigger::on(event, () => {
                if(!scope.isOpen) setLocation() //优化
                scope.toggle()
            })
        }


        if(!actived) scope.close(true)

        if(hasClose){
            let closeBtn = this.rootDOM::query('.popover > .fm-close')
            closeBtn::on('click', () => scope.close(true))
        }

        let arrowColor = attr.arrow || null
        this.title = attr.title

        setTimeout(() => {
            setLocation()
            setTimeout(() =>
                this.reColor(arrowColor), 0)
        }, 0)
    }

    //auto calc arrow color
    reColor(color){
        let dire = this.placement
        let trigger = this.triggerLiteral
        if(color === null){
            let selector = dire === 'bottom' && this.title
            ? "+.popover > .popover-title"
            : "+.popover > .popover-content > *"

            let dom = this.rootDOM::query(trigger + selector)
            color = dom::getStyle('background-color')
        }

        let style = DOM::query('#__arrowColor__')

        if(style === null){
            style = createElem('style')
            style.id = "__arrowColor__"
            DOM::query('head').appendChild(style)
        }

        let triggerBtn = this.rootDOM::query(trigger)
        let uid = nextUid()
        triggerBtn.setAttribute(uid, '')

        let css = `
            ${escapeHTML(trigger)}[${uid}] + div.popover > .popover-arrow:after{
                border-${escapeHTML(dire)}-color:${color};
            }
        `
        style.innerHTML += css
    }
}
