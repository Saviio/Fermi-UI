import template from '../template/loading.html'

//改写成service，因为是全局的
export default class Loading{
    constructor(utils,$timeout){
        this.replace=true
        this.restrict='EA'
        this.template=template
        this.controller.$inject=['$scope']
        this.scope={
            callback:'=',
            control:'=',
            'delay':'@'
        }
        this.utils=utils
        this.$timeout=$timeout
    }

    controller($scope){
        let progress=0
        let self=this

        $scope.delay= $scope.delay!==undefined ? ~~$scope.delay : 1000

        Object.defineProperty($scope,'progress', {
            get: () => {
                return progress
            },
            set: (newValue) => {
                if(newValue<0){
                    progress=0
                } else if(newValue>=100){
                    progress=100
                    api.complete()
                } else {
                    progress=newValue
                }
            },
            enumerable: true,
            configurable: true
        })

        let api={
            start:function(){
                this.reset()
                $scope.show()
                self.$timeout(function rec(){
                    $scope.progress+=10
                    if($scope.progress<100)
                        self.$timeout(rec,400)
                },400)
            },
            status:function(){
                return $scope.progress
            },
            set:function(value=0){
                $scope.progress=value
            },
            reset:function(){
                self.$timeout(()=>$scope.progress=0,0)
            },
            complete:function(){
                if($scope.callback && typeof $scope.callback==='function')
                    callback()
                $scope.hide()
            }
        }

        $scope.control=api
    }

    link(scope, element, attrs, ctrl){
        console.log(element)

        let zero=(e)=>{
            if(e.propertyName=='visibility'){
                scope.progress=0
                element.unbind(eventPrefix+'TransitionEnd',zero)
            }
        }
        let {prefix,eventPrefix}=this.utils.prefix()

        scope.hide=()=> {
            element.bind(eventPrefix+'TransitionEnd',zero)
            this.$timeout(()=> {
                element.addClass('disappear')
            }, scope.delay)
        }

        scope.show=()=>{
            element.removeClass('disappear')
        }
    }
}

Loading.$inject=['fermi.Utils','$timeout']
