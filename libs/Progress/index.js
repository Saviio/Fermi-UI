'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _buildFactory = require('../external/buildFactory');

var _buildFactory2 = _interopRequireDefault(_buildFactory);

var _line = require('./directive/line');

var _line2 = _interopRequireDefault(_line);

var _query = require('./directive/query');

var _query2 = _interopRequireDefault(_query);

var _loading = require('./service/loading');

var _loading2 = _interopRequireDefault(_loading);

var _circle = require('./directive/circle');

var _circle2 = _interopRequireDefault(_circle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
import './css/line.scss'
import './css/query.scss'
import './css/loading.scss'
import './css/circle.scss'

*/

var component = {
   namespace: 'Fermi.progress',
   inject: []
};

exports.default = angular.module(component.namespace, component.inject).directive('fermiLine', _buildFactory2.default.component(_line2.default)).directive('fermiQuery', _buildFactory2.default.component(_query2.default)).directive('fermiCircle', _buildFactory2.default.component(_circle2.default)).service('Fermi.Loading', _loading2.default).name;