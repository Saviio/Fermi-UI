import { getCoords,getStyle } from '../../utils'

//不要放在全局 remark
export default class Tooltips{
    constructor(){
        this.restrict = "EA"
        this.transclude = true
        this.scope = {
            placement:'@',
            content:'@',
            offset:'@'
        }
        this.template = `<span ng-transclude></span>`
    }
    controller(){}

    link(scope, $elem, attr, ctrl){

        ctrl.container = null
        ctrl.parent = null
        ctrl.tooltipTmpl = `
                <div class="tooltip-arrow tooltip-arrow"></div>
                <div class="tooltip-content">
                    <span>${scope.content}</span>
                </div>
        `//remark use compile + scope

        ctrl.style = null
        ctrl.placement = scope.placement || 'top'
        ctrl.isExpend = false

        ctrl.getContainer = () => { //remark ctrl.container rename to ctrl.$container
            if(!ctrl.container){
                ctrl.container = document.createElement('div') //remark
                document.body.appendChild(ctrl.container) //remark
                ctrl.container = angular.element(ctrl.container)
                ctrl.container.html(ctrl.tooltipTmpl)
                ctrl.container.addClass(`tooltip tooltip-hidden tooltip-${ctrl.placement}`)
            }
            return ctrl.container
        }

        ctrl.setLocationStyle = () => {
            let offset = scope.offset || 6
            let tooltip = ctrl.getContainer()

            let { left,top } = $elem[0]::getCoords()
            let height = $elem[0]::getStyle('height')
            let width = $elem[0]::getStyle('width')


            let tooltipElement = tooltip[0]
            let tpHeight = ~~tooltipElement::getStyle('height','px')
            let tpWidth = ~~tooltipElement::getStyle('width','px')

            switch(scope.placement){
                case 'top':
                    ctrl.style =  {
                        left:`${(left + width / 2) - tpWidth / 2}px`,
                        top:`${top - tpHeight - offset}px`
                    }
                break
                case 'bottom':
                    ctrl.style = {
                        left:`${(left + width / 2) - tpWidth / 2}px`,
                        top:`${top + height + offset}px`
                    }
                    break
                case 'left':
                    ctrl.style = {
                        left:`${left - tpWidth - offset}px`,
                        top:`${(top + height / 2) - tpHeight / 2}px`
                    }
                    break
                case 'right':
                    ctrl.style = {
                        left:`${left + width + offset}px`,
                        top:`${(top + height / 2) - tpHeight / 2}px`
                    }
                    break
            }

            tooltip.css('left', ctrl.style.left)
            tooltip.css('top', ctrl.style.top)
        }

        Object.defineProperty(ctrl, 'tooltip', {
            get: () => {
                if(!ctrl.isExpend) ctrl.setLocationStyle()
                ctrl.isExpend = !ctrl.isExpend
                return ctrl.getContainer()
            },
            set: () => {},
            enumerable: true,
            configurable: true
        })

        $elem.bind('mouseenter',() => ctrl.tooltip.removeClass('tooltip-hidden'))
        $elem.bind('mouseleave',() => ctrl.tooltip.addClass('tooltip-hidden'))
    }
}
