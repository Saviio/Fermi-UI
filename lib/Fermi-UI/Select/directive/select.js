'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Option = exports.Select = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _desc, _value, _class;

var _dependencies = require('../../external/dependencies');

var _transition = require('../../utils/transition');

var _select = require('../template/select.html');

var _select2 = _interopRequireDefault(_select);

var _option = require('../template/option.html');

var _option2 = _interopRequireDefault(_option);

var _tags = require('../template/tags.html');

var _tags2 = _interopRequireDefault(_tags);

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

//do not use ngModel
var Select = exports.Select = (_dec = (0, _dependencies.dependencies)('$scope', '$attrs'), (_class = function () {
    function Select() {
        _classCallCheck(this, Select);

        this.restrict = 'EA';
        this.replace = true;
        this.template = _select2.default;
        this.require = "^ngModel";
        this.scope = {
            ngModel: '='
        };
        this.transclude = true;
    }

    _createClass(Select, [{
        key: 'compile',
        value: function compile($tElement, tAttrs, transclude) {
            var _context;

            var isSearch = _utils.props.call($tElement, 'search');
            var isMulti = _utils.props.call($tElement, 'multi');
            var isTags = _utils.props.call($tElement, 'tags');

            this.rootDOM = $tElement[0];
            this.select = (_context = this.rootDOM, _utils.query).call(_context, '.fm-select-inner');
            this.optionList = (_context = this.rootDOM, _utils.query).call(_context, '.fm-select-optionList');
            this.icon = (_context = this.rootDOM, _utils.query).call(_context, '.fm-select-icon');
            this.size = (_utils.props.call($tElement, 'size') || 'default').toLowerCase();

            if (!(isMulti || isTags) && isSearch) {
                var _context2;

                var searchTmpl = '<div><input placeholder="输入"/></div>';
                this.searchInput = (_context2 = (_context2 = this.optionList, _utils.prepend).call(_context2, searchTmpl), _utils.query).call(_context2, 'input');
            }

            if (isMulti || isTags) {
                var _context3;

                this.mode = isTags ? 'tags' : 'multi';
                var tagsDOM = (0, _utils.toDOM)(_tags2.default);
                if (isTags) {
                    _utils.last.call(tagsDOM, '\n                    <li class="fm-tag-input">\n                        <span contenteditable="true">&nbsp;</span>\n                    </li>\n                ');
                }
                var selection = (_context3 = this.select, _utils.query).call(_context3, '.fm-select-selection');
                (_context3 = this.select, _utils.addClass).call(_context3, 'fm-select-tags');
                _utils.replace.call(selection, tagsDOM);
                this.icon = (_context3 = this.icon, _utils.remove).call(_context3);
                if (isTags) {
                    var _context4;

                    this.tagInput = (_context4 = this.rootDOM, _utils.query).call(_context4, '.fm-tag-input > span');
                }
            }

            return this.link;
        }
    }, {
        key: 'controller',
        value: function controller(scope, attrs) {
            var _this = this;

            if (this.mode === 'multi' || this.mode === 'tags') {
                scope.ngModel = [];
                scope.tagsRef = [];
            } else {
                scope.$on('option::selected', function (e, target) {
                    var _context5;

                    var options = Array.from((_context5 = _this.optionList, _utils.queryAll).call(_context5, 'ul > li'));
                    options.forEach(function (i) {
                        if (i !== target) i.removeAttribute('selected');
                    });

                    e.stopPropagation();
                });
            }

            scope.remove = function (index, e) {
                scope.ngModel.splice(index, 1).pop();
                if (_this.mode !== 'tags') {
                    var elem = scope.tagsRef.splice(index, 1).pop();
                    _utils.removeClass.call(elem, 'tagged').removeAttribute('selected');
                }
                e.stopPropagation();
            };

            var selected = function selected() {
                var _context6;

                if ((_context6 = scope.ngModel, _utils.getType).call(_context6) !== 'Array') {
                    return {
                        item: scope.ngModel.item,
                        data: scope.ngModel.data
                    };
                } else {
                    var list = [];
                    for (var i = 0; i < scope.ngModel.length; i++) {
                        var model = scope.ngModel[i];
                        list.push({
                            item: model.item,
                            data: model.data
                        });
                    }
                    return list;
                }
            };

            scope.control = { selected: selected };
            var listTransition = new _transition.transition(this.optionList, 'fm-select-list', false);

            scope.showOptionList = function () {
                if (_this.icon) {
                    var _context7;

                    !listTransition.state ? (_context7 = _this.icon, _utils.addClass).call(_context7, 'fm-icon-actived') : (_context7 = _this.icon, _utils.removeClass).call(_context7, 'fm-icon-actived');
                }

                listTransition.state = !listTransition.state;
            };
        }
    }, {
        key: 'link',
        value: function link(scope, $elem, attrs, ctrl) {
            var _this2 = this,
                _context12;

            if (this.searchInput) {
                var _context11;

                var fn = (0, _utils.debounce)(function () {
                    var _context8;

                    var options = (_context8 = _this2.optionList, _utils.queryAll).call(_context8, 'span');
                    var val = _this2.searchInput.value;

                    var cb1 = function cb1(e) {
                        var _context9;

                        new RegExp(val, 'ig').test(e.innerText) ? (_context9 = e.parentElement, _utils.removeClass).call(_context9, 'hide') : (_context9 = e.parentElement, _utils.addClass).call(_context9, 'hide');
                    };

                    var cb2 = function cb2(e) {
                        var _context10;

                        return (_context10 = e.parentElement, _utils.removeClass).call(_context10, 'hide');
                    };
                    [].forEach.call(options, val ? cb1 : cb2);
                });
                (_context11 = this.searchInput, _utils.on).call(_context11, 'input', fn);
            }

            (_context12 = this.rootDOM, _utils.addClass).call(_context12, 'fm-select-wrapper-' + this.size);
            (_context12 = this.select, _utils.on).call(_context12, 'click', scope.showOptionList);

            if (this.mode === 'tags') {
                (function () {
                    var _context13;

                    var renderTag = function renderTag(value) {
                        scope.ngModel.push({ item: value, data: { value: value }, $elem: null });
                        _this2.tagInput.innerHTML = '&nbsp;';
                        scope.$apply();
                    };

                    (_context13 = _this2.select, _utils.on).call(_context13, 'click', function () {
                        return _this2.tagInput.focus();
                    });
                    (_context13 = _this2.tagInput, _utils.on).call(_context13, 'keydown', function (e) {
                        var value = _this2.tagInput.innerText.trim();
                        if (e.keyCode !== 13) return;
                        e.preventDefault();
                        if (value !== '') {
                            if (scope.ngModel.every(function (existOption) {
                                return existOption.item !== value;
                            })) {
                                renderTag(value);
                            } else {
                                _this2.tagInput.innerHTML = '&nbsp;';
                            }
                        }
                    });

                    (_context13 = _this2.tagInput, _utils.on).call(_context13, 'blur', function (e) {
                        var value = _this2.tagInput.innerText.trim();
                        if (value === '') return;
                        renderTag(value);
                    });
                })();
            }
        }
    }, {
        key: 'passing',
        value: function passing(exports, scope) {
            var _this3 = this;

            exports.select = function (option, elem) {
                if (_this3.mode === 'multi' || _this3.mode === 'tags') {
                    if (scope.ngModel.every(function (existOption) {
                        return existOption !== option;
                    })) {
                        scope.ngModel.push(option);
                        scope.tagsRef.push(elem);
                    }
                } else {
                    scope.ngModel = option;
                }

                if (!/\$apply|\$digest/.test(scope.$root.$$phase)) {
                    scope.$apply();
                }
            };
            exports.showList = function () {
                return scope.showOptionList();
            };
            exports.mode = this.mode;
        }
    }]);

    return Select;
}(), (_applyDecoratedDescriptor(_class.prototype, 'controller', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'controller'), _class.prototype)), _class));

