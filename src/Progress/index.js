import factory from '../external/buildFactory'
import line from './directive/line'
import query from './directive/query'
import loading from './service/loading'
import circle from './directive/circle'

/*
import './css/line.scss'
import './css/query.scss'
import './css/loading.scss'
import './css/circle.scss'

*/

const component = {
    namespace:'Fermi.progress',
    inject:[]
}

export default angular.module(component.namespace, component.inject)
	.directive('fermiLine', factory.component(line))
    .directive('fermiQuery',factory.component(query))
    .directive('fermiCircle',factory.component(circle))
    .service('Fermi.Loading',loading)
	.name;
