import factory from '../external/directiveFacotry'
import { Radio, RadioGroup } from './directive/radio'
import './css/radio.scss'

const component = {
    namespace:'Fermi.radio',
    inject:[]
}

export default angular.module(component.namespace, component.inject)
	.directive('fermiRadio', factory.create(Radio))
    .directive('fermiRadiogroup', factory.create(RadioGroup))
	.name;
