

import template from '../template/query.html'

export default class Query{
    constructor(utils,timeout){
        this.replace=true
        this.restrict='EA'
        this.template=template
        this.controller.$inject=['$scope']
        this.scope={
            control:'=',
            callback:'='
        }
        this.utils=utils
        this.timeout=timeout
    }

    controller($scope){
        $scope.control={
            hide:function(execCallback=false){
                if(typeof $scope.callback === 'function' && execCallback)
                    $scope.callback()
                $scope.hide()
            },
            show:()=>$scope.show()
        }
    }

    link(scope, element, attrs, ctrl){
        var {prefix,eventPrefix}=this.utils.prefix()
        var actived=this.utils.DOMState(attrs,'actived')

        element.bind(eventPrefix+'TransitionEnd',()=>{
            if(!actived)
                element.addClass('hide')
        })

        scope.show=()=>{
            element.removeClass('hide')
            this.timeout(()=>element.addClass('progress-query-show'),10)
            actived=true
        }

        scope.hide=()=>{
            this.timeout(()=>element.removeClass('progress-query-show'),10)
            actived=false
        }

        if(actived)
            scope.show()
    }
}

Query.$inject=['fermi.Utils','$timeout']
