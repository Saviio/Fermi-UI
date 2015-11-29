import factory from '../utils/directives'
import {Tabs,Tab} from './directive'

import './css/Tab.scss'


export default angular.module('Fermi.tab', [])
	.directive('fermiTabs', factory.create(Tabs))
    .directive('fermiTab',factory.create(Tab))
	.name
