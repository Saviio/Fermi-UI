'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.dependencies = dependencies;

var _utils = require('../utils');

function dependencies() {
    for (var _len = arguments.length, injection = Array(_len), _key = 0; _key < _len; _key++) {
        injection[_key] = arguments[_key];
    }

    return function (target, key, descriptor) {
        var _context;

        if (injection.length === 1 && (_context = injection[0], _utils.getType).call(_context) === 'Array') {
            injection = injection[0];
        }

        if (target !== null && key === undefined && descriptor === undefined) {
            target.$inject = injection;
            return target;
        } else {
            if (key === 'controller') {
                var raw = descriptor.value;
                raw.$inject = injection;
                Object.defineProperty(target, key, _extends({}, descriptor, {
                    value: raw
                }));
            }
        }
    };
}