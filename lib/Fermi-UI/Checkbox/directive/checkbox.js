'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Checkbox = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _desc, _value, _class;

var _dependencies = require('../../external/dependencies');

var _template = require('../template/template.html');

var _template2 = _interopRequireDefault(_template);

var _fakeEvent = require('../../external/fakeEvent');

var _fakeEvent2 = _interopRequireDefault(_fakeEvent);

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

var Checkbox = exports.Checkbox = (_dec = (0, _dependencies.dependencies)('$scope', '$element'), (_class = function () {
    function Checkbox() {
        _classCallCheck(this, Checkbox);

        this.restrict = 'EA';
        this.replace = true;
        this.scope = {
            change: '=?',
            label: '@',
            control: '=?'
        };
        this.template = _template2.default;
    }

    _createClass(Checkbox, [{
        key: 'controller',
        value: function controller(scope, $element) {
            var _context,
                _this = this;

            this.rootDOM = $element[0];
            this.checkboxElem = (_context = this.rootDOM, _utils.query).call(_context, '.fm-checkbox');
            this.input = (_context = this.rootDOM, _utils.query).call(_context, 'input[type=checkbox]');
            this.input.disabled = this.disabled = !!((_context = this.rootDOM, _utils.props).call(_context, 'disabled') || false);
            this.input.checked = (_context = this.rootDOM, _utils.props).call(_context, 'default') || false;

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

            Object.defineProperty(scope.control, 'checked', {
                get: function get() {
                    return _this.input.checked;
                },
                set: function set(value) {
                    return _this.handle(new _fakeEvent2.default(value));
                }
            });

            this.callback = typeof scope.change === 'function' ? scope.change : _utils.noop;
        }
    }, {
        key: 'link',
        value: function link(scope, $elem, attrs, ctrl) {
            var _context2;

            if (this.input.checked) this.check();
            (_context2 = this.input, _utils.on).call(_context2, 'change', this.handle.bind(this));
        }
    }, {
        key: 'check',
        value: function check() {
            var _context3;

            (_context3 = this.checkboxElem, _utils.addClass).call(_context3, 'fm-checkbox-checked');
        }
    }, {
        key: 'unCheck',
        value: function unCheck() {
            var _context4;

            (_context4 = this.checkboxElem, _utils.removeClass).call(_context4, 'fm-checkbox-checked');
        }
    }, {
        key: 'handle',
        value: function handle(e) {
            if (this.disabled) return;
            e.target.checked ? this.check() : this.unCheck();
            this.callback(e.target.checked);
        }
    }]);

    return Checkbox;
}(), (_applyDecoratedDescriptor(_class.prototype, 'controller', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'controller'), _class.prototype)), _class));