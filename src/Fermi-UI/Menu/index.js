import factory from '../external/buildFactory'
import { Menu, SubMenu, MenuItem } from './directive/menu'
import './css/menu.scss'

const component = {
    namespace:'Fermi.menu',
    inject:[]
}

export default angular.module(component.namespace, component.inject)
	.directive('fermiMenu', factory.component(Menu))
    .directive('fermiSubmenu', factory.component(SubMenu))
    .directive('fermiMenuitem', factory.component(MenuItem))
	.name;
