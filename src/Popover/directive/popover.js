import template from '../template/template.html'
import popoverTmpl from '../template/popover.html'

//add disable function
//add init open or not open function
//bug 单个按钮连续点击多次会出现错乱
export default class Popover{
    constructor(utils,$compile){
        this.restrict='EA'
        this.replace=true
        this.scope={
            placement:'@',
            title:'@',
            hide:'@',
            offset:'@',
            button:'@'
        }
        this.transclude=true
        this.template=template
        this.utils=utils
        this.controller.$inject=['$scope','$element']
        this.$compile=$compile
    }

    controller($scope,$element){
        var dire=$scope.placement.toLowerCase()
        var isOpen=true

        console.log($element)

        $scope.open=()=>{
            isOpen=!isOpen
            $scope.layer.removeClass('disappear-animation')
        }

        $scope.close=()=>{
            isOpen=!isOpen
            $scope.layer.addClass('disappear-animation')
        }

        $scope.toggle=()=>{
            if(isOpen)
                setTimeout(()=>$scope.close(),0)
            else
                setTimeout(()=>$scope.open(),0)
        }
    }

    compile(tElement, tAttrs, transclude){
        let self=this
        let dire=(tAttrs.placement || "top").toLowerCase()
        if(["top","bottom","left","right"].indexOf(dire)===-1)
            throw Error("Popover direction not in announced list(top,bottom,left,right).")
        let tmpl=popoverTmpl.replace(/#{dire}/, dire)
        tElement.append(tmpl)
        return (scope,element,attr) => {
            let autoHide=/auto|true/.test(scope.hide)
            let layerElem=element[0].querySelector('.popover')
            let btnElem=element[0].querySelector('button')
            let ngLayer=angular.element(layerElem)
            let ngBtn=angular.element(btnElem)

            var setLocation = () => {
                let offset=~~scope.offset || 5
                let {left,top}=self.utils.coords(btnElem)

                let layer={
                    height:self.utils.style(layerElem,'height','px'),
                    width:self.utils.style(layerElem,'width','px'),
                    wrapped:ngLayer
                }

                let btn={
                    height:self.utils.style(btnElem,'height','px'),
                    width:self.utils.style(btnElem,'width','px'),
                    wrapped:ngBtn,
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
                ngBtn.bind('blur',() => scope.toggle())
            ngBtn.bind('click',() => {
                setLocation()
                scope.toggle()
            })
            scope.close()
            setTimeout(()=> setLocation(),0)
        }
    }
}

Popover.$inject=["fermi.Utils","$compile"]
