'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

var _dependencies = require('../../external/dependencies');

var _browser = require('../../utils/browser');

var _container = require('../template/container.html');

var _container2 = _interopRequireDefault(_container);

var _message = require('../template/message.html');

var _message2 = _interopRequireDefault(_message);

var _transition = require('../../utils/transition');

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultConfig = {
    top: '25px',
    right: '0px',
    duration: 4.5
};

var rootScope = null;
var reType = /default|normal|success|warn|error/;
var errTypeMessage = 'Message Type is not a valid value, it should be set from one of following values: [default, normal, success, warn, error].';

//custom(tmpl, scope){} 实现自定义模板
//remark DOM leak check

var Notification = (_dec = (0, _dependencies.dependencies)('$compile', '$rootScope'), _dec(_class = function () {
    function Notification($compile, $rootScope) {
        _classCallCheck(this, Notification);

        this._rendered = false;
        this._container = null;
        this._config = defaultConfig;
        this.compiledTmpl = $compile(_message2.default);

        rootScope = $rootScope;
    }

    _createClass(Notification, [{
        key: '__tryDispose__',
        value: function __tryDispose__() {
            var _context;

            if ((_context = this._body, _utils.queryAll).call(_context, 'div').length > 0) return;
            (_context = this._container, _utils.remove).call(_context);
            this._rendered = false;
            this._container = this._body = null;
        }
    }, {
        key: '__tryRender__',
        value: function __tryRender__() {
            var _context2;

            if (this._rendered) return;
            this._container = _utils.last.call(_browser.BODY, _container2.default);
            this._body = (_context2 = this._container, _utils.query).call(_context2, 'div');
            (_context2 = this._container, _utils.setStyle).call(_context2, {
                top: this._config.top.indexOf('px') < -1 ? this._config.top + 'px' : this._config.top,
                right: this._config.right.indexOf('px') < -1 ? this._config.right + 'px' : this._config.right
            });
            this._rendered = true;
        }
    }, {
        key: '__remove__',
        value: function __remove__(notificationNode, callback) {
            var _context3,
                _this = this;

            if (!_utils.inDoc.call(notificationNode)) return;
            (_context3 = _utils.removeClass.call(notificationNode, 'fm-notice-show'), _transition.onMotionEnd).call(_context3, function () {
                _utils.remove.call(notificationNode);
                _this.__tryDispose__();
            }, 'fm-notice-show');

            if (typeof callback === 'function') callback();
        }
    }, {
        key: 'send',
        value: function send(option) {
            var _this2 = this;

            if (!reType.test(option.type)) {
                throw new Error(errTypeMessage);
                return;
            }

            this.__tryRender__();
            var cancellId = void 0;
            var scope = rootScope.$new();

            scope.message = option.message || '';
            scope.topic = option.topic || '';
            scope.type = option.type;
            scope.callback = option.callback ? option.callback : null;
            scope.close = function (e) {
                if (cancellId !== undefined) clearTimeout(cancellId);
                _this2.__remove__(e.target.parentNode, scope.callback);
                scope.$destroy();
            };

            this.compiledTmpl(scope, function (cloneNode) {
                var _context4;

                var content = cloneNode[0];
                var notification = (_context4 = _this2._body, _utils.prepend).call(_context4, content);
                setTimeout(function () {
                    return _utils.addClass.call(notification, 'fm-notice-show');
                }, 50);

                if (option.duration !== null && option.duration !== 0) {
                    var duration = option.duration || _this2._config.duration;
                    cancellId = setTimeout(function () {
                        _this2.__remove__(notification, scope.callback);
                    }, duration * 1000);
                }
            });
        }
    }, {
        key: 'config',
        value: function config(_config) {
            this._config = Object.assign({}, this._config, _config);
            Object.freeze(this._config);
        }
    }, {
        key: 'normal',
        value: function normal() {
            var message = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
            var topic = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

            return this.send({ message: message, topic: topic, type: 'normal' });
        }
    }, {
        key: 'success',
        value: function success() {
            var message = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
            var topic = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

            return this.send({ message: message, topic: topic, type: 'success' });
        }
    }, {
        key: 'warn',
        value: function warn() {
            var message = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
            var topic = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

            return this.send({ message: message, topic: topic, type: 'warn' });
        }
    }, {
        key: 'error',
        value: function error() {
            var message = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
            var topic = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

            return this.send({ message: message, topic: topic, type: 'error' });
        }
    }, {
        key: 'default',
        value: function _default() {
            var message = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
            var topic = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

            return this.send({ message: message, topic: topic, type: 'default' });
        }
    }]);

    return Notification;
}()) || _class);
exports.default = Notification;