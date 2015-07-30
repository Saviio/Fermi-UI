


;(function(angular){

    var breadcrumb=angular.module('Fermi.breadcrumb',[])

    breadcrumb.directive('fermiBreadcrumb',[function(){

        return {
            restrict:'EA',
            replace:true,
            scope:{
              items:'='
            },
            transclude:true,
            template:`
                <div class="breadcrumb-container">
                    <span ng-repeat="item in items" class="breadcrumb">
                        <span class="breadcrumb-link" ng-if="!item.label">
                            {{item}}
                        </span>
                        <a  class="breadcrumb-link" ng-if="item.label" href={{item.href?item.href:'javascript:;'}}>
                            {{item.label}}
                        </a>
                        <span class="breadcrumb-slash">
                            /
                        </span>
                    </span>
                    <!--<div class="breadcrumb-decoration"></div>-->
                </div>
            `,
            controller:[function(){}]
      }
    }])

})(angular)
