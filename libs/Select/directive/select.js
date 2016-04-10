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

//do not use ngModel remark
var Select = exports.Select = (_dec = (0, _dependencies.dependencies)('$scope', '$attrs', '$element'), (_class = function () {
    function Select() {
        _classCallCheck(this, Select);

        this.restrict = 'EA';
        this.replace = true;
        this.template = _select2.default;
        //this.require = "^ngModel"
        this.scope = {
            value: '='
        };
        this.transclude = true;
    }

    _createClass(Select, [{
        key: 'compile',
        value: function compile($tElement, tAttrs, transclude) {
            var isSearch = _utils.props.call($tElement, 'search');
            var isMulti = _utils.props.call($tElement, 'multi');
            var isTags = _utils.props.call($tElement, 'tags');

            var rootDOM = $tElement[0];
            var select = _utils.query.call(rootDOM, '.fm-select-inner');
            var optionList = _utils.query.call(rootDOM, '.fm-select-optionList');
            var icon = _utils.query.call(rootDOM, '.fm-select-icon');
            this.size = (_utils.props.call($tElement, 'size') || 'default').toLowerCase();

            if (!(isMulti || isTags) && isSearch) {
                var searchTmpl = '<div><input placeholder="{{::(\'pleaseInput\' | translate)}}"/></div>';
                _utils.prepend.call(optionList, searchTmpl);
                this.isSearch = true;
            }

            if (isMulti || isTags) {
                this.mode = isTags ? 'tags' : 'multi';
                var tagsDOM = (0, _utils.toDOM)(_tags2.default);
                if (isTags) {
                    _utils.last.call(tagsDOM, '\n                    <li class="fm-tag-input">\n                        <span contenteditable="true">&nbsp;</span>\n                    </li>\n                ');
                }
                var selection = _utils.query.call(select, '.fm-select-selection');
                _utils.addClass.call(select, 'fm-select-tags');
                _utils.replace.call(selection, tagsDOM);
                this.icon = _utils.remove.call(icon);
            }

            return this.link;
        }
    }, {
        key: 'controller',
        value: function controller(scope, attrs, $elem) {
            var _this = this;

            var rootDOM = $elem[0];

            var optionList = _utils.query.call(rootDOM, '.fm-select-optionList');

            if (this.mode === 'multi' || this.mode === 'tags') {
                scope.value = [];
                scope.tagsRef = [];
            } else {
                scope.$on('option::selected', function (e, target) {
                    var options = Array.from(_utils.queryAll.call(optionList, 'ul > li'));
                    options.forEach(function (i) {
                        if (i !== target) i.removeAttribute('selected');
                    });

                    e.stopPropagation();
                });
            }

            scope.remove = function (index, e) {
                scope.value.splice(index, 1).pop();
                if (_this.mode !== 'tags') {
                    var elem = scope.tagsRef.splice(index, 1).pop();
                    _utils.removeClass.call(elem, 'tagged').removeAttribute('selected');
                }
                e.stopPropagation();
            };

            var selected = function selected() {
                var _context;

                if ((_context = scope.value, _utils.getType).call(_context) !== 'Array') {
                    return {
                        item: scope.value.item,
                        data: scope.value.data
                    };
                } else {
                    var list = [];
                    for (var i = 0; i < scope.value.length; i++) {
                        var model = scope.value[i];
                        list.push({
                            item: model.item,
                            data: model.data
                        });
                    }
                    return list;
                }
            };

            scope.control = { selected: selected };
            var listTransition = new _transition.transition(optionList, 'fm-select-list', false);

            scope.showOptionList = function () {
                if (_this.icon) {
                    var _context2;

                    !listTransition.state ? (_context2 = _this.icon, _utils.addClass).call(_context2, 'fm-icon-actived') : (_context2 = _this.icon, _utils.removeClass).call(_context2, 'fm-icon-actived');
                }

                listTransition.state = !listTransition.state;
            };

            this.rootDOM = rootDOM;
            this.optionList = optionList;
            this.select = _utils.query.call(rootDOM, '.fm-select-inner');
        }
    }, {
        key: 'link',
        value: function link(scope, $elem, attrs, ctrl) {
            var _this2 = this,
                _context7;

            if (this.isSearch) {
                (function () {
                    var _context3;

                    var searchInput = (_context3 = _this2.optionList, _utils.query).call(_context3, 'input');
                    var fn = (0, _utils.debounce)(function () {
                        var _context4;

                        var options = (_context4 = _this2.optionList, _utils.queryAll).call(_context4, 'span');
                        var val = searchInput.value;

                        var cb1 = function cb1(e) {
                            var _context5;

                            new RegExp(val, 'ig').test(e.innerText) ? (_context5 = e.parentElement, _utils.removeClass).call(_context5, 'hide') : (_context5 = e.parentElement, _utils.addClass).call(_context5, 'hide');
                        };

                        var cb2 = function cb2(e) {
                            var _context6;

                            return (_context6 = e.parentElement, _utils.removeClass).call(_context6, 'hide');
                        };
                        [].forEach.call(options, val ? cb1 : cb2);
                    });
                    _utils.on.call(searchInput, 'input', fn);
                })();
            }

            (_context7 = this.rootDOM, _utils.addClass).call(_context7, 'fm-select-wrapper-' + this.size);
            (_context7 = this.select, _utils.on).call(_context7, 'click', scope.showOptionList);

            if (this.mode === 'tags') {
                (function () {
                    var _context8;

                    var tagInput = (_context8 = _this2.rootDOM, _utils.query).call(_context8, '.fm-tag-input > span');

                    var renderTag = function renderTag(value) {
                        scope.value.push({ item: value, data: { value: value }, $elem: null });
                        tagInput.innerHTML = '&nbsp;';
                        scope.$apply();
                    };

                    (_context8 = _this2.select, _utils.on).call(_context8, 'click', function () {
                        return tagInput.focus();
                    });
                    _utils.on.call(tagInput, 'keydown', function (e) {
                        var value = tagInput.innerText.trim();
                        if (e.keyCode !== 13) return;
                        e.preventDefault();
                        if (value !== '') {
                            if (scope.value.every(function (existOption) {
                                return existOption.item !== value;
                            })) {
                                renderTag(value);
                            } else {
                                tagInput.innerHTML = '&nbsp;';
                            }
                        }
                    });

                    _utils.on.call(tagInput, 'blur', function (e) {
                        var value = tagInput.innerText.trim();
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
                    if (scope.value.every(function (existOption) {
                        return existOption !== option;
                    })) {
                        scope.value.push(option);
                        scope.tagsRef.push(elem);
                    }
                } else {
                    scope.value = option;
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