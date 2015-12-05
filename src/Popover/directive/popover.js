import template from '../template/template.html'
import popoverTmpl from '../template/popover.html'
import {
    getDOMState,
    getStyle,
    escapeHTML,
    getCoords,
    querySingle,
    createElem,
    on
} from '../../utils'


//add disable function
export default class Popover{
    constructor(){
        this.restrict = 'EA'
        this.replace = true
        this.scope = {
            title:'@'
        }
        this.transclude = true
        this.template = template
        this.controller.$inject = ['$scope']
    }

    controller(scope){
        scope.open = () => {
            if(scope.isOpen === false){
                scope.isOpen = !scope.isOpen
                scope.$layer.removeClass('pop-disappear-animation')
            }
        }

        scope.close = (force = false) => {
            if(force) scope.isOpen = false
            else if(scope.isOpen !== false) scope.isOpen = scope.isOpen
            scope.$layer.addClass('pop-disappear-animation')
        }

        scope.toggle = () => {
            if (scope.isOpen) scope.close()
            else scope.open()
        }
    }

    link(scope, $element, attr, ctrl){
        //("Popover component can only support for single element."
        let componentDOMRoot = $element[0]
        let layerElem = componentDOMRoot.querySelector('.popover')
        let trigger = componentDOMRoot.querySelector(attr.trigger)

        if(trigger === undefined){
            throw new Error("trigger element cannot be fined in component scope.")
        }

        componentDOMRoot.insertBefore(trigger, layerElem)
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
            let initState = $element::getDOMState('actived')
            let initOffset = $element::getDOMState('offset')
            let initCloseBtn = $element::getDOMState('close')
            let event = attr.action || 'click'

            if(!/click|hover|focus/.test(event)){
                throw new Error("Event does not supported, it should one of 'click','hover','focus'")
                return
            } else if(event === 'hover'){
                event = 'mouseenter'
            }

            scope.offset = /^\d{1,}$/.test(initOffset) ? initOffset : 5
            scope.isOpen = initState


            if(/auto|true/.test(attr.hide)){
                trigger::on(event === 'mouseenter' ? 'mouseleave' : 'blur', () => scope.close(true))
            }

            trigger::on(event, () => {
                setLocation() //优化
                scope.toggle()
            })

            if(!initState) scope.close(true)

            if(initCloseBtn){
                let closeBtn = componentDOMRoot.querySelector('.popover > .close')
                closeBtn::on('click', () => scope.close(true))
            }

            let arrowColor=attr.arrow || null
            setTimeout(() => {
                setLocation()
                this.arrowColor(attr.trigger, placement, arrowColor)
            },0)
        }

        init()
    }

    compile(tElement, tAttrs, transclude){
        let dire = (tAttrs.placement || "top").toLowerCase()
        if(["top","bottom","left","right"].indexOf(dire) === -1)
            throw Error("Popover direction not in announced list(top,bottom,left,right).")

        let showCloseBtn = tElement::getDOMState('close')
        let tmpl = popoverTmpl.replace(/#{dire}/, dire)
        if(showCloseBtn){
            tmpl = tmpl.replace('<!--CLOSE_BUTTON-->',`<button class="close">×</button>`)
        } else {
            tmpl = tmpl.replace('<!--CLOSE_BUTTON-->',"")
        }

        tElement.append(tmpl)

        if(tAttrs.trigger == undefined){
            throw new Error("No trigger element was binded for popover component.")
            return
        }

        return this.link
    }

    arrowColor(trigger,dire,color){
        if(color === null){
            //auto calc arrow color
            var matchedColorSelector = dire === "bottom" ? "+.popover > .popover-title" :"+.popover > .popover-content > *"
            var dom = querySingle(trigger + matchedColorSelector)
            color = dom::getStyle('background-color')
        }

        let arrowStyle = querySingle('#arrowColor')

        if(arrowStyle === null){
            arrowStyle = createElem('style')
            arrowStyle.id = "arrowColor"
            querySingle('head').appendChild(arrowStyle)
        }

        let controlCSS = `
            ${escapeHTML(trigger)}+div.popover > .popover-arrow:after{
                border-${escapeHTML(dire)}-color:${color};
            }
        `
        arrowStyle.innerHTML += controlCSS
    }

}
