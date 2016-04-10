'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Step = exports.Steps = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _desc, _value, _class, _dec2, _desc2, _value2, _class2;

var _dependencies = require('../../external/dependencies');

var _steps = require('../template/steps.html');

var _steps2 = _interopRequireDefault(_steps);

var _step = require('../template/step.html');

var _step2 = _interopRequireDefault(_step);

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

var Steps = exports.Steps = (_dec = (0, _dependencies.dependencies)('$scope'), (_class = function () {
    function Steps() {
        _classCallCheck(this, Steps);

        this.restrict = 'EA';
        this.replace = true;
        this.scope = {
            size: '@',
            mode: '@',
            control: '=?'
        };
        this.transclude = true;
        this.template = _steps2.default;
    }

    _createClass(Steps, [{
        key: 'controller',
        value: function controller(scope) {
            scope.steps = [];
            scope.mode = (scope.mode && scope.mode.match(/v|h/ig)[0] || 'H').toUpperCase();
            scope.size = scope.size || 'small';
            scope.next = function () {
                var unChecked = scope.steps.filter(function (item) {
                    return item.status() === false;
                });
                unChecked.length > 0 && unChecked[0].check();
                unChecked[1] !== undefined && unChecked[1].inProgress();
            };

            scope.reset = function () {
                scope.steps.forEach(function (item) {
                    return item.cancel();
                });
                scope.steps[0] && scope.steps[0].inProgress();
            };

            scope.isDone = function () {
                return scope.steps.filter(function (item) {
                    return item.status();
                }).length === scope.steps.length;
            };

            scope.control = {
                next: scope.next,
                reset: scope.reset,
                isDone: scope.isDone
            };
        }
    }, {
        key: 'passing',
        value: function passing(exports, scope) {
            exports.add = function (item) {
                scope.steps.push(item);
                return scope.steps.length;
            };
        }
    }, {
        key: 'link',
        value: function link(scope, $element, attrs, ctrl) {
            var rootDOM = $element[0];
            var unit = 96 / scope.steps.length;
            var style = scope.mode === 'H' ? 'width' : 'height';
            var unChecked = scope.steps.filter(function (item) {
                return item.status() === false;
            });
            unChecked.length > 0 && unChecked[0].inProgress();
            if (scope.steps.length >= 2) {
                (function () {
                    var rootUnit = _utils.getStyle.call(rootDOM, style, 'px');
                    setTimeout(function () {
                        var stepStyle = scope.steps.map(function (item) {
                            var _context;

                            return (_context = item.elem, _utils.getStyle).call(_context, style, 'px');
                        });
                        var avg = (rootUnit - stepStyle.reduce(function (pre, cur) {
                            return pre + cur;
                        }) - 3 * stepStyle.length) / (scope.steps.length - 1);
                        for (var i = 0; i < scope.steps.length - 1; i++) {
                            var option = {},
                                elem = scope.steps[i].elem;
                            option[style] = avg + stepStyle[i] + 'px';
                            _utils.setStyle.call(elem, option);
                        }
                    }, 0);
                })();
            }

            //item.$elem.attr('style', `${style}:${unit.toFixed(0)}%;`
        }
    }]);

    return Steps;
}(), (_applyDecoratedDescriptor(_class.prototype, 'controller', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'controller'), _class.prototype)), _class));
var Step = exports.Step = (_dec2 = (0, _dependencies.dependencies)('$scope', '$element'), (_class2 = function () {
    function Step() {
        _classCallCheck(this, Step);

        this.restrict = 'EA';
        this.require = '^fermiSteps';
        this.replace = true;
        this.template = _step2.default;
        this.transclude = true;
        this.scope = {
            title: '@'
        };
    }

    _createClass(Step, [{
        key: 'controller',
        value: function controller(scope, $elem) {
            scope.title = scope.title || ' ';
            scope.checked = _utils.props.call($elem, 'checked');
            scope.state = scope.checked ? 'checked' : 'waiting';
            scope.check = function () {
                scope.checked = true;
                scope.state = 'checked';
            };

            scope.cancel = function () {
                scope.checked = false;
                scope.state = 'waiting';
            };

            scope.inProgress = function () {
                return scope.state = 'inProgress';
            };
            scope.status = function () {
                return scope.checked;
            };
        }
    }, {
        key: 'link',
        value: function link(scope, $element, attrs, parentCtrl) {
            scope.step = parentCtrl.add({
                status: scope.status,
                check: scope.check,
                cancel: scope.cancel,
                inProgress: scope.inProgress,
                elem: $element[0]
            });
        }
    }]);

    return Step;
}(), (_applyDecoratedDescriptor(_class2.prototype, 'controller', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'controller'), _class2.prototype)), _class2));