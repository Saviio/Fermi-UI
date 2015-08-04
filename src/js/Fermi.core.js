;(function(angular,undefined){

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

    core.filter('range', () => {
        return (input, total) => {
            for (var i = 0, total = parseInt(total); i<total; i++)
                input.push(i)
            return input
        }
    })

    core.factory('fermi.Utils',function(){

        var getCoords = function(elem){
            var box = elem.getBoundingClientRect(),
            self= window,
            doc = elem.ownerDocument,
            body = doc.body,
            html = doc.documentElement,
            clientTop = html.clientTop || body.clientTop || 0,
            clientLeft = html.clientLeft || body.clientLeft || 0
            return { top: (box.top + (self.pageYOffset || html.scrollTop || body.scrollTop ) - clientTop), left: (box.left + (self.pageXOffset || html.scrollLeft || body.scrollLeft) - clientLeft) };
        }

        function getStyle(elem, name) {
            var style=window.getComputedStyle ? window.getComputedStyle(elem, null)[name] : elem.currentStyle[name]

            if( (name==='width' || name==='height') && style==='auto'){
                if(name=='width')
                    style=elem.offsetWidth
                else if(name=='height')
                    style=elem.offsetHeight
            }
            return style
        }

        return {
            coords:getCoords,
            style:getStyle
        }

    })

})(angular)