import factory from '../utils/directives'
import fermiDefault from './FermiDefault'
import fermiRangeFilter from './RangeFilter'
//import fermiUtils from './Utils'
import * as utils from '../utils'

let fermiUtils = function(){
	return utils
}

export default angular.module('Fermi.core', [])
	.directive('fermiDefault', factory.create(fermiDefault))
    .filter('range',fermiRangeFilter)
    .factory('fermi.Utils',fermiUtils)
	.name;
