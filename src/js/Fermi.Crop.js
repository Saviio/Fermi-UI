;(function(angular,undefined){
    var crop= angular.module('Fermi.crop',['Fermi.core'])

    crop.directive('fermiCrop',[function(){
        return {
            restrict:'EA',
            replace:true,
            transclude:true,
            template:`
                <div>
                    <input type="file" />
                </div>
            `,
            controller['$scope',function($scope){

            }],
            link:function(scope,element,attr,ctrl){
                
            }
        }
    }])
})(angular)
