import factory from '../external/componentFactory'
import directive from './directive/pagination'
import './css/pagination.scss'

const component = {
    namespace:'Fermi.pagination',
    name:'fermiPagination',
    inject:[]
}

export default angular.module(component.namespace, component.inject)
	.directive(component.name, factory.create(directive))
	.name;
