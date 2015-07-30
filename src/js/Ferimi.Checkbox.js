

;(function(angular){

    var checkbox= angular.module('Fermi.checkbox',[])

    checkbox.directive('fermiCheckbox',[function(){
        return{
            restrict:'EA',
            replace:true,
            scope:{
                boolean:'@'
            },
            transclude:true,
            template:`
                <div class="checkbox">
                    <span>
                    </span>
                </div>
            `
        }
    }])


})(angular)
