'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _buildFactory = require('../external/buildFactory');

var _buildFactory2 = _interopRequireDefault(_buildFactory);

var _tooltips = require('./directive/tooltips');

var _tooltips2 = _interopRequireDefault(_tooltips);

require('./css/tooltips.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var component = {
    namespace: 'Fermi.tooltip',
    name: 'fermiTooltip',
    inject: ['Fermi.core']
};

exports.default = angular.module(component.namespace, component.inject).directive(component.name, _buildFactory2.default.component(_tooltips2.default)).name;