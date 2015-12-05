import factory from '../external/directiveFacotry'
import directive from './directive/schedule'
import './css/schedule.scss'
import '../core'

const component = {
    namespace:'Fermi.schedule',
    name:'fermiSchedule',
    inject:['Fermi.core']
}

export default angular.module(component.namespace, component.inject)
	.directive(component.name, factory.create(directive))
	.name;
