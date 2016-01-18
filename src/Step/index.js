import factory from '../external/directiveFacotry'
import {Steps, Step} from './directive/step'

import './css/step.scss'

const component = {
    namespace:'Fermi.step',
    name:'fermiStep',
    inject:[]
}

export default angular.module(component.namespace, component.inject)
	.directive('fermiSteps', factory.create(Steps))
    .directive('fermiStep', factory.create(Step))
	.name;
