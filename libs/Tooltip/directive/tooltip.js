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

var Tooltips = (_dec = (0, _dependencies.dependencies)('$scope'), (_class = function () {
    function Tooltips() {
        _classCallCheck(this, Tooltips);

        this.restrict = "EA";
        this.transclude = true;
        this.scope = {
            placement: '@',
            content: '@',
            offset: '@'
        };
        this.template = _template2.default;
        this.replace = true;
    }

    _createClass(Tooltips, [{
        key: 'controller',
        value: function controller(scope) {
            scope.content = (scope.content || '').trim();
        }
    }, {
        key: 'link',
        value: function link(scope, $elem, attr, ctrl) {
            var actived = _utils.props.call($elem, 'actived');
            var rootDOM = $elem[0];
            var placement = (_utils.props.call($elem, 'placement') || 'top').toLowerCase();
            var offset = attr.offset || 0;

            var tooltipBody = _utils.query.call(rootDOM, '.fm-tooltip-wrapper');
            var trigBody = _utils.query.call(rootDOM, '.fm-tooltip-elem');

            scope.tooltip = tooltipBody;

            setTimeout(function () {
                var init = false;

                if ((0, _utils.isHidden)(tooltipBody)) {
                    var display = 'block',
                        opacity = 1,
                        transform = 'scale(1)';
                    _utils.setStyle.call(tooltipBody, { display: display, opacity: opacity, transform: transform });
                    _utils.forceReflow.call(tooltipBody);
                    init = true;
                }

                var trig = {
                    height: _utils.getStyle.call(trigBody, 'height', 'px'),
                    width: _utils.getStyle.call(trigBody, 'width', 'px')
                };

                var tooltip = {
                    height: _utils.getStyle.call(tooltipBody, 'height', 'px'),
                    width: _utils.getStyle.call(tooltipBody, 'width', 'px')
                };

                var left = void 0,
                    top = void 0;
                switch (placement) {
                    case 'top':
                        left = -tooltip.width / 2 + trig.width / 2 + 'px';
                        top = -tooltip.height + -offset + 'px';
                        break;
                    case 'bottom':
                        left = -tooltip.width / 2 + trig.width / 2 + 'px';
                        top = trig.height + offset + 'px';
                        break;
                    case 'left':
                        left = -tooltip.width + -offset + 'px';
                        top = trig.height / 2 - tooltip.height / 2 + 'px';
                        break;
                    case 'right':
                        left = trig.width + offset + 'px';
                        top = trig.height / 2 - tooltip.height / 2 + 'px';
                        break;
                    default:
                        return;
                }

                _utils.setStyle.call(tooltipBody, { left: left, top: top });
                if (init) {
                    var _display = void 0,
                        _opacity = void 0,
                        _transform = void 0;
                    _utils.removeStyle.call(tooltipBody, { display: _display, opacity: _opacity, transform: _transform });
                }
            }, 0);
            var tooltipTrans = new _transition.transition(tooltipBody, 'fm-tooltip-effect', actived);
            _utils.on.call(trigBody, 'mouseenter', function (e) {
                return tooltipTrans.state = true;
            });
            _utils.on.call(trigBody, 'mouseleave', function (e) {
                return tooltipTrans.state = false;
            });
        }
    }]);

    return Tooltips;
}(), (_applyDecoratedDescriptor(_class.prototype, 'controller', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'controller'), _class.prototype)), _class));
exports.default = Tooltips;