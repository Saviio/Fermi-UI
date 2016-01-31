import factory from '../external/directiveFacotry'
import { Menu, SubMenu, MenuItem } from './directive/menu'
import './css/menu.scss'

const component = {
    namespace:'Fermi.Menu'
    inject:[]
}

export default angular.module(component.namespace, component.inject)
	.directive('fermiMenu', factory.create(Menu))
    .directive('fermiSubMenu', factory.create(SubMenu))
    .directive('fermiMenuItem', factory.create(MenuItem))
	.name;
