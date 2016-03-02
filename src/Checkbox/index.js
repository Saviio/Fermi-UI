import factory from '../external/buildFactory'
import { Checkbox } from './directive/checkbox'
import './css/checkbox.scss'

const component = {
    namespace:'Fermi.checkbox',
    inject:[]
}

export default angular.module(component.namespace, component.inject)
	.directive('fermiCheckbox', factory.component(Checkbox))
	.name;
