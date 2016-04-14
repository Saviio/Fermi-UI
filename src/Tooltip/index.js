import factory from '../external/buildFactory'
import directive from './directive/tooltip'
import './css/tooltip.scss'
import '../Core'

const component = {
    namespace:'Fermi.tooltip',
    name:'fermiTooltip',
    inject:['Fermi.core']
}

export default angular.module(component.namespace, component.inject)
	.directive(component.name, factory.component(directive))
	.name;
