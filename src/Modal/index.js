import factory from '../external/buildFactory'
import modal from './service/modal'
import './css/modal.scss'
import '../core'

const component = {
    namespace:'Fermi.modal',
    inject:['Fermi.core']
}

export default angular.module(component.namespace, component.inject)
	.service('Fermi.Modal', modal)
	.name
