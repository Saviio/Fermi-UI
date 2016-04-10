'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RadioGroup = exports.Radio = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _desc, _value, _class, _dec2, _desc2, _value2, _class2;

var _dependencies = require('../../external/dependencies');

var _template = require('../template/template.html');

var _template2 = _interopRequireDefault(_template);

var _radioGroup = require('../template/radioGroup.html');

var _radioGroup2 = _interopRequireDefault(_radioGroup);

var _browser = require('../../utils/browser');

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

var SEPARATED = 1;
var GROUP = 2;

//disable
//checked
//onchange
//value

var Radio = exports.Radio = (_dec = (0, _dependencies.dependencies)('$scope', '$element'), (_class = function () {
    function Radio() {
        _classCallCheck(this, Radio);

        this.restrict = 'EA';
        this.replace = true;
        this.scope = {
            change: '=?',
            label: '@',
            control: '=?'
        };
        this.template = _template2.default;
        this.require = '?^^fermiRadiogroup';
    }

    _createClass(Radio, [{
        key: 'controller',
        value: function controller(scope, $element) {
            var _context,
                _this = this;

            this.rootDOM = $element[0];
            this.radioElem = (_context = this.rootDOM, _utils.query).call(_context, '.fm-radio');
            this.input = (_context = this.rootDOM, _utils.query).call(_context, '[type=radio]');
            this.input.disabled = this.disabled = !!((_context = this.rootDOM, _utils.props).call(_context, 'disabled') || false);

            var disable = function disable() {
                _this.disabled = _this.input.disabled = true;
                _this.rootDOM.setAttribute('disabled', 'disabled');
            };

            var allow = function allow() {
                _this.disabled = _this.input.disabled = false;
                _this.rootDOM.removeAttribute('disabled');
            };

            scope.control = {
                disable: disable,
                allow: allow
            };

            this.callback = typeof scope.change === 'function' ? scope.change : _utils.noop;

            Object.defineProperty(scope.control, 'checked', {
                set: function set(value) {
                    return !!value ? _this.input.click() : _this.unCheck();
                },
                get: function get() {
                    return _this.input.checked;
                }
            });

            Object.defineProperty(scope.control, 'value', {
                set: function set(newValue) {
                    return _this.input.setAttribute('value', newValue);
                },
                get: function get() {
                    return _this.input.value;
                }
            });

            scope.$on('destory', function () {
                return _this.scope = null;
            });
        }
    }, {
        key: 'link',
        value: function link(scope, $elem, attrs, ctrl) {
            var _context2;

            this.scope = scope;
            this.input.value = (_context2 = this.rootDOM, _utils.props).call(_context2, 'value');
            this.mode = ctrl && ctrl.mode || SEPARATED;
            (_context2 = this.input, _utils.on).call(_context2, 'click', this.handle.bind(this));
            if (this.mode === GROUP && typeof ctrl.callback === 'function') {
                //如果radio被group元素包裹，并且父元素中声明了change函数则忽略radio元素上的change函数
                this.callback = ctrl.callback;
            }

            if ((_context2 = this.rootDOM, _utils.props).call(_context2, 'checked')) {
                this.check();
                this.pop();
                this.rootDOM.removeAttribute('checked');
            }
        }
    }, {
        key: 'check',
        value: function check() {
            var _context3;

            (_context3 = this.radioElem, _utils.addClass).call(_context3, 'fm-radio-checked');
            this.input.checked = true;
            if (!/\$apply|\$digest/.test(this.scope.$root.$$phase)) this.scope.$apply();
        }
    }, {
        key: 'unCheck',
        value: function unCheck() {
            var _context4;

            (_context4 = this.radioElem, _utils.removeClass).call(_context4, 'fm-radio-checked');
            //change the state of native radio component manually.
            this.input.checked = false;
            if (!/\$apply|\$digest/.test(this.scope.$root.$$phase)) this.scope.$apply();
        }
    }, {
        key: 'handle',
        value: function handle(e) {
            if (this.disabled) return;

            this.check();
            this.callback(this.input.value);
            this.pop();
        }
    }, {
        key: 'pop',
        value: function pop() {
            if (this.mode === GROUP) {
                this.scope.$emit('radio::selected', this.input);
            }
        }
    }]);

    return Radio;
}(), (_applyDecoratedDescriptor(_class.prototype, 'controller', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'controller'), _class.prototype)), _class));
var RadioGroup = exports.RadioGroup = (_dec2 = (0, _dependencies.dependencies)('$scope', '$element'), (_class2 = function () {
    function RadioGroup() {
        _classCallCheck(this, RadioGroup);

        this.scope = {
            change: '=?',
            control: '=?'
        };
        this.restrict = 'EA';
        this.replace = true;
        this.transclude = true;
        this.template = _radioGroup2.default;
    }

    _createClass(RadioGroup, [{
        key: 'controller',
        value: function controller(scope, $elem) {
            var _this2 = this;

            this.group = $elem[0];
            var value = null;
            var handle = function handle(e, target) {
                var _context5;

                var radioItems = Array.from((_context5 = _this2.group, _utils.queryAll).call(_context5, 'input[type=radio]'));
                radioItems.forEach(function (i) {
                    if (target !== i) {
                        var _context6;

                        (_context6 = i.parentNode, _utils.removeClass).call(_context6, 'fm-radio-checked');
                    }
                });

                value = target.value;
                if (!/\$apply|\$digest/.test(scope.$root.$$phase)) scope.$apply();
                e.stopPropagation();
            };
            handle = handle.bind(this);
            scope.control = {};

            scope.$on('radio::selected', handle);
            Object.defineProperty(scope.control, 'value', {
                get: function get() {
                    return value;
                },
                set: function set() {}
            });
        }
    }, {
        key: 'passing',
        value: function passing(exports, scope) {
            exports.mode = GROUP;
            exports.callback = typeof scope.change === 'function' ? scope.change : _utils.noop;
        }
    }, {
        key: 'link',
        value: function link(scope, $elem, attrs, ctrl) {
            var _context7;

            var items = Array.from((_context7 = this.group, _utils.queryAll).call(_context7, 'input[type=radio]'));
            var uid = (0, _utils.nextUid)();
            items.forEach(function (i) {
                return i.setAttribute('name', uid);
            });
        }
    }]);

    return RadioGroup;
}(), (_applyDecoratedDescriptor(_class2.prototype, 'controller', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'controller'), _class2.prototype)), _class2));