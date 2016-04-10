'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MenuItem = exports.SubMenu = exports.Menu = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _desc, _value, _class, _dec2, _desc2, _value2, _class2;

var _dependencies = require('../../external/dependencies');

var _menu = require('../template/menu.html');

var _menu2 = _interopRequireDefault(_menu);

var _subMenu = require('../template/subMenu.html');

var _subMenu2 = _interopRequireDefault(_subMenu);

var _menuItem = require('../template/menuItem.html');

var _menuItem2 = _interopRequireDefault(_menuItem);

var _transition = require('../../utils/transition');

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

var CASCADING = 0;

var peekMenuEnv = function peekMenuEnv(ctrls) {
    for (var i = ctrls.length - 1; i >= 0 && ctrls.length; i--) {
        if (ctrls[i] !== null) {
            return ctrls[i];
        }
    }
    return null;
};

var Menu = exports.Menu = (_dec = (0, _dependencies.dependencies)('$scope'), (_class = function () {
    function Menu() {
        _classCallCheck(this, Menu);

        this.restrict = 'EA';
        this.scope = {
            mode: '@'
        };
        this.replace = true;
        this.transclude = true;
        this.template = _menu2.default;
    }

    _createClass(Menu, [{
        key: 'controller',
        value: function controller(scope) {
            scope.cascading = [];
            scope.mode = (scope.mode && scope.mode.match(/v|h/ig)[0] || 'V').toUpperCase();
        }
    }, {
        key: 'passing',
        value: function passing(exports, scope) {
            exports.add = function (item) {
                return scope.cascading.push(item);
            };
        }
    }, {
        key: 'link',
        value: function link(scope, $elem, attrs, ctrl) {
            var rootDOM = $elem[0];
            var childrenItem = _utils.queryAll.call(rootDOM, '.fm-menu-item');
            scope.$on('menuItem::selected', function (event, domRef) {
                [].forEach.call(childrenItem, function (item) {
                    return _utils.removeClass.call(item, 'fm-menu-item-selected');
                });
                _utils.addClass.call(domRef, 'fm-menu-item-selected');
                event.stopPropagation();
            });

            scope.cascading.forEach(function (child) {
                return child.init(CASCADING + (scope.mode === 'V' ? 24 : 0), scope.mode);
            });
        }
    }]);

    return Menu;
}(), (_applyDecoratedDescriptor(_class.prototype, 'controller', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'controller'), _class.prototype)), _class));
var SubMenu = exports.SubMenu = (_dec2 = (0, _dependencies.dependencies)('$scope'), (_class2 = function () {
    function SubMenu() {
        _classCallCheck(this, SubMenu);

        this.restrict = 'EA';
        this.scope = {
            title: '@'
        };
        this.replace = true;
        this.transclude = true;
        this.template = _subMenu2.default;
        this.require = ['?^^fermiMenu', '?^^fermiSubmenu'];
    }

    _createClass(SubMenu, [{
        key: 'compile',
        value: function compile($tElement, tAttrs, transclude) {
            this.isCascading = _utils.props.call($tElement, 'cascading') || true;
            this.actived = _utils.props.call($tElement, 'actived') || false;
            return this.link;
        }
    }, {
        key: 'controller',
        value: function controller(scope) {
            scope.cascading = [];
            this.title = scope.title;
        }
    }, {
        key: 'passing',
        value: function passing(exports, scope) {
            exports.add = function (item) {
                return scope.cascading.push(item);
            };
        }
    }, {
        key: 'link',
        value: function link(scope, $elem, attrs, parentCtrl) {
            var _this = this;

            var rootDOM = $elem[0];
            var titleDOM = _utils.query.call(rootDOM, '.fm-submenu-title');
            var children = _utils.query.call(rootDOM, '.fm-submenu-items');

            if (this.title === undefined || this.title === "") {
                _utils.addClass.call(titleDOM, 'hide');
            } else {
                titleDOM.innerHTML += this.title;
            }

            var parent = peekMenuEnv(parentCtrl);
            var eventsBinding = function eventsBinding(mode) {
                if (mode === 'V') {
                    (function () {
                        var subMenuTrans = new _transition.transition(rootDOM, 'fm-submenu-vertical', _this.actived);
                        _utils.on.call(titleDOM, 'click', function (e) {
                            return subMenuTrans.state = !subMenuTrans.state;
                        });
                    })();
                } else if (mode === 'H') {
                    (function () {
                        var items = _utils.query.call(rootDOM, '.fm-submenu-items');
                        var subMenuTrans = new _transition.transition(items, 'fm-submenu-pop');

                        _utils.on.call(titleDOM, 'mouseenter', function (e) {
                            return subMenuTrans.state = true;
                        });
                        _utils.on.call(rootDOM, 'mouseleave', function (e) {
                            return subMenuTrans.state = false;
                        });
                    })();
                }
            };

            if (parent !== null && parent !== undefined) {
                parent.add({
                    type: 'submenu',
                    init: function init(offset, mode) {
                        if (mode === 'H') {
                            offset = 0;
                        } else if (mode === 'V') {
                            var _context;

                            (_context = (_context = $elem[0], _utils.query).call(_context, '.fm-submenu-title'), _utils.setStyle).call(_context, {
                                'padding-left': offset + 'px'
                            });
                            offset += _this.isCascading ? 24 : 0;
                        }

                        if (_this.title !== undefined && _this.title !== "") {
                            eventsBinding(mode);
                        }

                        scope.cascading.forEach(function (e) {
                            return e.init(offset, mode);
                        });
                    }
                });
            } else {
                throw new Error("A separated submenu does not supported for now.");
                /*
                rootDOM::addClass('fm-submenu-separated')
                //when a submenu was inserted to DOMtree separately, the mode of menu will be "H" by default.
                scope.cascading.forEach(e => e.init(CASCADING, 'H'))
                eventsBinding('H')
                */
            }
        }
    }]);

    return SubMenu;
}(), (_applyDecoratedDescriptor(_class2.prototype, 'controller', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'controller'), _class2.prototype)), _class2));

var MenuItem = exports.MenuItem = function () {
    function MenuItem() {
        _classCallCheck(this, MenuItem);

        this.restrict = 'EA';
        this.scope = {};
        this.replace = true;
        this.transclude = true;
        this.template = _menuItem2.default;
        this.require = ['?^^fermiMenu', '?^^fermiSubmenu'];
    }

    _createClass(MenuItem, [{
        key: 'link',
        value: function link(scope, $elem, attrs, parentCtrl) {
            var rootDOM = $elem[0];
            var parent = peekMenuEnv(parentCtrl);
            var parentMode = void 0;

            parent.add({
                type: 'item',
                init: function init(offset, mode) {
                    var _context2;

                    parentMode = mode;
                    if (mode === 'H') return;
                    (_context2 = $elem[0], _utils.setStyle).call(_context2, {
                        'padding-left': offset + 'px'
                    });
                }
            });

            _utils.on.call(rootDOM, 'click', function () {
                var isDisabled = _utils.props.call(rootDOM, 'disabled');
                if (isDisabled || parentMode === 'H') return;
                scope.$emit('menuItem::selected', rootDOM);
            });
        }
    }]);

    return MenuItem;
}();