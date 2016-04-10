'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _buildFactory = require('../external/buildFactory');

var _buildFactory2 = _interopRequireDefault(_buildFactory);

var _pagination = require('./directive/pagination');

var _pagination2 = _interopRequireDefault(_pagination);

require('../core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var component = {
    namespace: 'Fermi.pagination',
    name: 'fermiPagination',
    inject: ['Fermi.core']
};
//import './css/pagination.scss'


exports.default = angular.module(component.namespace, component.inject).directive(component.name, _buildFactory2.default.component(_pagination2.default)).name;