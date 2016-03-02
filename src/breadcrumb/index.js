import factory from '../external/buildFactory'
import { breadcrumb, breadcrumbItem } from './directive/breadcrumb'

import './css/breadcrumb.scss'

const component = {
    namespace:'Fermi.breadcrumb',
    name:'fermiBreadcrumb',
    inject:[]
}

export default angular.module(component.namespace, component.inject)
	.directive('fermiCrumb', factory.component(breadcrumb))
    .directive('fermiCrumbitem', factory.component(breadcrumbItem))
	.name;
