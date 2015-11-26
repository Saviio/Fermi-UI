

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
            size:'@',
            strokeWidth:'@',
            inner:'@',
            outer:'@'
        }
        this.controller.$inject=['$scope','$element']
    }

    controller($scope){

        const PI = 3.1415926535898

        $scope.size = ~~($scope.size || 100)
        $scope.strokeWidth = ~~($scope.strokeWidth || 4)
        $scope.inner = $scope.inner || '#e9e9e9'
        $scope.outer = $scope.outer || '#147EE6'

        $scope.moveTo = $scope.size / 2
        let radius   = $scope.moveTo-($scope.strokeWidth/2)

        $scope.pathDescription = () => `M ${$scope.moveTo},${$scope.moveTo} m 0,-${radius} a ${radius},${radius} 0 1 1 0,${radius * 2} a ${radius},${radius} 0 1 1 0,-${radius * 2}`

        $scope.dashOffset = () => {
            let C = radius * 2 * PI
            return {
                'stroke-dasharray'  : `${C}px ${C}px`,
                'stroke-dashoffset' : `${C - C * $scope.ngModel / 100}`
            }
        }
    }
}
