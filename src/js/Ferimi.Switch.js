

;(function(angular,undefined){

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

})(angular)
