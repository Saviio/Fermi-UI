'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _buildFactory = require('../external/buildFactory');

var _buildFactory2 = _interopRequireDefault(_buildFactory);

var _schedule = require('./directive/schedule');

var _schedule2 = _interopRequireDefault(_schedule);

require('./css/schedule.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import '../core'

var component = {
    namespace: 'Fermi.schedule',
    name: 'fermiSchedule',
    inject: ['Fermi.core']
};

exports.default = angular.module(component.namespace, component.inject).directive(component.name, _buildFactory2.default.component(_schedule2.default)).name;