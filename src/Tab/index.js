import factory from '../utils/directives'
import {Tabs,Tab} from './directive/Tab'

import './css/Tab.css'


const component = {
    namespace:'Fermi.Tabs',
    inject:[]
}

export default angular.module('Fermi.Tab', [])
	.directive('fermiTabs', factory.create(Tabs))
    .directive('fermiTab',factory.create(Tab))
	.name
