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

var Pagination = (_dec = (0, _dependencies.dependencies)('$scope', '$element'), (_class = function () {
    function Pagination() {
        _classCallCheck(this, Pagination);

        this.restrict = 'EA';
        this.replace = true;
        this.scope = {
            change: '=?',
            size: '=',
            cursor: '=?'
        };
        this.template = _template2.default;
    }

    _createClass(Pagination, [{
        key: 'compile',
        value: function compile($tElement, tAttrs, transclude) {
            var _context;

            this.hasJumper = (_context = $tElement[0], _utils.props).call(_context, 'jumper');
            if (this.hasJumper) {
                var _context2;

                var jumper = '<div class="fm-pagination-jumper">\n                <span>{{::(\'Go\' | translate)}}</span>\n                <input class="fm-pagination-jumper-input" />\n                <span>{{::(\'page\' | translate)}}</span>\n            </div>';
                (_context2 = $tElement[0], _utils.last).call(_context2, jumper);
            }
            return this.link;
        }
    }, {
        key: 'controller',
        value: function controller(scope, $elem) {
            var elem = $elem[0];
            var prevLabel = _utils.query.call(elem, '.fm-pagination-prev');
            var nextLabel = _utils.query.call(elem, '.fm-pagination-next');
            scope.pages = [];
            scope.items = (0, _utils.range)(scope.size > 0 ? scope.size : 0, 1);
            scope.current = scope.cursor <= scope.size && scope.cursor || 1;
            scope.first = function () {
                return scope.items[0];
            };
            scope.last = function () {
                return scope.items[scope.items.length - 1];
            };
            scope.next = function () {
                return scope.current++ && _renderPages();
            };
            scope.prev = function () {
                return scope.current-- && _renderPages();
            };
            scope.choose = function (item) {
                var exec = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

                if (item === '...') return;
                scope.current = item;
                _renderPages();
                if (exec) typeof scope.change === 'function' && scope.change(item);
            };

            var _renderPages = function _renderPages() {
                var arr = [scope.current];
                var len = scope.items.length;
                var pivot = Math.round(scope.items.length / 2);
                var num = 6;
                var f = false;

                if (scope.current > pivot) f = true;

                var n = f ? -1 : 1;
                for (var i = 1; num > 3 && scope.items[scope.current - n - 1] !== undefined; i++, num--, n = f ? -i : i) {
                    f ? arr.push(scope.items[scope.current - n - 1]) : arr.unshift(scope.items[scope.current - n - 1]);
                }

                var m = f ? -1 : 1;
                for (var j = 1; j !== num + 1 && scope.items[scope.current + m - 1] !== undefined; j++, m = f ? -j : j) {
                    f ? arr.unshift(scope.items[scope.current + m - 1]) : arr.push(scope.items[scope.current + m - 1]);
                }

                if (1 !== arr[0]) {
                    arr = 2 === arr[0] ? [1].concat(arr) : [1, '...'].concat(arr);
                }

                if (scope.last() !== arr[arr.length - 1]) {
                    arr = scope.last() - 1 === arr[arr.length - 1] ? arr.concat([scope.last()]) : arr.concat(['...', scope.last()]);
                }

                scope.pages = arr;
                scope.current === scope.last() ? _utils.addClass.call(prevLabel, 'hide') : _utils.removeClass.call(prevLabel, 'hide');
                scope.current === scope.first() ? _utils.addClass.call(prevLabel, 'hide') : _utils.removeClass.call(prevLabel, 'hide');
            };
        }
    }, {
        key: 'link',
        value: function link(scope, $elem, attrs, ctrl) {
            var elem = $elem[0];
            var jumperInput = _utils.query.call(elem, '.fm-pagination-jumper-input');
            if (this.hasJumper) {
                _utils.on.call(jumperInput, 'keydown', function (e) {
                    if (e.keyCode !== 13 || !/^\d*$/.test(jumperInput.value)) return;
                    e.preventDefault();
                    var value = jumperInput.value;
                    if (value <= scope.size && value > 0) {
                        scope.choose(~ ~jumperInput.value);
                        scope.$apply();
                        jumperInput.value = '';
                    }
                });
            }
            scope.choose(scope.current, false);
        }
    }]);

    return Pagination;
}(), (_applyDecoratedDescriptor(_class.prototype, 'controller', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'controller'), _class.prototype)), _class));
exports.default = Pagination;