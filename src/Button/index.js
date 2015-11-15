import factory from '../utils/directives'
import directive from './directive/buttons'
import './css/buttons.scss'

const component = {
    namespace:'Fermi.buttons',
    name:'fermiButtons',
    inject:[]
}

export default angular.module(component.namespace, component.inject)
	.directive(component.name, factory.create(directive))
	.name;
