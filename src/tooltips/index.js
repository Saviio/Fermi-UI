
import factory from '../external/componentFactory'
import directive from './directive/tooltips'
import '../core'
import './css/tooltips.scss'

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
