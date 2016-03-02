import factory from '../external/componentFactory'
import fermiDefault from './FermiDefault'
import fermiRangeFilter from './RangeFilter'
import fermiPlainFilter from './PlainFilter'
//import fermiUtils from './Utils'
import * as utils from '../utils'


export default angular.module('Fermi.core', [])
	.directive('fermiDefault', (...args) => new fermiDefault(...args))
    .filter('range', fermiRangeFilter)
	.filter('plain', fermiPlainFilter)
    //.factory('fermi.Utils',() => utils)
	.name;
