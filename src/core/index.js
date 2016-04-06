import factory from '../external/buildFactory'
import { disabled, checked } from './EnhanceAttributeDirective'
import rangeFilter from './RangeFilter'
import plainFilter from './PlainFilter'
import cleanStyle from './CleanStyleDirective'
//import * as utils from '../utils'


export default angular.module('Fermi.core', [])
	.directive('disabled', factory.directive(disabled))
	.directive('checked', factory.directive(checked))
	.directive('cleanStyle', factory.directive(cleanStyle))
    .filter('range', rangeFilter)
	.filter('plain', plainFilter)
	.name;
