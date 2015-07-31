

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
                <div class="switch"  >
                    <label for={{label+"_switcher"}}>
                    <input type="checkbox" ng-model="ngModel" ng-attr-name={{label+"_switcher"}}></input>
                    <span ng-click=";ngModel=!ngModel"></span>
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
                    var val = $attrs.fermiDefault;
                    if(val===undefined)
                        val=$attrs.value;
                    if(val!==undefined)
                        $parse($attrs.ngModel).assign($scope,JSON.parse(val))
                }
            ]
        }
    })


})(angular)
