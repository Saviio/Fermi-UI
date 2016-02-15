import factory from '../external/directiveFacotry'
import modal from './directive/modal'
import './css/modal.scss'

const component = {
    namespace:'Fermi.Modal'
    inject:[]
}

export default angular.module(component.namespace, component.inject)
	.directive('fermiModal', factory.create(modal))
	.name;
