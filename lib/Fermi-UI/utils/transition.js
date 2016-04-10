'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.transition = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.onMotionEnd = onMotionEnd;

var _browser = require('./browser');

var _transitionEvents = require('./transitionEvents');

var _index = require('./index');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UNMOUNTED = 0;
var RUNNING = 999;
var ANIMATION = 'animation';
var TRANSITION = 'transition';

var tick = 17;
var defaultTimeout = 5000;
var valueTypeError = "The type of value which is listened by transition should be Boolean.";
var classTypeCache = {};

var getTransitionType = function getTransitionType(el, className) {
    if (!_transitionEvents.transitionEndEvent || _browser.DOM.hidden || (0, _index.isHidden)(el)) return;

    var type = void 0;
    if (className !== undefined) type = classTypeCache[className];
    if (type) return type;

    var computed = _browser.WIN.getComputedStyle(el);
    var inline = el.style;
    var transDuration = inline[_transitionEvents.transitionProp + 'Duration'] || computed[_transitionEvents.transitionProp + 'Duration'];
    if (transDuration && transDuration !== '0s') {
        type = TRANSITION;
    } else {
        var animDuration = inline[_transitionEvents.animationProp + 'Duration'] || computed[_transitionEvents.animationProp + 'Duration'];
        if (animDuration && animDuration !== '0s') type = ANIMATION;
    }

    if (className !== undefined && type) classTypeCache[className] = type;
    return type;
};

var setCSScallback = function setCSScallback(el, event, callback) {
    var timeout = arguments.length <= 3 || arguments[3] === undefined ? defaultTimeout : arguments[3];

    var timeoutId = null;

    var handler = function handler(e) {
        if (e && e.target === el) {
            if (timeoutId !== null) clearTimeout(timeoutId);
            _index.off.call(el, event, handler);
            callback();
        }
    };

    _index.on.call(el, event, handler);

    timeoutId = setTimeout(function () {
        _index.off.call(el, event, handler);
        callback();
    }, timeout);

    return timeoutId;
};

var defaultHooks = {
    onEnter: null,
    onLeave: null
};

