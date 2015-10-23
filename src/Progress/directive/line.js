

import template from '../template/line.html'

export default class{
    constructor(){
        this.replace=true
        this.restrict='EA'
        this.template=template
        this.controller.$inject=['$scope']
        this.scope={
            percent:'='
        }
    }

    controller($scope){

        $scope.percent=$scope.percent || 0

        $scope.update=function(percent){
            $scope.percent+=percent
            if($scope.percent>100)
                $scope.percent=100
            if($scope.percent<0)
                $scope.percent=0
        }

        $scope.success=function(){
            $scope.update(100)
        }
    }

    link(scope, element, attrs){

    }
}
