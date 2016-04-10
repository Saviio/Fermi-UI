'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var config = {
    zhCN: {
        'Go': '跳至',
        'PleaseConfirm': '请确认',
        'ok': '确定',
        'dismiss': '取消',
        'pleaseInput': '请输入',
        'page': '页'
    },
    enUS: {
        'Go': 'Go',
        'PleaseConfirm': 'Please Confirm',
        'ok': 'OK',
        'dismiss': 'Dismiss',
        'page': 'Page',
        'pleaseInput': 'Please input...'
    }
};

var service = function () {
    function service() {
        _classCallCheck(this, service);

        this.lang = 'zhCN';
    }

    _createClass(service, [{
        key: 'locale',
        value: function locale(lang) {
            this.lang = lang;
        }
    }, {
        key: 'localize',
        value: function localize(lang, option) {
            config[lang] = option;
        }
    }, {
        key: 'transform',
        value: function transform() {
            var _this = this;

            return function (key) {
                if (key === null || key === undefined || key === '') return '';
                var pack = config[_this.lang];
                if (pack === undefined) {
                    throw new Error('no language package supported, please the config manually via i18n.localize(lang, config).');
                }

                return pack[key];
            };
        }
    }]);

    return service;
}();

var instance = new service();

exports.default = instance;