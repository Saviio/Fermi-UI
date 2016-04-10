'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _buildFactory = require('../external/buildFactory');

var _buildFactory2 = _interopRequireDefault(_buildFactory);

var _tooltip = require('./directive/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

require('../core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var component = {
    namespace: 'Fermi.tooltip',
    name: 'fermiTooltip',
    inject: ['Fermi.core']
};
//import './css/tooltip.scss'


exports.default = angular.module(component.namespace, component.inject).directive(component.name, _buildFactory2.default.component(_tooltip2.default)).name;