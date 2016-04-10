'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _buildFactory = require('../external/buildFactory');

var _buildFactory2 = _interopRequireDefault(_buildFactory);

var _modal = require('./service/modal');

var _modal2 = _interopRequireDefault(_modal);

require('../core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var component = {
    namespace: 'Fermi.modal',
    inject: ['Fermi.core']
};
//import './css/modal.scss'


exports.default = angular.module(component.namespace, component.inject).service('Fermi.Modal', _modal2.default).name;