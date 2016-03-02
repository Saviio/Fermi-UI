import factory from '../external/componentFactory'
import {Steps, Step} from './directive/step'

import './css/step.scss'

const component = {
    namespace:'Fermi.step',
    inject:[]
}

export default angular.module(component.namespace, component.inject)
	.directive('fermiSteps', factory.create(Steps))
    .directive('fermiStep', factory.create(Step))
	.name;
