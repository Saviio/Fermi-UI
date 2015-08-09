;(function(angular,undefined){
    var crop= angular.module('Fermi.dropdown',['Fermi.core'])

    crop.directive('fermiDropdown',[function(){
        return {
            restrict:'EA',
            replace:true,
            transclude:true,
            template:`
                <div>
                    
                </div>
            `,
            controller['$scope',function($scope){

            }],
            link:function(scope,element,attr,ctrl){

            }
        }
    }])
})(angular)
