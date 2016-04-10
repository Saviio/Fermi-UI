import factory from '../external/buildFactory'
import { Tabs, Tab } from './directive/Tab'

//import './css/Tab.scss'


export default angular.module('Fermi.tab', [])
	.directive('fermiTabs', factory.component(Tabs))
    .directive('fermiTab',factory.component(Tab))
	.name
