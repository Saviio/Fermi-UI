'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _desc, _value, _class;

var _dependencies = require('../../external/dependencies');

var _query = require('../template/query.html');

var _query2 = _interopRequireDefault(_query);

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

var Query = (_dec = (0, _dependencies.dependencies)('$scope'), (_class = function () {
    function Query($timeout) {
        _classCallCheck(this, Query);

        this.replace = true;
        this.restrict = 'EA';
        this.template = _query2.default;
        this.scope = {
            control: '=?',
            callback: '=?'
        };
    }

    _createClass(Query, [{
        key: 'controller',
        value: function controller(scope) {
            scope.control = {
                hide: function hide() {
                    var execCallback = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

                    if (typeof scope.callback === 'function' && execCallback) {
                        scope.callback();
                    }
                    scope.hide();
                },
                show: function show() {
                    return scope.show();
                }
            };
        }
    }, {
        key: 'link',
        value: function link(scope, $element, attrs, ctrl) {
            var rootDOM = $element[0];
            var actived = _utils.props.call(rootDOM, 'actived');
            var showCls = 'fm-progress-query-show';

            scope.show = function () {
                _utils.removeClass.call(rootDOM, 'hide');
                setTimeout(function () {
                    return _utils.addClass.call(rootDOM, showCls);
                }, 10);
                actived = true;
            };

            scope.hide = function () {
                setTimeout(function () {
                    var _context;

                    (_context = _utils.removeClass.call(rootDOM, showCls), _transition.onMotionEnd).call(_context, function () {
                        if (!actived) _utils.addClass.call(rootDOM, 'hide');
                    }, showCls);
                }, 10);
                actived = false;
            };

            if (actived) scope.show();
        }
    }]);

    return Query;
}(), (_applyDecoratedDescriptor(_class.prototype, 'controller', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'controller'), _class.prototype)), _class));
exports.default = Query;