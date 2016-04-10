'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _buildFactory = require('../external/buildFactory');

var _buildFactory2 = _interopRequireDefault(_buildFactory);

var _menu = require('./directive/menu');

require('./css/menu.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var component = {
   namespace: 'Fermi.menu',
   inject: []
};

exports.default = angular.module(component.namespace, component.inject).directive('fermiMenu', _buildFactory2.default.component(_menu.Menu)).directive('fermiSubmenu', _buildFactory2.default.component(_menu.SubMenu)).directive('fermiMenuitem', _buildFactory2.default.component(_menu.MenuItem)).name;