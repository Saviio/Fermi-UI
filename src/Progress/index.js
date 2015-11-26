import factory from '../utils/directives'
import line from './directive/line'
import query from './directive/query'
import loading from './service/loading'
import circle from './directive/circle'

import './css/line.scss'
import './css/query.scss'
import './css/loading.scss'

const component = {
    namespace:'Fermi.progress',
    inject:[]
}
//.directive('fermiLoadingbar',factory.create(test))
export default angular.module(component.namespace, component.inject)
	.directive('fermiLineprogress', factory.create(line))
    .directive('fermiQuerybar',factory.create(query))
    .directive('fermiCircleprogress',factory.create(circle))
    .service('Fermi.Loading',loading)
	.name;