var transition = exports.transition = function () {
    function transition(el, transitionName) {
        var initValue = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

        var _this = this;

        var maxTimeout = arguments.length <= 3 || arguments[3] === undefined ? defaultTimeout : arguments[3];
        var hooks = arguments.length <= 4 || arguments[4] === undefined ? defaultHooks : arguments[4];

        _classCallCheck(this, transition);

        if (typeof initValue !== 'boolean') throw new Error(valueTypeError);
        var data = initValue;

        this.el = el;
        this.transitionName = transitionName;
        this.timeout = null;
        this.maxTimeout = maxTimeout;
        this.hooks = hooks;

        var descriptor = {
            set: function set(newValue) {
                if (data === newValue) return;
                data = newValue;
                if (_this.__stage__ !== RUNNING) {
                    _this.__stage__ = RUNNING;
                    if (data) return _this.enter();
                    if (!data) return _this.leave();
                }
            },
            get: function get() {
                return data;
            }
        };

        Object.defineProperty(this, 'state', descriptor);
        if (data) {
            var _context;

            (_context = this.el, _index.addClass).call(_context, this.transitionName + '-entered');
        }
    }

    _createClass(transition, [{
        key: 'enter',
        value: function enter() {
            var _context2,
                _this2 = this;

            (_context2 = this.el, _index.addClass).call(_context2, this.transitionName + '-enter');
            setTimeout(function () {
                var _context3;

                (_context3 = _this2.el, _index.addClass).call(_context3, _this2.transitionName + '-enter-active');
                _this2.enterNext();
            }, tick);
        }
    }, {
        key: 'enterNext',
        value: function enterNext() {
            var _this3 = this;

            setTimeout(function () {
                var type = getTransitionType(_this3.el, _this3.transitionName);
                var recycle = function recycle() {
                    var _context4;

                    (_context4 = _this3.el, _index.removeClass).call(_context4, _this3.transitionName + '-enter ' + _this3.transitionName + '-enter-active');
                    (_context4 = _this3.el, _index.addClass).call(_context4, _this3.transitionName + '-entered');
                    _this3.enterDone();
                };

                if (type === TRANSITION) {
                    _this3.setUp(_transitionEvents.transitionEndEvent, recycle);
                } else if (type === ANIMATION) {
                    _this3.setUp(_transitionEvents.animationEndEvent, recycle);
                } else {
                    recycle();
                    return;
                }
            }, tick);
        }
    }, {
        key: 'enterDone',
        value: function enterDone() {
            if (this.state !== true) {
                return this.leave();
            }

            if (typeof this.hooks.onEnter === 'function') {
                this.hooks.onEnter();
            }

            this.__stage__ = UNMOUNTED;
        }
    }, {
        key: 'leave',
        value: function leave() {
            var _context6,
                _this4 = this;

            if ((0, _index.isHidden)(this.el)) {
                var _context5;

                if (this.state !== false) {
                    return this.enter();
                }
                (_context5 = this.el, _index.removeClass).call(_context5, this.transitionName + '-entered');
                return this.leaveNext();
            }

            (_context6 = this.el, _index.removeClass).call(_context6, this.transitionName + '-entered');
            (_context6 = this.el, _index.addClass).call(_context6, this.transitionName + '-leave');
            setTimeout(function () {
                var _context7;

                (_context7 = _this4.el, _index.addClass).call(_context7, _this4.transitionName + '-leave-active');
                _this4.leaveNext();
            }, tick);
        }
    }, {
        key: 'leaveNext',
        value: function leaveNext() {
            var _this5 = this;

            setTimeout(function () {
                var type = getTransitionType(_this5.el, _this5.transitionName);

                var recycle = function recycle() {
                    var _context8;

                    (_context8 = _this5.el, _index.removeClass).call(_context8, _this5.transitionName + '-leave ' + _this5.transitionName + '-leave-active');
                    _this5.leaveDone();
                };

                if (type === TRANSITION) {
                    _this5.setUp(_transitionEvents.transitionEndEvent, recycle);
                } else if (type === ANIMATION) {
                    _this5.setUp(_transitionEvents.animationEndEvent, recycle);
                } else {
                    recycle();
                    return;
                }
            }, tick);
        }
    }, {
        key: 'leaveDone',
        value: function leaveDone() {
            if (this.state !== false) {
                return this.enter();
            }

            if (typeof this.hooks.onLeave === 'function') {
                this.hooks.onLeave();
            }

            this.__stage__ = UNMOUNTED;
        }
    }, {
        key: 'setUp',
        value: function setUp(event, cb) {
            var _this6 = this;

            /*let handler = e => {
                if(e && e.target === this.el){
                    if(this.timeout !== null) this.clear()
                    this.el::off(event, handler)
                    cb()
                }
            }
              this.el::on(event, handler)
              this.timeout = setTimeout(() => {
                this.el::off(event, handler)
                this.timeout = null
                cb()
            }, this.maxTimeout)*/

            var wrap = function wrap() {
                _this6.timeout = null;
                cb();
            };

            this.timeout = setCSScallback(this.el, event, wrap, this.maxTimeout);
        }
    }, {
        key: 'clear',
        value: function clear() {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }]);

    return transition;
}();

function onMotionEnd(el, cb, transitionName) {
    var timeout = arguments.length <= 3 || arguments[3] === undefined ? defaultTimeout : arguments[3];

    if (typeof el === 'function') {
        ;
        var _ref = [this, el, cb, timeout];
        el = _ref[0];
        cb = _ref[1];
        transitionName = _ref[2];
        timeout = _ref[3];
    }if (!(0, _index.isDOM)(el) && !(el instanceof angular.element)) return;
    if (el instanceof angular.element) el = el[0];

    /*let setUp = event => {
        let timeout = null
          let handler = e => {
            if(e && e.target === el){
                clearTimeout(timeout)
                el::off(event, handler)
                cb()
            }
        }
          el::on(event, handler)
        timeout = setTimeout(() => {
            el::off(event, handler)
            cb()
        }, defaultTimeout)
    }*/

    setTimeout(function () {
        if ((0, _index.isHidden)(el)) return cb();

        var type = getTransitionType(el, transitionName);

        if (type === TRANSITION) {
            setCSScallback(el, _transitionEvents.transitionEndEvent, cb, timeout);
        } else if (type === ANIMATION) {
            setCSScallback(el, _transitionEvents.animationEndEvent, cb, timeout);
        }
    }, tick);
}