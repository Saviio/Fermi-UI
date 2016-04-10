'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _loading = require('../template/loading.html');

var _loading2 = _interopRequireDefault(_loading);

var _browser = require('../../utils/browser');

var _transition = require('../../utils/transition');

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var q = (0, _utils.queue)();

var Loading = function () {
    function Loading() {
        _classCallCheck(this, Loading);

        this.status = null;
        this.speed = 200;
        this.instance = null;
        this.rate = 700;
    }

    _createClass(Loading, [{
        key: '__tryDispose__',
        value: function __tryDispose__() {
            if (this.instance !== null) {
                this.instance = this.status = null;
                var elem = _utils.query.call(_browser.DOM, '#fm-progress-loading-elem');
                if (elem) _utils.remove.call(elem);
            }
        }
    }, {
        key: '__tryRender__',
        value: function __tryRender__() {
            var fromZero = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

            if (this.instance !== null) return this.instance;
            _utils.last.call(_browser.BODY, _loading2.default);

            var ins = _utils.query.call(_browser.DOM, '#fm-progress-loading-elem');
            if (ins !== null) {
                _utils.setStyle.call(ins, {
                    transition: 'width ' + this.speed + 'ms ease-out, opacity ' + this.speed + 'ms linear',
                    width: (fromZero ? 0 : (this.status || 0) * 100) + '%'
                });

                this.instance = ins;
                return this.instance;
            }
        }
    }, {
        key: 'start',
        value: function start() {
            var _this = this;

            if (!this.status) this.set(0);

            var exec = function exec() {
                setTimeout(function () {
                    if (!_this.status) return;
                    _this.inc(Math.random() * 0.1);
                    exec();
                }, _this.rate);
            };

            exec();
            return this;
        }
    }, {
        key: 'set',
        value: function set(n) {
            var _this2 = this;

            var started = typeof this.status === 'number';
            n = !started ? 0.01 : (0, _utils.clamp)(n, 0.05, 1);
            this.status = n >= 1 ? null : n;
            this.__tryRender__(!started);

            q(function (next) {
                var _context;

                (_context = _this2.instance, _utils.setStyle).call(_context, {
                    'width': n * 100 + '%'
                });

                if (n >= 1) {
                    setTimeout(function () {
                        var _context2;

                        (_context2 = (_context2 = _this2.instance, _utils.addClass).call(_context2, 'fm-progress-loading-hide'), _transition.onMotionEnd).call(_context2, function () {
                            _this2.__tryDispose__();
                            next();
                        }, 'fm-progress-loading-hide');
                    }, _this2.speed);
                } else {
                    setTimeout(next, _this2.speed);
                }
            });
            return this;
        }
    }, {
        key: 'inc',
        value: function inc() {
            var amount = arguments.length <= 0 || arguments[0] === undefined ? (1 - n) * Math.random() * n : arguments[0];
            return function () {
                var n = this.status;
                return !n ? this.start() : this.set((0, _utils.clamp)(n + amount, 0.1, 0.99));
            }();
        }
    }, {
        key: 'done',
        value: function done() {
            if (this.instance) this.set(1);
        }
    }]);

    return Loading;
}();

exports.default = Loading;