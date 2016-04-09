import factory from '../external/buildFactory'
import { disabled, checked } from './EnhanceAttributeDirective'
import rangeFilter from './RangeFilter'
import plainFilter from './PlainFilter'
import cleanStyle from './CleanStyleDirective'
import i18n from './i18n.js'
//import * as utils from '../utils'

let i18nTrans = i18n.transform.bind(i18n)

export default angular.module('Fermi.core', [])
	.directive('disabled', factory.directive(disabled))
	.directive('checked', factory.directive(checked))
	.directive('cleanStyle', factory.directive(cleanStyle))
    .filter('range', rangeFilter)
	.filter('plain', plainFilter)
	.filter('translate', i18nTrans)
	.provider('FMi18n', function(){
		this.locale = lang => i18n.locale(lang)
		this.$get = i18n
	})
	.name
