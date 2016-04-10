'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../../utils');

var _template = require('../template/template.html');

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Switch = function () {
    function Switch() {
        _classCallCheck(this, Switch);

        this.restrict = 'EA';
        this.replace = true;
        this.scope = {
            value: '=',
            label: '@'
        };
        this.transclude = true;
        this.template = _template2.default;
    }

    _createClass(Switch, [{
        key: 'link',
        value: function link(scope, $elem, attr, ctrl) {
            var defaultValue = _utils.props.call($elem, 'default');
            scope.value = defaultValue;
            $elem.children().find('span').bind('click', function () {
                scope.value = !scope.value;
                if (!/\$apply|\$digest/.test(scope.$root.$$phase)) scope.$apply();
            });
        }
    }]);

    return Switch;
}();

exports.default = Switch;