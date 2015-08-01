;(function(angular,undefined){

    var tooltip= angular.module('Fermi.tooltip',[])

    tooltip.directive('fermiTooltip',[function(){
        return {
            restrict:'EA',
            replace:true,
            transclude:true,
            scope:{
                placement:'@',
                content:'@'
            },
            template:`
                <div>
                    <span>{{content}}</span>
                </div>
            `
        }
    }])

})(angular)
