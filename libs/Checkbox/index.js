'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _buildFactory = require('../external/buildFactory');

var _buildFactory2 = _interopRequireDefault(_buildFactory);

var _checkbox = require('./directive/checkbox');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import './css/checkbox.scss'

var component = {
    namespace: 'Fermi.checkbox',
    inject: []
};

exports.default = angular.module(component.namespace, component.inject).directive('fermiCheckbox', _buildFactory2.default.component(_checkbox.Checkbox)).name;