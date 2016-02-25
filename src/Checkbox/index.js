import factory from '../external/directiveFacotry'
import { Checkbox } from './directive/checkbox'
import './css/checkbox.scss'

const component = {
    namespace:'Fermi.checkbox',
    inject:[]
}

export default angular.module(component.namespace, component.inject)
	.directive('fermiCheckbox', factory.create(Checkbox))
	.name;
