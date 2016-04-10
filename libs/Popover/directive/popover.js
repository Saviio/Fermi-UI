'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _desc, _value, _class;

var _dependencies = require('../../external/dependencies');

var _browser = require('../../utils/browser');

var _template = require('../template/template.html');

var _template2 = _interopRequireDefault(_template);

var _popover = require('../template/popover.html');

var _popover2 = _interopRequireDefault(_popover);

var _utils = require('../../utils');

var _transition = require('../../utils/transition');

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

var reEvent = /click|hover|focus|manual/;
var reAutoHide = /auto|true/i;
var reDirection = /top|bottom|left|right/;
var reOffset = /^\d{1,}$/;

var unSupportedDirection = 'Popover direction is not in announced list [top,bottom,left,right].';
var unSupportedEvent = 'Event is not supported, it should one of the following values: [click, hover, focus, manual].';
var noTriggerSpecified = 'No trigger element was binded for popover component.';
var noTriggerFound = 'Trigger element cannot be found in component scope.';

//add disable function
var Popover = (_dec = (0, _dependencies.dependencies)('$scope'), (_class = function () {
    function Popover() {
        _classCallCheck(this, Popover);

        this.restrict = 'EA';
        this.replace = true;
        this.scope = {
            title: '@',
            manual: '='
        };
        this.transclude = true;
        this.template = _template2.default;
    }

    _createClass(Popover, [{
        key: 'compile',
        value: function compile($tElement, tAttrs, transclude) {
            var _context;

            var dire = (tAttrs.placement || "top").toLowerCase();
            if (!reDirection.test(dire)) throw Error(unSupportedDirection);

            var tmpl = (_context = _popover2.default.replace(/#{dire}/, dire), _utils.toDOM).call(_context);
            if (_utils.props.call($tElement, 'close')) {
                _utils.prepend.call(tmpl, '<button class="fm-close" ng-click="close()">×</button>');
            }

            $tElement.append(tmpl);
            if (tAttrs.trigger == undefined) throw new Error(noTriggerSpecified);

            return this.link;
        }
    }, {
        key: 'controller',
        value: function controller(scope) {
            var _this = this;

            scope.open = function () {
                return _this.popoverTrans.state = true;
            };
            scope.close = function () {
                return _this.popoverTrans.state = false;
            };
            scope.toggle = function () {
                return _this.popoverTrans.state ? scope.close() : scope.open();
            };
        }
    }, {
        key: 'link',
        value: function link(scope, $element, attr, ctrl) {
            var _context2,
                _this2 = this;

            this.rootDOM = $element[0];
            var popoverElem = (_context2 = this.rootDOM, _utils.query).call(_context2, '.fm-popover');
            var trigger = (_context2 = this.rootDOM, _utils.query).call(_context2, attr.trigger);

            if (trigger === undefined) throw new Error(noTriggerFound);

            (_context2 = this.rootDOM, _utils.prepend).call(_context2, trigger);
            this.placement = attr.placement.toLowerCase();
            this.triggerLiteral = attr.trigger;

            var actived = _utils.props.call($element, 'actived');
            var offset = _utils.props.call($element, 'offset');
            var event = attr.action || 'click';

            if (!reEvent.test(event)) {
                throw new Error(unSupportedEvent);
            } else if (event === 'hover') {
                event = 'mouseenter';
            } else if (event === 'manual') {
                scope.manual = {
                    open: scope.open,
                    close: scope.close
                };
            }

            if (reAutoHide.test(attr.hide)) {
                var expr = event === 'mouseenter' ? 'mouseleave' : 'blur';
                _utils.on.call(trigger, expr, scope.close.bind(scope));
            }

            if (event !== 'manual') {
                _utils.on.call(trigger, event, scope.toggle.bind(scope));
            }

            this.offset = reOffset.test(offset) ? offset : 5;
            this.title = attr.title;
            this.popoverTrans = new _transition.transition(popoverElem, 'fm-popover-effect', actived);

            var arrowColor = attr.arrow || null;

            setTimeout(function () {
                var init = false;

                if ((0, _utils.isHidden)(popoverElem)) {
                    var display = 'block',
                        opacity = 1,
                        transform = 'scale(1)';
                    _utils.setStyle.call(popoverElem, { display: display, opacity: opacity, transform: transform });
                    _utils.forceReflow.call(popoverElem);
                    init = true;
                }

                var trig = {
                    height: _utils.getStyle.call(trigger, 'height', 'px'),
                    width: _utils.getStyle.call(trigger, 'width', 'px')
                };

                var popover = {
                    height: _utils.getStyle.call(popoverElem, 'height', 'px'),
                    width: _utils.getStyle.call(popoverElem, 'width', 'px')
                };

                var left = void 0,
                    top = void 0;
                switch (_this2.placement) {
                    case 'top':
                        left = -popover.width / 2 + trig.width / 2 + 'px';
                        top = -popover.height + -10 + -_this2.offset + 'px';
                        break;
                    case 'bottom':
                        left = -popover.width / 2 + trig.width / 2 + 'px';
                        top = trig.height + 10 + _this2.offset + 'px';
                        break;
                    case 'left':
                        left = -popover.width + -10 + -_this2.offset + 'px';
                        top = trig.height / 2 - popover.height / 2 + 'px';
                        break;
                    case 'right':
                        left = trig.width + 10 + _this2.offset + 'px';
                        top = trig.height / 2 - popover.height / 2 + 'px';
                        break;
                    default:
                        return;
                }

                _utils.setStyle.call(popoverElem, { left: left, top: top });
                if (init) {
                    var _display = void 0,
                        _opacity = void 0,
                        _transform = void 0;
                    _utils.removeStyle.call(popoverElem, { display: _display, opacity: _opacity, transform: _transform });
                }
                _this2.reColor(arrowColor);
            }, 0);
        }

        //auto calc arrow color

    }, {
        key: 'reColor',
        value: function reColor(color) {
            var _context4;

            var dire = this.placement;
            var trigger = this.triggerLiteral;
            if (color === null) {
                var _context3;

                var selector = dire === 'bottom' && this.title ? '+.fm-popover > .fm-popover-title' : '+.fm-popover > .fm-popover-content > *';

                var popoverMainElem = (_context3 = this.rootDOM, _utils.query).call(_context3, trigger + selector);
                color = _utils.getStyle.call(popoverMainElem, 'background-color');
            }

            var style = _utils.query.call(_browser.DOM, '#__arrowColor__');

            if (style === null) {
                style = (0, _utils.createElem)('style');
                style.id = '__arrowColor__';
                _utils.query.call(_browser.DOM, 'head').appendChild(style);
            }

            var triggerBtn = (_context4 = this.rootDOM, _utils.query).call(_context4, trigger);
            var uid = (0, _utils.nextUid)();
            triggerBtn.setAttribute(uid, '');

            var css = '\n            ' + (0, _utils.escapeHTML)(trigger) + '[' + uid + '] + div.fm-popover > .fm-popover-arrow:after{\n                border-' + (0, _utils.escapeHTML)(dire) + '-color:' + color + ';\n            }\n        ';
            style.innerHTML += css;
        }
    }]);

    return Popover;
}(), (_applyDecoratedDescriptor(_class.prototype, 'controller', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'controller'), _class.prototype)), _class));
exports.default = Popover;