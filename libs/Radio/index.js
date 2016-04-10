'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _buildFactory = require('../external/buildFactory');

var _buildFactory2 = _interopRequireDefault(_buildFactory);

var _radio = require('./directive/radio');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import './css/radio.scss'

var component = {
    namespace: 'Fermi.radio',
    inject: []
};

exports.default = angular.module(component.namespace, component.inject).directive('fermiRadio', _buildFactory2.default.component(_radio.Radio)).directive('fermiRadiogroup', _buildFactory2.default.component(_radio.RadioGroup)).name;