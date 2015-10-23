

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


        $scope.update=function(percent){
            $scope.ngModel+=percent
            if($scope.ngModel>100)
                $scope.ngModel=100
            if($scope.ngModel<0)
                $scope.ngModel=0
        }

        $scope.test=function(){
            console.log($scope.ngModel)
        }

        $scope.success=function(){
            $scope.update(100)
        }
    }

    link(scope, element, attrs){
        
    }
}
