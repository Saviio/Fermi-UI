'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _buildFactory = require('../external/buildFactory');

var _buildFactory2 = _interopRequireDefault(_buildFactory);

var _popover = require('./directive/popover');

var _popover2 = _interopRequireDefault(_popover);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import './css/popover.scss'

var component = {
    namespace: 'Fermi.popover',
    name: 'fermiPopover',
    inject: []
};

exports.default = angular.module(component.namespace, component.inject).directive(component.name, _buildFactory2.default.component(_popover2.default)).name;