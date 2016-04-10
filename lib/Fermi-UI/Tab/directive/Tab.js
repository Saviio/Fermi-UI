'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Tab = exports.Tabs = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _desc, _value, _class;

var _dependencies = require('../../external/dependencies');

var _tabs = require('../template/tabs.html');

var _tabs2 = _interopRequireDefault(_tabs);

var _tab = require('../template/tab.html');

var _tab2 = _interopRequireDefault(_tab);

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

var Tabs = exports.Tabs = (_dec = (0, _dependencies.dependencies)('$scope', '$element'), (_class = function () {
    function Tabs() {
        _classCallCheck(this, Tabs);

        this.replace = true;
        this.restrict = 'EA';
        this.template = _tabs2.default;
        this.transclude = true;
        this.scope = {};
    }

    _createClass(Tabs, [{
        key: 'controller',
        value: function controller(scope, $elem) {
            var _this = this;

            this.rootDOM = $elem[0];
            scope.items = [];

            scope.onSelect = function (index) {
                if (scope.items[index].disabled) return;
                setTimeout(function () {
                    var _context;

                    Array.from((_context = _this.rootDOM, _utils.queryAll).call(_context, '.fm-tab-panel')).forEach(function (e, i) {
                        index === i ? _utils.addClass.call(e, 'show') : _utils.removeClass.call(e, 'show');
                        scope.items[i].actived = index === i;
                        if (!/\$apply|\$digest/.test(scope.$root.$$phase)) scope.$digest();
                    });
                }, 0);
            };
        }
    }, {
        key: 'link',
        value: function link(scope, $elem, attrs, ctrl) {
            var _context2;

            this.rootDOM = $elem[0];
            var ul = (_context2 = this.rootDOM, _utils.query).call(_context2, 'ul');

            var delegate = function delegate(evt) {
                var target = evt.target;
                if (target.tagName === 'A') {
                    var index = ~ ~target.getAttribute('data-index');
                    scope.onSelect(index);
                }
            };

            _utils.on.call(ul, 'click', delegate);

            scope.$on('destory', function () {
                return _utils.off.call(ul, 'click', delegate);
            });

            var init = false;
            for (var i = scope.items.length - 1; i >= 0; i--) {
                if (scope.items[i].actived) {
                    scope.onSelect(i);
                    init = true;
                    break;
                }
            }
            if (!init) scope.onSelect(0);
            //debugger
        }
    }, {
        key: 'passing',
        value: function passing(exports, scope) {
            exports.addItem = function (item) {
                var index = scope.items.push(item);
                //if(item.actived) scope.onSelect(index - 1)
            };
        }
    }]);

    return Tabs;
}(), (_applyDecoratedDescriptor(_class.prototype, 'controller', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'controller'), _class.prototype)), _class));

var Tab = exports.Tab = function () {
    function Tab() {
        _classCallCheck(this, Tab);

        this.restrict = 'EA';
        this.require = '^fermiTabs';
        this.replace = true;
        this.template = _tab2.default;
        this.transclude = true;
        this.scope = {};
    }

    _createClass(Tab, [{
        key: 'link',
        value: function link(scope, $element, attrs, parentCtrl) {
            //debugger
            var item = {
                display: attrs.header,
                disabled: _utils.props.call($element, 'disabled'),
                actived: _utils.props.call($element, 'actived') || false
            };

            parentCtrl.addItem(item);
        }
    }]);

    return Tab;
}();