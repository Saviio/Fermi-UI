import { dependencies } from '../../external/dependencies'
import template from '../template/circle.html'
import {
    props,
    setStyle
} from '../../utils'

const PI = 3.1415926535898

//Todo 半圆形
@dependencies('$compile')
export default class circle{
    constructor($compile){
        this.replace = true
        this.restrict = 'EA'
        this.template = template
        this.scope = {
            value:'=?',
            label:'@'
        }

        this.$compile = $compile
    }

    @dependencies('$scope')
    controller(scope){
        scope.dashOffset = () => {
            const C = scope.radius * 2 * PI
            return {
                'stroke-dasharray'  : `${C}px ${C}px`,
                'stroke-dashoffset' : `${C - C * scope.value / 100}`
            }
        }

    }

    link(scope, $elem, attrs, ctrl){
        let size = attrs.size || 100
        let strokeWidth = attrs.strokeWidth || 4
        let inner = attrs.inner
        let outer = attrs.outer
        let shape = attrs.shape || 'round'
        let showinfo = !!(attrs.showinfo || false)
        let isProgress = $elem::props('progress')
        let defaultValue = ~~($elem::props('default')  || 0)
        let radius = null

        let moveTo = size / 2
        scope.radius = radius = moveTo - (strokeWidth / 2)
        scope.value = scope.value || defaultValue
        let paths = $elem.find('path')

        for(let i = 0;i < paths.length; i++){
            paths[i].setAttribute('d',`M ${moveTo},${moveTo} m 0,-${radius} a ${radius},${radius} 0 1 1 0,${radius * 2} a ${radius},${radius} 0 1 1 0,-${radius * 2}`)
            paths[i].setAttribute('stroke-width', strokeWidth)
        }

        paths[paths.length - 1].setAttribute('stroke-linecap', shape)
        if(inner){
            paths[0]::setStyle({ 'stroke': inner })
        }

        if(outer){
            paths[1]::setStyle({ 'stroke': outer })
        }

        if(showinfo){
            let format = (attrs.format || '${percent}').replace('${percent}', $0 => '{{value}}')
            let unit   =  typeof attrs.unit === 'string' ? attrs.unit : '%'
            let tmpl   = `<span>${format} ${unit ? '<sup>'+unit+'</sup>' :''}</span>`
            let innerDIV = $elem.find('div').append(tmpl)
            this.$compile(innerDIV.find('span'))(scope)
        }


        if(isProgress){
            let inProgress = scope.ngModal >= 100
            let success = () => {
                $elem.addClass('fm-progress-success')
                inProgress = false
            }

            let notComplete = () => {
                $elem.removeClass('fm-progress-success')
                inProgress = true
            }

            let valueCheck = () => {
                if(scope.value > 100) scope.value = 100
                else if(scope.value < 0) scope.value = 0
            }

            scope.$watch('value',(newValue, oldValue) => {
                if(newValue === oldValue) return
                valueCheck()
                if(newValue >= 100 && inProgress){
                    setTimeout(success, 0)
                } else if(!inProgress && newValue < 100){
                    setTimeout(notComplete, 0)
                }
            })
        }

        let svg = $elem.find('svg')[0]
        svg.setAttribute('viewBox', `0 0 ${size} ${size}`)
    }
}
