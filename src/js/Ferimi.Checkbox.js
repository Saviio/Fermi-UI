

;(function(angular){

    var checkbox= angular.module('Fermi.checkbox',[])

    checkbox.directive('fermiCheckbox',['$parse',function($parse){
        return{
            restrict:'EA',
            replace:true,
            require: '^ngModel',
            scope:{
                ngModel: '='
            },
            transclude:true,
            template:`
                <div class="checkbox" ng-click="ngModel=!ngModel" >
                    <input type="checkbox" ng-model="ngModel"></input>
                    <span></span>
                </div>
            `,
            controller:['$scope',function($scope){
                $scope.ngModel=$scope.ngModel || false
            }],
            link: function (scope, element, attrs) {
                if (attrs.ngModel && attrs.value)
                    $parse(attrs.ngModel).assign(scope, attrs.value);
            }
        }
    }])


})(angular)
