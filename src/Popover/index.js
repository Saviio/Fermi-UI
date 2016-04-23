import factory from '../external/buildFactory'
import directive from './directive/popover'

//import './css/popover.scss'

const component = {
    namespace:'Fermi.popover',
    name:'fermiPopover',
    inject:[]
}

export default angular.module(component.namespace, component.inject)
	.directive(component.name, factory.component(directive))
	.name;
