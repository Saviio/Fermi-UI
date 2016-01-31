import factory from '../external/directiveFacotry'
import { Menu, SubMenu, MenuItem } from './directive/dropdown'
import './css/dropdown.scss'

const component = {
    namespace:'Fermi.Dropdown'
    inject:['Fermi.Menu']
}

export default angular.module(component.namespace, component.inject)
	.directive('fermiDropdown', factory.create(Menu))
	.name;
