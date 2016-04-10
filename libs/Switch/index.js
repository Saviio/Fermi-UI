'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _buildFactory = require('../external/buildFactory');

var _buildFactory2 = _interopRequireDefault(_buildFactory);

var _switch = require('./directive/switch');

var _switch2 = _interopRequireDefault(_switch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import './css/switch.scss'

var component = {
    namespace: 'Fermi.switch',
    name: 'fermiSwitch',
    inject: []
};

exports.default = angular.module(component.namespace, component.inject).directive(component.name, _buildFactory2.default.component(_switch2.default)).name;