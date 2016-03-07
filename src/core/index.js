import factory from '../external/buildFactory'
import fermiDefault from './FermiDefault'
import fermiDisable from './FermiDisable'
import fermiRangeFilter from './RangeFilter'
import fermiPlainFilter from './PlainFilter'
//import fermiUtils from './Utils'
import * as utils from '../utils'


export default angular.module('Fermi.core', [])
	.directive('fermiDefault', factory.directive(fermiDefault))
	.directive('disabled', factory.directive(fermiDisable))
    .filter('range', fermiRangeFilter)
	.filter('plain', fermiPlainFilter)
    //.factory('fermi.Utils',() => utils)
	.name;