//select option group (IMPLEMENT ME!)

var Option = exports.Option = function () {
    function Option() {
        _classCallCheck(this, Option);

        this.restrict = 'EA';
        this.replace = true;
        this.require = '^fermiSelect';
        this.template = _option2.default;
        this.transclude = true;
        this.scope = { value: '=', data: '=' };
    }

    _createClass(Option, [{
        key: 'link',
        value: function link(scope, $elem, attrs, parentCtrl) {
            var rootDOM = $elem[0];
            if (typeof attrs.value === "string" && scope.value === undefined) {
                scope.value = attrs.value;
            }

            var isSelected = _utils.props.call($elem, 'selected');
            var option = {
                item: scope.value,
                data: scope.data || { value: scope.value }
            };

            _utils.on.call(rootDOM, 'click', function (e) {
                var disabled = _utils.props.call(rootDOM, 'disabled');
                if (disabled) return;

                if (parentCtrl.mode !== 'multi' && parentCtrl.mode !== 'tags') {
                    scope.$emit('option::selected', rootDOM);
                    parentCtrl.showList();
                } else {
                    _utils.addClass.call(rootDOM, 'tagged');
                }

                rootDOM.setAttribute('selected', true);
                parentCtrl.select(option, rootDOM);
            });

            if (isSelected) {
                parentCtrl.select(option, rootDOM);
            }
        }
    }]);

    return Option;
}();