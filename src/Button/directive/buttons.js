import template from '../template/template.html'

export default class Buttons {
    constructor(utils){
        this.restrict='EA'
        this.replace=true
        this.scope={
            content:'@',
            control:'='
        }
        this.transclude=true
        this.template=template
        this.utils=utils
        this.controller.$inject=['$scope','$attrs','$element']
    }

    controller($scope,$attrs,$elem){
        let isLoading=this.utils.DOMState($attrs,'loading')
        $scope.loading=isLoading

        let loading= () => {
            if(!$scope.loading){
                $scope.$apply(()=>{
                    $elem.addClass('loading')
                    $scope.loading=true
                })
            }
        }
        let done= () => {
            if($scope.loading){
                $scope.$apply(()=>{
                    $elem.removeClass('loading')
                    $scope.loading=false
                })
            }
        }

        let disable=() => {
            $elem.attr('disabled',true)
            return undefined
        }

        let allow=() => {
            $elem.removeAttr('disabled')
            return undefined
        }

        if($attrs.control!==undefined){
            $scope.control={
                disable,
                allow,
                loading,
                done
            }
        }

        if(isLoading)
            $elem.addClass('loading')
    }

    link(scope,elem,attrs,ctrl){
        let size=(attrs.size || 'default').toLowerCase()
        let type=(attrs.type || 'default').toLowerCase()

        if(size!=='default')
            elem.addClass(`buttons-${size}`)

        elem.addClass(`buttons-${type}`)
    }
}

Buttons.$inject=['fermi.Utils']
