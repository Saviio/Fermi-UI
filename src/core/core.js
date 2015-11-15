import factory from '../utils/directives'
import fermiDefault from './FermiDefault'
import fermiRangeFilter from './RangeFilter'
import fermiUtils from './Utils'

export default angular.module('Fermi.core', [])
	.directive('fermiDefault', factory.create(fermiDefault))
    .filter('range',fermiRangeFilter)
    .factory('fermi.Utils',fermiUtils)
	.name;
