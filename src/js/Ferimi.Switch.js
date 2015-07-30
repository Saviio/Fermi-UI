

;(function(angular){

    var switchs= angular.module('Fermi.switch',[])

    switchs.directive('fermiSwitch',['$parse',function($parse){
        return{
            restrict:'EA',
            replace:true,
            require: '^ngModel',
            scope:{
                ngModel: '=',
                //event:'='
            },
            transclude:true,
            template:`
                <div class="switch" ng-click="ngModel=!ngModel" >
                    <input type="checkbox" ng-model="ngModel"></input>
                    <span></span>
                </div>
            `,
            controller:['$scope',function($scope){
                /*$scope.exec=function(){
                    $scope.ngModel=!$scope.ngModel
                    $scope.event()
                }*/
            }],
            link: function (scope, element, attrs) {
                if (attrs.ngModel && attrs.value)
                    $parse(attrs.ngModel).assign(scope, attrs.value);
            }
        }
    }])


})(angular)
