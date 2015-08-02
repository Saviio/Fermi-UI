;(function(angular,undefined){
    //var elem = $event.currentTarget || $event.srcElement
    var tooltip= angular.module('Fermi.tooltip',['Fermi.core'])

    tooltip.directive('fermiTooltip',['fermi.Utils',function(utils){
        return {
            restrict:'EA',
            replace:true,
            transclude:true,
            scope:{
                placement:'@',
                content:'@',
                offset:'@'
            },
            template:`
                <span ng-transclude> </span>
            `,
            controller:['$scope',function($scope){}],
            link:function(scope,elem,attr,ctrl){

                ctrl.container=null
                ctrl.parent=null
                ctrl.tooltip_tmpl=`
                        <div class="tooltip-arrow tooltip-arrow"></div>
                        <div class="tooltip-content">
                            <span>${scope.content}</span>
                        </div>
                `
                ctrl.style=undefined
                ctrl.placement=scope.placement || 'top'

                var isInit=false


                ctrl.getContainer=function(){
                    if(!ctrl.container){
                        ctrl.container=document.createElement('div')
                        document.body.appendChild(ctrl.container)
                        ctrl.container=angular.element(ctrl.container)
                        ctrl.container.html(ctrl.tooltip_tmpl)
                        ctrl.container.addClass(`tooltip tooltip-hidden tooltip-${ctrl.placement}`)
                    }
                    return ctrl.container
                }

                ctrl.setLocationStyle=function(){
                    var offset=scope.offset || 6
                    var tooltip=ctrl.getContainer()
                    if(typeof ctrl.style!=='object'){

                        var {left,top}=utils.coords(elem[0])
                        var height=utils.style(elem[0],'height')
                        var width=utils.style(elem[0],'width')


                        var tooltip_element=tooltip[0]
                        var tp_height=parseInt(utils.style(tooltip_element,'height').replace(/px/,''))
                        var tp_width=parseInt(utils.style(tooltip_element,'width').replace(/px/,''))

                        switch(scope.placement){
                            case 'top':ctrl.style={
                                left:`${(left+width/2)-tp_width/2}px`,
                                top:`${top-tp_height-offset-9}px`
                            };break;
                            case 'bottom':ctrl.style={
                                left:`${(left+width/2)-tp_width/2}px`,
                                top:`${top+height+offset}px`
                            };break;
                            case 'left':ctrl.style={
                                left:`${left-tp_width-offset-4}px`,
                                top:`${(top+height/2)-tp_height/2}px`
                            };break;
                            case 'right':ctrl.style={
                                left:`${left+width}px`,
                                top:`${(top+height/2)-tp_height/2}px`
                            };break;
                        }
                    }

                    tooltip.css('left',ctrl.style.left)
                    tooltip.css('top',ctrl.style.top)
                }

                Object.defineProperty(ctrl, 'tooltip', {
                    get: function() {
                        if(!isInit){
                            ctrl.setLocationStyle()
                            isInit=true
                        }
                        return ctrl.getContainer()
                    },
                    enumerable: true,
                    configurable: true
                })

                elem.bind('mouseover',function(){
                    ctrl.tooltip.removeClass('tooltip-hidden')
                })

                elem.bind('mouseout',function(){
                    ctrl.tooltip.addClass('tooltip-hidden')
                })
            }
        }
    }])

})(angular)


/*

<div>
    <div ng-class="{undefined:'tooltip-arrow tooltip-arrow-left',left: 'tooltip-arrow tooltip-arrow-left', right: 'tooltip-arrow tooltip-arrow-right',top:'tooltip-arrow tooltip-arrow-top',bottom:'tooltip-arrow tooltip-arrow-bottom'}[placement]"></div>
    <div>
        <span>{{content}}</span>
    </div>
</div>
*/
