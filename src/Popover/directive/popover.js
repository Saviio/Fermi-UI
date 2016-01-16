import template from '../template/template.html'
import popoverTmpl from '../template/popover.html'
import {
    getDOMState,
    getStyle,
    escapeHTML,
    getCoords,
    query,
    createElem,
    prepend,
    toDOM,
    on
} from '../../utils'

import { DOM } from '../../utils/browser'


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
        this.controller.$inject = ['$scope']
    }

    controller(scope, $elem){
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

        scope.toggle = () => {
            if (scope.isOpen) scope.close()
            else scope.open()
        }
    }

    link(scope, $element, attr, ctrl){
        //("Popover component can only support for single element."
        let rootDOM = $element[0]
        let layerElem = rootDOM::query('.popover')
        let trigger = rootDOM::query(attr.trigger)


        if(trigger === undefined){
            throw new Error("trigger element cannot be finded in component scope.")
        }

        rootDOM::prepend(trigger)
        let $ngLayer = angular.element(layerElem)
        let placement = attr.placement.toLowerCase()

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

            let left,top
            switch (placement) {
                case 'top':
                    left = `${-layer.width/2+triggerBtn.width/2}px`
                    top = `${-layer.height+(-10)+(-offset)}px`
                    break
                case 'bottom':
                    left = `${-layer.width/2+triggerBtn.width/2}px`
                    top = `${triggerBtn.height+10+offset}px`
                    break
                case 'left':
                    left = `${-layer.width+(-10)+(-offset)}px`
                    top = `${triggerBtn.height/2-layer.height/2}px`
                    break
                case 'right':
                    left = `${triggerBtn.width+10+offset}px`
                    top = `${triggerBtn.height/2-layer.height/2}px`
                    break
                default:
                    return
            }

            $ngLayer.css({left,top})
        }

        scope.$layer = $ngLayer

        let init = () => {
            let actived = $element::getDOMState('actived')
            let offset = $element::getDOMState('offset')
            let hasClose = $element::getDOMState('close')
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


            if(/auto|true/.test(attr.hide)){
                trigger::on(event === 'mouseenter'
                    ? 'mouseleave'
                    : 'blur', () => scope.close(true))
            }

            if(event !== 'manual'){
                trigger::on(event, () => {
                    setLocation() //优化
                    scope.toggle()
                })
            }


            if(!actived) scope.close(true)

            if(hasClose){
                let closeBtn = rootDOM::query('.popover > .fm-close')
                closeBtn::on('click', () => scope.close(true))
            }

            let arrowColor=attr.arrow || null
            this.title = attr.title
            setTimeout(() => {
                setLocation()
                this.arrowColor(attr.trigger, placement, arrowColor, )
            }, 0)
        }

        init()
    }

    compile($tElement, tAttrs, transclude){
        let dire = (tAttrs.placement || "top").toLowerCase()
        if(["top","bottom","left","right"].indexOf(dire) === -1){
            throw Error("Popover direction is not in announced list (top,bottom,left,right).")
        }

        let tmpl = popoverTmpl.replace(/#{dire}/, dire)::toDOM()
        if($tElement::getDOMState('close')){
            tmpl::prepend('<button class="fm-close">×</button>')
        }

        $tElement.append(tmpl)

        if(tAttrs.trigger == undefined){
            throw new Error("No trigger element was binded for popover component.")
        }

        return this.link
    }

    arrowColor(trigger,dire,color){
        if(color === null){
            //auto calc arrow color
            let selector = dire === "bottom" && this.title
            ? "+.popover > .popover-title"
            : "+.popover > .popover-content > *"

            let dom = DOM::query(trigger + selector)
            color = dom::getStyle('background-color')
        }

        let style = DOM::query('#__arrowColor__')

        if(style === null){
            style = createElem('style')
            style.id = "__arrowColor__"
            DOM::query('head').appendChild(style)
        }

        let css = `
            ${escapeHTML(trigger)}+div.popover > .popover-arrow:after{
                border-${escapeHTML(dire)}-color:${color};
            }
        `
        style.innerHTML += css
    }

}
