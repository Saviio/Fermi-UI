import factory from '../external/directiveFacotry'
import directive from './directive/radio'
import './css/radio.scss'

const component = {
    namespace:'Fermi.Radio'
    inject:[]
}

export default angular.module(component.namespace, component.inject)
	.directive('fermiRadio', factory.create(directive))
	.name;
