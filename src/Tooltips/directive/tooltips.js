import { dependencies } from '../../external/dependencies'
import template from '../template/template.html'
import {
    on,
    query,
    props,
    isHidden,
    addClass,
    getStyle,
    setStyle,
    getCoords,
    forceReflow,
    removeStyle,
    removeClass
 } from '../../utils'

 import { transition } from '../../utils/transition'


export default class Tooltips{
    constructor(){
        this.restrict = "EA"
        this.transclude = true
        this.scope = {
            placement:'@',
            content:'@',
            offset:'@'
        }
        this.template = template
        this.replace = true
    }
    
    @dependencies('$scope')
    controller(scope){
        scope.content = (scope.content || '').trim()
    }
    
    link(scope, $elem, attr, ctrl){
        let actived = $elem::props('actived')
        let rootDOM = $elem[0]
        let placement = attr.placement.toLowerCase()
        let offset = attr.offset || 0

        let tooltipBody = rootDOM::query('.fm-tooltip-wrapper')
        let trigBody = rootDOM::query('.fm-tooltip-elem')

        scope.tooltip = tooltipBody

        setTimeout(() => {
            let init = false

            if(isHidden(tooltipBody)){
                let display = 'block', opacity = 1, transform = 'scale(1)'
                tooltipBody::setStyle({ display, opacity, transform })
                tooltipBody::forceReflow()
                init = true
            }

            let trig = {
                height: trigBody::getStyle('height', 'px'),
                width: trigBody::getStyle('width', 'px')
            }

            let tooltip = {
                height: tooltipBody::getStyle('height', 'px'),
                width: tooltipBody::getStyle('width', 'px')
            }


            let left, top
            switch (placement) {
                case 'top':
                    left = `${-tooltip.width / 2 + trig.width / 2}px`
                    top = `${-tooltip.height + (-offset)}px`
                    break
                case 'bottom':
                    left = `${-tooltip.width / 2 + trig.width / 2}px`
                    top = `${trig.height + offset}px`
                    break
                case 'left':
                    left = `${-tooltip.width + (-offset)}px`
                    top = `${trig.height / 2 - tooltip.height / 2}px`
                    break
                case 'right':
                    left = `${trig.width + offset}px`
                    top = `${trig.height / 2 - tooltip.height / 2}px`
                    break
                default:
                    return
            }

            tooltipBody::setStyle({ left, top })
            if(init){
                let display, opacity, transform
                tooltipBody::removeStyle({ display, opacity, transform })
            }
        }, 0)
        let tooltipTrans = new transition(tooltipBody, 'fm-tooltip-effect', actived)
        trigBody::on('mouseenter', e => tooltipTrans.state = true)
        trigBody::on('mouseleave', e => tooltipTrans.state = false)
    }
}
