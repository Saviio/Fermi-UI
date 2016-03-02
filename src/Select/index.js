import factory from '../external/componentFactory'
import {Select,Option} from './directive/select'
import './css/select.scss'

const component = {
    namespace:'Fermi.select',
    name:'fermiSelect',
    inject:[]
}

export default angular.module(component.namespace, component.inject)
	.directive('fermiSelect', factory.create(Select))
    .directive('fermiOption', factory.create(Option))
	.name;
