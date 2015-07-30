

;(function(angular){

    var switchs= angular.module('Fermi.switch',[])

    switchs.directive('fermiSwitch',['$parse',function($parse){
        return{
            restrict:'EA',
            replace:true,
            require: '^ngModel',
            scope:{
                ngModel: '=',
                label:"@"
            },
            transclude:true,
            template:`
                <div class="switch" ng-click=";ngModel=!ngModel" >
                    <label for="{{label}}">
                    <input type="checkbox" ng-model="ngModel"></input>
                    <span></span>
                    </label>
                </div>
            `,

        }
    }])
    .directive('fermiDefault', function() {
        return {
            restrict: 'A',
            require: '^ngModel',
            controller: ['$scope','$attrs', '$parse',
                function($scope, $attrs, $parse) {
                    var val = !!$attrs.fermiDefault || !!$attrs.value
                    if(val!==undefined)
                        $parse($attrs.ngModel).assign($scope,val)
                }
            ]
        }
    })


})(angular)
