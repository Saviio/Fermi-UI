import factory from '../utils/directives'
import line from './directive/line'
import query from './directive/query'

import './css/line.scss'
import './css/query.scss'

const component = {
    namespace:'Fermi.progress',
    inject:[]
}

export default angular.module(component.namespace, component.inject)
	.directive('fermiLineprogress', factory.create(line))
    .directive('fermiQueryprogress',factory.create(query))
	.name;
