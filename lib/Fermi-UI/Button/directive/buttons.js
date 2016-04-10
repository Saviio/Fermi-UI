'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _desc, _value, _class;

var _dependencies = require('../../external/dependencies');

var _template = require('../template/template.html');

var _template2 = _interopRequireDefault(_template);

var _loader = require('../template/loader.svg');

var _loader2 = _interopRequireDefault(_loader);

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

var loadingClass = 'fm-button-loading';

var Buttons = (_dec = (0, _dependencies.dependencies)('$scope', '$attrs', '$element'), (_class = function () {
    function Buttons() {
        _classCallCheck(this, Buttons);

        this.restrict = 'EA';
        this.replace = true;
        this.scope = {
            content: '@',
            control: '=?'
        };
        this.transclude = true;
        this.template = _template2.default;
    }

    _createClass(Buttons, [{
        key: 'controller',
        value: function controller(scope, attrs, $elem) {
            var _this = this;

            this.rootDOM = $elem[0];
            this.isLoading = _utils.props.call($elem, 'loading');
            this.disabled = _utils.props.call($elem, 'disabled');
            scope.loading = this.isLoading;

            var disable = function disable(fn) {
                var _context;

                _this.disabled = true;
                _this.rootDOM.setAttribute('disabled', true);
                (_context = _this.rootDOM, _utils.addClass).call(_context, 'fm-button-disabled');
                if (typeof fn === 'function') fn();
            };
            var allow = function allow(fn) {
                var _context2;

                _this.disabled = false;
                _this.rootDOM.removeAttribute('disabled');
                (_context2 = _this.rootDOM, _utils.removeClass).call(_context2, 'fm-button-disabled');
                if (typeof fn === 'function') fn();
            };

            var loading = function loading() {
                var _context3;

                var force = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

                if (scope.loading && !force) return;
                (_context3 = _this.rootDOM, _utils.addClass).call(_context3, loadingClass);
                scope.loading = true;
                if (!_this.disabled) {
                    //set disable on DOM to prevent eventlistener will not be fired when button is in loading.
                    _this.rootDOM.setAttribute('disabled', true);
                }
                if (!/\$apply|\$digest/.test(scope.$root.$$phase)) scope.$digest();
            };

            var done = function done() {
                var _context4;

                var force = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

                if (!scope.loading && !force) return;
                (_context4 = _this.rootDOM, _utils.removeClass).call(_context4, loadingClass);
                scope.loading = false;
                if (!_this.disabled) {
                    _this.rootDOM.removeAttribute('disabled');
                }
                if (!/\$apply|\$digest/.test(scope.$root.$$phase)) scope.$digest();
            };

            scope.control = {
                done: done,
                allow: allow,
                disable: disable,
                loading: loading
            };
        }
    }, {
        key: 'link',
        value: function link(scope, $elem, attrs, ctrl) {
            var _context5;

            var size = (attrs.size || 'default').toLowerCase();
            var type = (attrs.type || 'default').toLowerCase();

            if (size !== 'default') (_context5 = this.rootDOM, _utils.addClass).call(_context5, 'fm-buttons-' + size);
            (_context5 = this.rootDOM, _utils.addClass).call(_context5, 'fm-buttons-' + type);
            if (this.isLoading) scope.control.loading(true);
            if (this.disabled) scope.control.disable();
        }
    }]);

    return Buttons;
}(), (_applyDecoratedDescriptor(_class.prototype, 'controller', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'controller'), _class.prototype)), _class));
exports.default = Buttons;