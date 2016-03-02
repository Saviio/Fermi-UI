import factory from '../external/componentFactory'
import directive from './directive/switch'
import './css/switch.scss'

const component = {
    namespace:'Fermi.switch',
    name:'fermiSwitch',
    inject:[]
}

export default angular.module(component.namespace, component.inject)
	.directive(component.name, factory.create(directive))
	.name;
