import template from '../template/template.html'
import popoverTmpl from '../template/popover.html'

//add disable function
//add trigger function
export default class Popover{
    constructor(utils){
        this.restrict='EA'
        this.replace=true
        this.scope={
            placement:'@',
            title:'@',
            hide:'@',
            trigger:'@'
        }
        this.transclude=true
        this.template=template
        this.utils=utils
        this.controller.$inject=['$scope','$element']
    }

    controller($scope,$element){
        var dire=$scope.placement.toLowerCase()

        $scope.open=()=>{
            if($scope.isOpen===false){
                $scope.isOpen=!$scope.isOpen
                $scope.layer.removeClass('disappear-animation')
            }
        }

        $scope.close=(force=false)=>{
            if(force)
                $scope.isOpen=false
            else if($scope.isOpen!==false)
                $scope.isOpen=!$scope.isOpen

            $scope.layer.addClass('disappear-animation')
        }

        $scope.toggle=()=>{
            if($scope.isOpen)
                $scope.close()
            else
                $scope.open()
        }
    }

    link(scope,element,attr,ctrl,transcludeFn){
        //("Popover component can only support for single element."
        let componentDOMRoot=element[0]
        let autoHide=/auto|true/.test(scope.hide)
        let layerElem=componentDOMRoot.querySelector('.popover')
        let trigger=componentDOMRoot.querySelector(attr.trigger)

        if(trigger==undefined)
            throw new Error("trigger element cannot be fined in component scope.")
        componentDOMRoot.insertBefore(trigger,layerElem)
        let ngLayer=angular.element(layerElem)
        let ngTriggerBtn=angular.element(trigger)


        var setLocation = () => {
            let offset=scope.offset
            let {left,top}=this.utils.coords(trigger)

            let layer={
                height:this.utils.style(layerElem,'height','px'),
                width:this.utils.style(layerElem,'width','px'),
                wrapped:ngLayer
            }

            let btn={
                height:this.utils.style(trigger,'height','px'),
                width:this.utils.style(trigger,'width','px'),
                wrapped:ngTriggerBtn,
                left,
                top
            }

            let style={
                left:null,
                top:null
            }

            switch (scope.placement.toLowerCase()) {
                case 'top':
                    style.left=`${-layer.width/2+btn.width/2}px`
                    style.top=`${-layer.height+(-10)+(-offset)}px`
                    break;
                case 'bottom':
                    style.left=`${-layer.width/2+btn.width/2}px`
                    style.top=`${btn.height+10+offset}px`
                    break;
                case 'left':
                    style.left=`${-layer.width+(-10)+(-offset)}px`
                    style.top=`${btn.height/2-layer.height/2}px`
                    break;
                case 'right':
                    style.left=`${btn.width+10+offset}px`
                    style.top=`${btn.height/2-layer.height/2}px`
                    break;
                default:
                    return;
                    break;
            }
            layer.wrapped.css(style)
        }

        scope.layer=ngLayer
        if(autoHide)
            ngTriggerBtn.bind('blur',() => scope.close())
        ngTriggerBtn.bind('click',() => {
            setLocation()
            scope.toggle()
        })

        let initState=this.utils.DOMState(attr,'actived')
        let initOffset=this.utils.DOMState(attr,'offset')

        scope.offset= /^\d{1,}$/.test(initOffset) ? initOffset : 5

        if(!initState)
            scope.close(true)

        scope.isOpen=initState
        setTimeout(()=> setLocation(),0)
    }

    compile(tElement, tAttrs, transclude){
        let dire=(tAttrs.placement || "top").toLowerCase()
        if(["top","bottom","left","right"].indexOf(dire)===-1)
            throw Error("Popover direction not in announced list(top,bottom,left,right).")
        let tmpl=popoverTmpl.replace(/#{dire}/, dire)
        tElement.append(tmpl)

        if(tAttrs.trigger==undefined)
            throw new Error("No trigger element was binded for popover component.")
        return this.link
    }
}

Popover.$inject=["fermi.Utils"]
