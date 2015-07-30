

;(function(angular){

    var checkbox= angular.module('Fermi.checkbox',[])

    checkbox.directive('fermiCheckbox',[function(){
        return{
            restrict:'EA',
            replace:true,
            scope:{
                boolean:'='
            },
            transclude:true,
            template:`
                <div class="checkbox" ng-click="click()" >
                    <input type="checkbox" ng-model="boolean"></input>
                    <span></span>
                </div>
            `,
            controller:['$scope',function($scope){
                $scope.click=function(){
                    $scope.boolean=!$scope.boolean
                    //alert($scope.boolean)
                }
            }]
        }
    }])


})(angular)
