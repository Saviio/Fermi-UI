import factory from '../external/componentFactory'
import { Menu, SubMenu, MenuItem } from './directive/menu'
import './css/menu.scss'

const component = {
    namespace:'Fermi.menu',
    inject:[]
}

export default angular.module(component.namespace, component.inject)
	.directive('fermiMenu', factory.create(Menu))
    .directive('fermiSubmenu', factory.create(SubMenu))
    .directive('fermiMenuitem', factory.create(MenuItem))
	.name;
