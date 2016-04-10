'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dependencies = require('../external/dependencies');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//const reCurlyBrace= /\{\{([^{}]*)\}\}/g

var CleanStyleDirective = function () {
    function CleanStyleDirective() {
        _classCallCheck(this, CleanStyleDirective);

        this.priority = '99';
        this.restrict = 'AC';
        this.scope = false;
    }

    _createClass(CleanStyleDirective, [{
        key: 'link',
        value: function link(scope, $elem, attrs) {
            var init = false;
            scope.$watch(attrs.cleanStyle, function (newValue, oldValue) {
                if (oldValue && newValue !== oldValue) {
                    $elem.attr('style', newValue);
                }

                if (!init) {
                    $elem.attr('style', newValue);
                    init = true;
                }
            }, true);

            $elem.removeAttr('clean-style');
        }
    }]);

    return CleanStyleDirective;
}();

exports.default = CleanStyleDirective;