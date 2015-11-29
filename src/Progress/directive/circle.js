import template from '../template/circle.html'

//Todo 半圆形
export default class circle{
    constructor($compile,utils){
        this.replace=true
        this.restrict='EA'
        this.template=template
        this.require='^ngModel'
        this.scope={
            ngModel:'=',
            label:'@'
        }

        this.controller.$inject=['$scope']
        this.$compile=$compile
        this.utils=utils
    }

    controller($scope){
        const PI = 3.1415926535898

        $scope.dashOffset = () => {
            const C = $scope.radius * 2 * PI
            return {
                'stroke-dasharray'  : `${C}px ${C}px`,
                'stroke-dashoffset' : `${C - C * $scope.ngModel / 100}`
            }
        }

        $scope.check=function(){
            if($scope.ngModel>100) $scope.ngModel=100
            else if($scope.ngModel<0) $scope.ngModel=0
        }
    }

    link(scope,elem,attrs,ctrl){
        let size = attrs.size || 100
        let strokeWidth = attrs.strokeWidth || 4
        let inner = attrs.inner || '#e9e9e9' //inner background-color
        let outer = attrs.outer || '#00a9e8' //outer background-color
        let shape = attrs.shape || 'round'
        let showinfo = !!(attrs.showinfo || false)
        let isProgress = this.utils.DOMState(attrs,'progress')
        let radius = null

        let moveTo = size / 2
        scope.radius = radius = moveTo - (strokeWidth / 2)
        let paths = elem.find('path')

        for(let i = 0;i < paths.length; i++){
            paths[i].setAttribute('d',`M ${moveTo},${moveTo} m 0,-${radius} a ${radius},${radius} 0 1 1 0,${radius * 2} a ${radius},${radius} 0 1 1 0,-${radius * 2}`)
            paths[i].setAttribute('stroke', i===0 ? inner : outer)
            paths[i].setAttribute('stroke-width', strokeWidth)
        }

        paths[paths.length-1].setAttribute('stroke-linecap',shape)

        if(showinfo){
            let format = (attrs.format || '${percent}').replace('${percent}',($0) => '{{ngModel}}')
            let unit   =  typeof attrs.unit === 'string' ? attrs.unit : '%'
            let tmpl   = `<span>${format} ${unit ? '<sup>'+unit+'</sup>' :''}</span>`
            let innerDIV = elem.find('div').append(tmpl)
            this.$compile(innerDIV.find('span'))(scope)
        }

        if(isProgress){
            scope.$watch('ngModel',(newValue,oldValue) => {
                scope.check()
                newValue >= 100 ? elem.addClass('progress-success') : elem.removeClass('progress-success')
            })
        }

        let svg = elem.find('svg')[0]
        svg.setAttribute('viewBox',`0 0 ${size} ${size}`)
    }
}

circle.$inject=['$compile','fermi.Utils']
