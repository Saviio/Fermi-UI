import factory from '../external/directiveFacotry'
import directive from './directive/checkbox'
import './css/checkbox.scss'

const component = {
    namespace:'Fermi.Checkbox'
    inject:[]
}

export default angular.module(component.namespace, component.inject)
	.directive('fermiCheckbox', factory.create(directive))
	.name;
