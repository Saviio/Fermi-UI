'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _buildFactory = require('../external/buildFactory');

var _buildFactory2 = _interopRequireDefault(_buildFactory);

var _EnhanceAttributeDirective = require('./EnhanceAttributeDirective');

var _RangeFilter = require('./RangeFilter');

var _RangeFilter2 = _interopRequireDefault(_RangeFilter);

var _PlainFilter = require('./PlainFilter');

var _PlainFilter2 = _interopRequireDefault(_PlainFilter);

var _CleanStyleDirective = require('./CleanStyleDirective');

var _CleanStyleDirective2 = _interopRequireDefault(_CleanStyleDirective);

var _i18n = require('./i18n.js');

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import * as utils from '../utils'

var i18nTrans = _i18n2.default.transform.bind(_i18n2.default);

exports.default = angular.module('Fermi.core', []).directive('disabled', _buildFactory2.default.directive(_EnhanceAttributeDirective.disabled)).directive('checked', _buildFactory2.default.directive(_EnhanceAttributeDirective.checked)).directive('cleanStyle', _buildFactory2.default.directive(_CleanStyleDirective2.default)).filter('range', _RangeFilter2.default).filter('plain', _PlainFilter2.default).filter('translate', i18nTrans).provider('FMi18n', function () {
	this.locale = function (lang) {
		return _i18n2.default.locale(lang);
	};
	this.$get = _i18n2.default;
}).name;