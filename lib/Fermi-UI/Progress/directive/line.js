'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _desc, _value, _class;

var _dependencies = require('../../external/dependencies');

var _line = require('../template/line.html');

var _line2 = _interopRequireDefault(_line);

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

var Line = (_dec = (0, _dependencies.dependencies)('$scope'), (_class = function () {
    function Line() {
        _classCallCheck(this, Line);

        this.replace = true;
        this.restrict = 'EA';
        this.scope = {
            success: '=?',
            value: '=',
            label: '@'
        };
        this.template = _line2.default;
    }

    _createClass(Line, [{
        key: 'compile',
        value: function compile($tElement, tAttrs, transclude) {
            var _context;

            this.rootDOM = $tElement[0];
            var unit = tAttrs.unit || '%';
            var binding = (_context = this.rootDOM, _utils.query).call(_context, '.fm-progress-line-text');
            binding.innerHTML += unit;
            return this.link;
        }
    }, {
        key: 'controller',
        value: function controller(scope) {}
    }, {
        key: 'link',
        value: function link(scope, $elem, attrs, ctrl) {
            var _this = this;

            var defaultValue = ~ ~(_utils.props.call($elem, 'default') || 0);

            scope.value = defaultValue;

            var valueCheck = function valueCheck() {
                if (scope.value > 100) scope.value = 100;else if (scope.value < 0) scope.value = 0;
            };

            var inProgress = scope.value >= 100;

            var success = function success() {
                var _context2;

                (_context2 = _this.rootDOM, _utils.addClass).call(_context2, 'fm-progress-success');
                if (typeof scope.success === 'function') scope.success();
            };

            var notComplete = function notComplete() {
                var _context3;

                (_context3 = _this.rootDOM, _utils.removeClass).call(_context3, 'fm-progress-success');
            };

            scope.$watch('value', function (newValue, oldValue) {
                if (newValue === oldValue) return;
                valueCheck();
                if (newValue >= 100 && inProgress) {
                    inProgress = false;
                    setTimeout(success, 0);
                } else if (!inProgress && newValue < 100) {
                    inProgress = true;
                    setTimeout(notComplete, 0);
                }
            });
        }
    }]);

    return Line;
}(), (_applyDecoratedDescriptor(_class.prototype, 'controller', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'controller'), _class.prototype)), _class));
exports.default = Line;