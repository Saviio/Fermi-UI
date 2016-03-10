import { dependencies } from '../../external/dependencies'
import template from '../template/template.html'
import {
    on,
    query,
    props,
    addClass,
    getStyle,
    setStyle,
    getCoords,
    removeClass
 } from '../../utils'

//不要放在全局 remark
@dependencies('$compile')
export default class Tooltips{
    constructor($compile){
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
        scope.close = (force = false) => {

        }
    }

    link(scope, $elem, attr, ctrl){
        let actived = $elem::props('actived')

        setTimeout(() => {
            let rootDOM = $elem[0]
            let placement = attr.placement.toLowerCase()
            let offset = attr.offset || 6

            let tooltipBody = rootDOM::query('.fm-tooltip-wrapper')
            let trigBody = rootDOM::query('.fm-tooltip-elem')
            debugger
            let trig = {
                height: trigBody::getStyle('height', 'px'),
                width: trigBody::getStyle('width', 'px')
            }

            let tooltip = {
                height: tooltipBody::getStyle('height', 'px'),
                width: tooltipBody::getStyle('width', 'px')
            }

            console.log(JSON.stringify(tooltip))
            console.log("trig: " + JSON.stringify(trig))

            let left, top
            switch (placement) {
                case 'top':
                    left = `${-tooltip.width / 2 + trig.width / 2}px`
                    top = `${-tooltip.height + (-10) + (-offset)}px`
                    break
                case 'bottom':
                    left = `${-tooltip.width / 2 + trig.width / 2}px`
                    top = `${trig.height + 10 + offset}px`
                    break
                case 'left':
                    left = `${-tooltip.width + (-10) + (-offset)}px`
                    top = `${trig.height / 2 - tooltip.height / 2}px`
                    break
                case 'right':
                    left = `${trig.width + 10 + offset}px`
                    top = `${trig.height / 2 - tooltip.height / 2}px`
                    break
                default:
                    return
            }

            tooltipBody::setStyle({left, top})
        }, 1000)

        
    }
}
