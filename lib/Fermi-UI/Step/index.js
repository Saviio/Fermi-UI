'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _buildFactory = require('../external/buildFactory');

var _buildFactory2 = _interopRequireDefault(_buildFactory);

var _step = require('./directive/step');

require('./css/step.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var component = {
    namespace: 'Fermi.step',
    inject: []
};

exports.default = angular.module(component.namespace, component.inject).directive('fermiSteps', _buildFactory2.default.component(_step.Steps)).directive('fermiStep', _buildFactory2.default.component(_step.Step)).name;