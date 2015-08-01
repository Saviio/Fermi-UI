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
                <span ng-transclude ng-mouseover="mouseover($event)">
                </span>
            `,
            controller:['$scope',function($scope){
                $scope.container=null
                $scope.getContainer=function(){
                    if(!container){
                        $scope.container=document.createElement('div')
                        document.body.appendChild($scope.container)
                    }
                    return $scope.container
                }

                $scope.mouseover=function($event){
                    
                }

            }]
        }
    }])

})(angular)


/*

<div>
    <div ng-class="{undefined:'tooltip-arrow tooltip-arrow-left',left: 'tooltip-arrow tooltip-arrow-left', right: 'tooltip-arrow tooltip-arrow-right',top:'tooltip-arrow tooltip-arrow-top',bottom:'tooltip-arrow tooltip-arrow-bottom'}[placement]"></div>
    <div>
        <span>{{content}}</span>
    </div>
</div>
*/
