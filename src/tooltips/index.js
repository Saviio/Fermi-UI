
import factory from '../utils/directives'
import directive from './directive/tooltips'
import '../core/core.js'
import './css/tooltips.css'

const component = {
    namespace:'Fermi.tooltip',
    name:'fermiTooltip',
    inject:[
        'Fermi.core'
    ]
}

export default angular.module(component.namespace, component.inject)
	.directive(component.name, factory.create(directive))
	.name;
