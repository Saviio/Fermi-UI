import factory from '../external/componentFactory'
import directive from './directive/popover'

import './css/popover.scss'

const component = {
    namespace:'Fermi.popover',
    name:'fermiPopover',
    inject:[]
}

export default angular.module(component.namespace, component.inject)
	.directive(component.name, factory.create(directive))
	.name;
