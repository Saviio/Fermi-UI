import factory from '../utils/directives'
import directive from './directive/breadcrumb'

import './css/breadcrumb.scss'

const component = {
    namespace:'Fermi.breadcrumb',
    name:'fermiBreadcrumb',
    inject:[]
}

export default angular.module(component.namespace, component.inject)
	.directive(component.name, factory.create(directive))
	.name;
