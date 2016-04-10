import factory from '../external/buildFactory'
import { Radio, RadioGroup } from './directive/radio'
//import './css/radio.scss'

const component = {
    namespace:'Fermi.radio',
    inject:[]
}

export default angular.module(component.namespace, component.inject)
	.directive('fermiRadio', factory.component(Radio))
    .directive('fermiRadiogroup', factory.component(RadioGroup))
	.name;
