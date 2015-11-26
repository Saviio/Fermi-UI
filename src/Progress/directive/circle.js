

import template from '../template/circle.html'


export default class circle{
    constructor(){
        this.replace=true
        this.restrict='EA'
        this.template=template
        this.require='^ngModel'
        this.scope={
            ngModel:'=',
            label:'@',
            showinfo:'@'
        }

        //this.utils=utils
        this.controller.$inject=['$scope']
    }

    controller($scope){
        const PI = 3.1415926535898
        //$scope.showInfo=!!$scope.showInfo
        $scope.showinfo=Boolean($scope.showinfo)
        $scope.dashOffset = () => {
            let C = $scope.radius * 2 * PI
            return {
                'stroke-dasharray'  : `${C}px ${C}px`,
                'stroke-dashoffset' : `${C - C * $scope.ngModel / 100}`
            }
        }
    }

    link(scope,elem,attrs,ctrl){
        let size = attrs.size || 100
        let strokeWidth = attrs.strokeWidth || 4
        let inner = attrs.inner || '#e9e9e9' //inner background-color
        let outer = attrs.outer || '#00a9e8' //outer background-color
        let radius = null

        let moveTo = size / 2
        scope.radius = radius = moveTo - (strokeWidth / 2)
        let paths = elem.find('path')

        for(let i = 0;i < paths.length; i++){
            paths[i].setAttribute('d',`M ${moveTo},${moveTo} m 0,-${radius} a ${radius},${radius} 0 1 1 0,${radius * 2} a ${radius},${radius} 0 1 1 0,-${radius * 2}`)
            paths[i].setAttribute('stroke', i===0 ? inner : outer)
            paths[i].setAttribute('stroke-width', strokeWidth)
        }

        let svg = elem.find('svg')[0]
        svg.setAttribute('viewBox',`0 0 ${size} ${size}`)
    }
}


//circle.$inject = ['fermi.Utils']
