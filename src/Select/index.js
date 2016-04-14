import factory from '../external/buildFactory'
import { Select, Option } from './directive/select'
import './css/select.scss'
import '../Core'

const component = {
    namespace:'Fermi.select',
    name:'fermiSelect',
    inject:['Fermi.core']
}

export default angular.module(component.namespace, component.inject)
	.directive('fermiSelect', factory.component(Select))
    .directive('fermiOption', factory.component(Option))
	.name;
