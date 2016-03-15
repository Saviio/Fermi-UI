import factory from '../external/buildFactory'
import fermiDefault from './FermiDefault'
import fermiDisable from './FermiDisable'
import fermiRangeFilter from './RangeFilter'
import fermiPlainFilter from './PlainFilter'
import fermiStyle from './FermiStyle'
import * as utils from '../utils'


export default angular.module('Fermi.core', [])
	.directive('disabled', factory.directive(fermiDisable))
	.directive('cleanStyle', factory.directive(fermiStyle))
    .filter('range', fermiRangeFilter)
	.filter('plain', fermiPlainFilter)
	.name;
