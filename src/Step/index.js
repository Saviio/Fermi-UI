import factory from '../external/buildFactory'
import {Steps, Step} from './directive/step'

import './css/step.scss'

const component = {
    namespace:'Fermi.step',
    inject:[]
}

export default angular.module(component.namespace, component.inject)
	.directive('fermiSteps', factory.component(Steps))
    .directive('fermiStep', factory.component(Step))
	.name;
