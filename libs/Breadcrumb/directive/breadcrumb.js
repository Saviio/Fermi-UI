'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.breadcrumbItem = exports.breadcrumb = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _template = require('../template/template.html');

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var breadcrumb = exports.breadcrumb = function () {
    function breadcrumb() {
        _classCallCheck(this, breadcrumb);

        this.restrict = 'EA';
        this.replace = true;
        this.scope = {
            items: '='
        };
        this.transclude = true;
        this.template = _template2.default;
    }

    _createClass(breadcrumb, [{
        key: 'passing',
        value: function passing(exports, scope) {
            exports.add = function (item) {
                return scope.items.push(item);
            };
        }
    }]);

    return breadcrumb;
}();

var breadcrumbItem = exports.breadcrumbItem = function () {
    function breadcrumbItem() {
        _classCallCheck(this, breadcrumbItem);

        this.restrict = 'EA';
        this.replace = true;
        this.require = '^fermiCrumb';
        this.scope = {
            item: '='
        };
    }

    _createClass(breadcrumbItem, [{
        key: 'link',
        value: function link(scope, $element, attrs, parentCtrl) {
            parentCtrl.add(scope.item);
        }
    }]);

    return breadcrumbItem;
}();