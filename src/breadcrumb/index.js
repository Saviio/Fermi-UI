import factory from '../external/componentFactory'
import { breadcrumb, breadcrumbItem } from './directive/breadcrumb'

import './css/breadcrumb.scss'

const component = {
    namespace:'Fermi.breadcrumb',
    name:'fermiBreadcrumb',
    inject:[]
}

export default angular.module(component.namespace, component.inject)
	.directive('fermiCrumb', factory.create(breadcrumb))
    .directive('fermiCrumbitem', factory.create(breadcrumbItem))
	.name;
