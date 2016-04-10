'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _buildFactory = require('../external/buildFactory');

var _buildFactory2 = _interopRequireDefault(_buildFactory);

var _select = require('./directive/select');

require('./css/select.scss');

require('../core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var component = {
    namespace: 'Fermi.select',
    name: 'fermiSelect',
    inject: ['Fermi.core']
};

exports.default = angular.module(component.namespace, component.inject).directive('fermiSelect', _buildFactory2.default.component(_select.Select)).directive('fermiOption', _buildFactory2.default.component(_select.Option)).name;