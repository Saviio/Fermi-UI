'use strict';

Object.defineProperty(exports, "__esModule", {
			value: true
});

var _buildFactory = require('../external/buildFactory');

var _buildFactory2 = _interopRequireDefault(_buildFactory);

var _DisableDirective = require('./DisableDirective');

var _DisableDirective2 = _interopRequireDefault(_DisableDirective);

var _RangeFilter = require('./RangeFilter');

var _RangeFilter2 = _interopRequireDefault(_RangeFilter);

var _PlainFilter = require('./PlainFilter');

var _PlainFilter2 = _interopRequireDefault(_PlainFilter);

var _CleanStyleDirective = require('./CleanStyleDirective');

var _CleanStyleDirective2 = _interopRequireDefault(_CleanStyleDirective);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import * as utils from '../utils'

exports.default = angular.module('Fermi.core', []).directive('disabled', _buildFactory2.default.directive(_DisableDirective2.default)).directive('cleanStyle', _buildFactory2.default.directive(_CleanStyleDirective2.default)).filter('range', _RangeFilter2.default).filter('plain', _PlainFilter2.default).name;