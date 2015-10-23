

import template from '../template/line.html'

export default class{
    constructor(){
        this.replace=true
        this.restrict='EA'
        this.template=template
        this.controller.$inject=['$scope']
        this.require='^ngModel'
        this.scope={
            percent:'=',
            ngModel:'=',
            label:'@'
        }
    }

    controller($scope){
        $scope.check=function(){
            if($scope.ngModel>100)
                $scope.ngModel=100
            else if($scope.ngModel<0)
                $scope.ngModel=0
        }
    }

    link(scope, element, attrs, ctrl){
        scope.$watch('ngModel',(newValue,oldValue) => {
            scope.check()
            if(newValue>=100)
                element.addClass('progress-success')
            else
                element.removeClass('progress-success')
        })
    }
}
