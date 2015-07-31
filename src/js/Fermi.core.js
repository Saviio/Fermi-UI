;(function(angular){

    var core= angular.module('Fermi.core',[])

    core.directive('fermiDefault', function() {
        return {
            restrict: 'A',
            require: '^ngModel',
            controller: ['$scope','$attrs', '$parse',
                function($scope, $attrs, $parse) {
                    var val = $scope.ngModel

                    if(val === undefined)
                        val = $attrs.fermiDefault;
                    if(val === undefined)
                        val = $attrs.value;
                    if(val !== undefined)
                        $parse($attrs.ngModel).assign($scope,JSON.parse(val))
                }
            ]
        }
    })

})(angular)
