import factory from '../external/directiveFacotry'
import { breadcrumb, breadcrumbItem } from './directive/breadcrumb'

import './css/breadcrumb.scss'

const component = {
    namespace:'Fermi.breadcrumb',
    name:'fermiBreadcrumb',
    inject:[]
}

export default angular.module(component.namespace, component.inject)
	.directive('fermiBreadcrumb', factory.create(breadcrumb)) //remark crumb & crumbItem
    .directive('fermiBreadcrumbitem', factory.create(breadcrumbItem))
	.name;
