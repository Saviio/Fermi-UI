'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _buildFactory = require('../external/buildFactory');

var _buildFactory2 = _interopRequireDefault(_buildFactory);

var _buttons = require('./directive/buttons');

var _buttons2 = _interopRequireDefault(_buttons);

require('./css/buttons.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var component = {
    namespace: 'Fermi.buttons',
    name: 'fermiButtons',
    inject: []
};

exports.default = angular.module(component.namespace, component.inject).directive(component.name, _buildFactory2.default.component(_buttons2.default)).name;