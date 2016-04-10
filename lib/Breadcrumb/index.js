'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _buildFactory = require('../external/buildFactory');

var _buildFactory2 = _interopRequireDefault(_buildFactory);

var _breadcrumb = require('./directive/breadcrumb');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import './css/breadcrumb.scss'

var component = {
    namespace: 'Fermi.breadcrumb',
    name: 'fermiBreadcrumb',
    inject: []
};

exports.default = angular.module(component.namespace, component.inject).directive('fermiCrumb', _buildFactory2.default.component(_breadcrumb.breadcrumb)).directive('fermiCrumbitem', _buildFactory2.default.component(_breadcrumb.breadcrumbItem)).name;