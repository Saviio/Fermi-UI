import tabs from '../template/tabs.html'
import tab from '../template/tab.html'

export class Tabs{
    constructor(){
        this.replace=true
        this.restrict='EA'
        this.template=tabs
        this.controller.$inject=['$scope']
        this.transclude=true
        this.scope={}
    }

    controller($scope){
        $scope.headers=[]
        $scope.addHeader= (header) => $scope.headers=[...$scope.headers,header]
        console.log($scope)
    }

    link(scope, elem, attrs, ctrl){}
}

export class Tab{
    constructor(){
        this.restrict='EA'
        this.require='^fermiTab'
        this.replace=true
        this.template=tab
        this.controller.$inject=['$scope']
    }

    controller($scope){
        console.log(typeof $scope.$parent.addHeader)
    }

    link(scope,element,attrs,parentCtrl){
        var header=attrs.header
        scope.$parent.addHeader(header)
    }
}
