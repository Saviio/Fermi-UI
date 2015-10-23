import factory from '../utils/directives'
import directive from './directive/schedule'
import './css/schedule.css'
import '../core/core.js'

const component = {
    namespace:'Fermi.schedule',
    name:'fermiSchedule',
    inject:['Fermi.core']
}

export default angular.module(component.namespace, component.inject)
	.directive(component.name, factory.create(directive))
	.name;
