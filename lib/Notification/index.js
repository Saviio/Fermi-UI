'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _notification = require('./service/notification');

var _notification2 = _interopRequireDefault(_notification);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import './css/notification.scss'

var service = {
    namespace: 'Fermi.notification',
    name: 'fermiNotification',
    inject: []
};

exports.default = angular.module(service.namespace, service.inject).service('Fermi.Notification', _notification2.default).name;