'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.checked = exports.disabled = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _desc, _value, _class, _dec2, _desc2, _value2, _class2;

var _dependencies = require('../external/dependencies');

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

var disabled = exports.disabled = (_dec = (0, _dependencies.dependencies)('$element', '$attrs'), (_class = function () {
    function disabled() {
        _classCallCheck(this, disabled);

        this.restrict = 'A';
        this.priority = 9000;
        this.scope = false;
    }

    _createClass(disabled, [{
        key: 'controller',
        value: function controller($elem, $attrs) {
            if ($attrs.disabled === "") {
                $elem[0].setAttribute('disabled', true);
            }
        }
    }]);

    return disabled;
}(), (_applyDecoratedDescriptor(_class.prototype, 'controller', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'controller'), _class.prototype)), _class));
var checked = exports.checked = (_dec2 = (0, _dependencies.dependencies)('$element', '$attrs'), (_class2 = function () {
    function checked() {
        _classCallCheck(this, checked);

        this.restrict = 'A';
        this.priority = 9000;
        this.scope = false;
    }

    _createClass(checked, [{
        key: 'controller',
        value: function controller($elem, $attrs) {
            if ($attrs.checked === "") {
                $elem[0].setAttribute('checked', true);
            } else if (/false/i.test($attrs.checked)) {
                $elem[0].removeAttribute('checked');
            }
        }
    }]);

    return checked;
}(), (_applyDecoratedDescriptor(_class2.prototype, 'controller', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'controller'), _class2.prototype)), _class2));