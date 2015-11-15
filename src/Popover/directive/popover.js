import template from '../template/template.html'
import popoverTmpl from '../template/popover.html'

//add disable function
export default class Popover{
    constructor(utils){
        this.restrict='EA'
        this.replace=true
        this.scope={
            title:'@'
        }
        this.transclude=true
        this.template=template
        this.utils=utils
        this.controller.$inject=['$scope','$element']
    }

    controller($scope,$element){
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
        let autoHide=/auto|true/.test(attr.hide)
        let layerElem=componentDOMRoot.querySelector('.popover')
        let trigger=componentDOMRoot.querySelector(attr.trigger)

        if(trigger===undefined)
            throw new Error("trigger element cannot be fined in component scope.")
        componentDOMRoot.insertBefore(trigger,layerElem)
        let ngLayer=angular.element(layerElem)
        let ngTriggerBtn=angular.element(trigger)
        let placement=attr.placement.toLowerCase()

        var setLocation = () => {
            let offset=scope.offset
            let {left,top}=this.utils.coords(trigger)

            let triggetBtn={
                height:this.utils.style(trigger,'height','px'),
                width:this.utils.style(trigger,'width','px'),
                left,
                top
            }

            let layer={
                height:this.utils.style(layerElem,'height','px'),
                width:this.utils.style(layerElem,'width','px')
            }

            let style={
                left:null,
                top:null
            }

            switch (placement) {
                case 'top':
                    style.left=`${-layer.width/2+triggetBtn.width/2}px`
                    style.top=`${-layer.height+(-10)+(-offset)}px`
                    break;
                case 'bottom':
                    style.left=`${-layer.width/2+triggetBtn.width/2}px`
                    style.top=`${triggetBtn.height+10+offset}px`
                    break;
                case 'left':
                    style.left=`${-layer.width+(-10)+(-offset)}px`
                    style.top=`${triggetBtn.height/2-layer.height/2}px`
                    break;
                case 'right':
                    style.left=`${triggetBtn.width+10+offset}px`
                    style.top=`${triggetBtn.height/2-layer.height/2}px`
                    break;
                default:
                    return;
                    break;
            }
            ngLayer.css(style)
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
        let initCloseBtn=this.utils.DOMState(attr,'close')

        scope.offset= /^\d{1,}$/.test(initOffset) ? initOffset : 5

        if(!initState)
            scope.close(true)

        if(initCloseBtn){
            var closeBtn=componentDOMRoot.querySelector('.popover > .close')
            angular.element(closeBtn).bind('click',()=>scope.close(true))
        }

        scope.isOpen=initState
        let arrowColor=attr.arrow || null
        setTimeout(()=> {
            setLocation()
            this.arrowColor(attr.trigger,placement,arrowColor)
        },0)
    }

    compile(tElement, tAttrs, transclude){
        let dire=(tAttrs.placement || "top").toLowerCase()
        if(["top","bottom","left","right"].indexOf(dire)===-1)
            throw Error("Popover direction not in announced list(top,bottom,left,right).")

        let showCloseBtn=this.utils.DOMState(tAttrs,'close')
        let tmpl=popoverTmpl.replace(/#{dire}/, dire)
        if(!showCloseBtn)
            tmpl=tmpl.replace(/<button class="close" >×<\/button>/,"")
        tElement.append(tmpl)

        if(tAttrs.trigger==undefined){
            throw new Error("No trigger element was binded for popover component.")
            return
        }

        return this.link
    }

    arrowColor(trigger,dire,color){
        if(color===null){
            //auto calc arrow color
            var matchedColorSelector= dire === "bottom" ? "+.popover > .popover-title" :"+.popover > .popover-content > *"
            var dom=document.querySelector(trigger+matchedColorSelector)
            color=this.utils.style(dom,'background-color')
        }

        let arrowStyle=document.querySelector('#arrowColor')

        if(arrowStyle===null){
            arrowStyle=document.createElement('style')
            arrowStyle.id="arrowColor"
            document.getElementsByTagName('head')[0].appendChild(arrowStyle)
        }

        let controlCSS=`
            ${this.utils.escapeHTML(trigger)}+div.popover > .popover-arrow:after{
                border-${this.utils.escapeHTML(dire)}-color:${color};
            }
        `
        arrowStyle.innerHTML+=controlCSS
    }
}

Popover.$inject=["fermi.Utils"]
