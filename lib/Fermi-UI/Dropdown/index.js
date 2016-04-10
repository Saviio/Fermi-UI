'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _buildFactory = require('../external/buildFactory');

var _buildFactory2 = _interopRequireDefault(_buildFactory);

var _dropdown = require('./directive/dropdown');

require('./css/dropdown.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var component = {
    namespace: 'Fermi.Dropdown',
    inject: ['Fermi.Menu']
};

exports.default = angular.module(component.namespace, component.inject).directive('fermiDropdown', _buildFactory2.default.component(_dropdown.Menu)).name;