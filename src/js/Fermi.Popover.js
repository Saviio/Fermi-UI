;(function(angular,undefined){
    var popover= angular.module('Fermi.popover',['Fermi.core'])

    popover.directive('fermiPopover',[function(){
        return {
            restrict:'EA',
            replace:true,
            transclude:true,

        }
    }])

})(angular)
