
//Todo: 实现disable 功能
export default class TooltipsDirective {
    constructor(utils){
        this.restrict="EA"
        this.transclude=true
        this.scope={
            placement:'@',
            content:'@',
            offset:'@'
        }
        this.template=`<span ng-transclude></span>`
        this.utils=utils
    }

    controller($scope){}

    link(scope,elem,attr,ctrl){

        ctrl.container=null,ctrl.parent=null
        ctrl.tooltip_tmpl=`
                <div class="tooltip-arrow tooltip-arrow"></div>
                <div class="tooltip-content">
                    <span>${scope.content}</span>
                </div>
        `

        ctrl.style=null
        ctrl.placement=scope.placement || 'top'
        ctrl.isExpend=false

        ctrl.getContainer=() => {
            if(!ctrl.container){
                ctrl.container=document.createElement('div')
                document.body.appendChild(ctrl.container)
                ctrl.container=angular.element(ctrl.container)
                ctrl.container.html(ctrl.tooltip_tmpl)
                ctrl.container.addClass(`tooltip tooltip-hidden tooltip-${ctrl.placement}`)
            }
            return ctrl.container
        }

        ctrl.setLocationStyle=() => {
            const offset=scope.offset || 6
            const tooltip=ctrl.getContainer()

            const {left,top}=this.utils.coords(elem[0])
            const height=this.utils.style(elem[0],'height')
            const width=this.utils.style(elem[0],'width')


            const tooltip_element=tooltip[0]
            const tp_height=parseInt(this.utils.style(tooltip_element,'height').replace(/px/,''))
            const tp_width=parseInt(this.utils.style(tooltip_element,'width').replace(/px/,''))

            switch(scope.placement){
                case 'top':
                    ctrl.style={
                        left:`${(left+width/2)-tp_width/2}px`,
                        top:`${top-tp_height-offset-7}px`
                    }
                break
                case 'bottom':
                    ctrl.style={
                        left:`${(left+width/2)-tp_width/2}px`,
                        top:`${top+height+offset}px`
                    }
                    break
                case 'left':
                    ctrl.style={
                        left:`${left-tp_width-offset-4}px`,
                        top:`${(top+height/2)-tp_height/2}px`
                    }
                    break
                case 'right':
                    ctrl.style={
                        left:`${left+width}px`,
                        top:`${(top+height/2)-tp_height/2}px`
                    }
                    break
            }

            tooltip.css('left',ctrl.style.left)
            tooltip.css('top',ctrl.style.top)
        }

        Object.defineProperty(ctrl, 'tooltip', {
            get: () => {
                if(!ctrl.isExpend)
                    ctrl.setLocationStyle()

                ctrl.isExpend=!ctrl.isExpend
                return ctrl.getContainer()
            },
            enumerable: true,
            configurable: true
        })

        elem.bind('mouseover',() => ctrl.tooltip.removeClass('tooltip-hidden'))
        elem.bind('mouseout',() => ctrl.tooltip.addClass('tooltip-hidden'))
    }
}


TooltipsDirective.$inject=["fermi.Utils"]
