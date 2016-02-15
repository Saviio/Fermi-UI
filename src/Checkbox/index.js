import factory from '../external/directiveFacotry'
import { Menu, SubMenu, MenuItem } from './directive/checkbox'
import './css/checkbox.scss'

const component = {
    namespace:'Fermi.Checkbox'
    inject:[]
}

export default angular.module(component.namespace, component.inject)
	.directive('fermiDropdown', factory.create(Menu))
	.name;
