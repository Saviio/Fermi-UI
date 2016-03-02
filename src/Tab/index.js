import factory from '../external/componentFactory'
import { Tabs, Tab } from './directive/Tab'

import './css/Tab.scss'


export default angular.module('Fermi.tab', [])
	.directive('fermiTabs', factory.create(Tabs))
    .directive('fermiTab',factory.create(Tab))
	.name
