'use strict';

Object.defineProperty(exports, "__esModule", {
			value: true
});

var _buildFactory = require('../external/buildFactory');

var _buildFactory2 = _interopRequireDefault(_buildFactory);

var _Tab = require('./directive/Tab');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import './css/Tab.scss'

exports.default = angular.module('Fermi.tab', []).directive('fermiTabs', _buildFactory2.default.component(_Tab.Tabs)).directive('fermiTab', _buildFactory2.default.component(_Tab.Tab)).name;