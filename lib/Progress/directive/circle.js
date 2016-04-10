'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _class, _desc, _value, _class2;

var _dependencies = require('../../external/dependencies');

var _circle = require('../template/circle.html');

var _circle2 = _interopRequireDefault(_circle);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
        Object['define' + 'Property'](target, property, desc);
        desc = null;
    }

    return desc;
}

var PI = 3.1415926535898;

//Todo 半圆形
var circle = (_dec = (0, _dependencies.dependencies)('$compile'), _dec2 = (0, _dependencies.dependencies)('$scope'), _dec(_class = (_class2 = function () {
    function circle($compile) {
        _classCallCheck(this, circle);

        this.replace = true;
        this.restrict = 'EA';
        this.template = _circle2.default;
        this.scope = {
            value: '=?',
            label: '@'
        };

        this.$compile = $compile;
    }

    _createClass(circle, [{
        key: 'controller',
        value: function controller(scope) {
            scope.dashOffset = function () {
                var C = scope.radius * 2 * PI;
                return {
                    'stroke-dasharray': C + 'px ' + C + 'px',
                    'stroke-dashoffset': '' + (C - C * scope.value / 100)
                };
            };
        }
    }, {
        key: 'link',
        value: function link(scope, $elem, attrs, ctrl) {
            var size = attrs.size || 100;
            var strokeWidth = attrs.strokeWidth || 4;
            var inner = attrs.inner;
            var outer = attrs.outer;
            var shape = attrs.shape || 'round';
            var showinfo = !!(attrs.showinfo || false);
            var isProgress = _utils.props.call($elem, 'progress');
            var defaultValue = ~ ~(_utils.props.call($elem, 'default') || 0);
            var radius = null;

            var moveTo = size / 2;
            scope.radius = radius = moveTo - strokeWidth / 2;
            scope.value = scope.value || defaultValue;
            var paths = $elem.find('path');

            for (var i = 0; i < paths.length; i++) {
                paths[i].setAttribute('d', 'M ' + moveTo + ',' + moveTo + ' m 0,-' + radius + ' a ' + radius + ',' + radius + ' 0 1 1 0,' + radius * 2 + ' a ' + radius + ',' + radius + ' 0 1 1 0,-' + radius * 2);
                paths[i].setAttribute('stroke-width', strokeWidth);
            }

            paths[paths.length - 1].setAttribute('stroke-linecap', shape);
            if (inner) {
                var _context;

                (_context = paths[0], _utils.setStyle).call(_context, { 'stroke': inner });
            }

            if (outer) {
                var _context2;

                (_context2 = paths[1], _utils.setStyle).call(_context2, { 'stroke': outer });
            }

            if (showinfo) {
                var format = (attrs.format || '${percent}').replace('${percent}', function ($0) {
                    return '{{value}}';
                });
                var unit = typeof attrs.unit === 'string' ? attrs.unit : '%';
                var tmpl = '<span>' + format + ' ' + (unit ? '<sup>' + unit + '</sup>' : '') + '</span>';
                var innerDIV = $elem.find('div').append(tmpl);
                this.$compile(innerDIV.find('span'))(scope);
            }

            if (isProgress) {
                (function () {
                    var inProgress = scope.ngModal >= 100;
                    var success = function success() {
                        $elem.addClass('fm-progress-success');
                        inProgress = false;
                    };

                    var notComplete = function notComplete() {
                        $elem.removeClass('fm-progress-success');
                        inProgress = true;
                    };

                    var valueCheck = function valueCheck() {
                        if (scope.value > 100) scope.value = 100;else if (scope.value < 0) scope.value = 0;
                    };

                    scope.$watch('value', function (newValue, oldValue) {
                        if (newValue === oldValue) return;
                        valueCheck();
                        if (newValue >= 100 && inProgress) {
                            setTimeout(success, 0);
                        } else if (!inProgress && newValue < 100) {
                            setTimeout(notComplete, 0);
                        }
                    });
                })();
            }

            var svg = $elem.find('svg')[0];
            svg.setAttribute('viewBox', '0 0 ' + size + ' ' + size);
        }
    }]);

    return circle;
}(), (_applyDecoratedDescriptor(_class2.prototype, 'controller', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'controller'), _class2.prototype)), _class2)) || _class);
exports.default = circle;