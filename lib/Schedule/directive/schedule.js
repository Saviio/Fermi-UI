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

var reStr = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
var reDate = /\/Date\((\d+)\)\//g;
var reTimeStamp = /^\d{1,}$/;

var Schedule = (_dec = (0, _dependencies.dependencies)('$scope'), (_class = function () {
    function Schedule() {
        _classCallCheck(this, Schedule);

        this.restrict = 'EA';
        this.replace = true;
        this.scope = {
            headers: '=?',
            period: '=?',
            start: '@',
            tag: '@',
            control: '=?',
            events: '=?'
        };
        this.transclude = true;
        this.template = _template2.default;
    }

    _createClass(Schedule, [{
        key: 'controller',
        value: function controller(scope) {
            scope.headers = scope.headers || ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            scope.period = scope.period || ['9 am', '10 am', '11 am', '12 pm', '13 pm', '14 pm', '15 pm', '16 pm', '17 pm', '18 pm', '19 pm', '20 pm', '21 pm', '22 pm'];

            var start = function () {
                return scope.start == null ? parseInt(scope.period[0].match(/\d{1,2}/)[0]) : scope.start;
            }();

            scope.thKey = scope.headers.map(function (e) {
                return e.toLowerCase();
            });
            scope.hebdom = {};

            var reColor = function reColor(color) {
                if (color) return 'background-color:' + color;else if (scope.tag) return 'background-color:' + scope.tag;
            };

            var reHeight = function reHeight(minutes, duration) {
                if (minutes === undefined || duration === undefined) return '';

                var skew = 0,
                    height = null;
                if (minutes) skew = minutes / 60;
                height = duration / 60;

                return 'height:' + height * 100 + '%;top:' + skew * 100 + '%;';
            };

            var transform = function transform(set, key) {
                var result = {};

                key = key || 'starttime';

                set.forEach(function (k, i) {
                    var time = void 0;
                    if (reStr.test(k[key])) {
                        time = new Date(0);
                        var info = k[key].match(reStr);
                        time.setYear(info[1]);
                        time.setMonth(info[2] - 1);
                        time.setDate(info[3]);
                        time.setHours(info[4]);
                        time.setMinutes(info[5]);
                        time.setSeconds(info[6]);
                    } else if (reDate.test(k[key])) {
                        time = new Date(k[key].match(reStr)[1]);
                    } else if (reTimeStamp.test(k[key])) {
                        time = new Date(parseInt(k[key]));
                    }

                    k._hours = time.getHours();
                    k._minutes = time.getMinutes();

                    var t = k._hours - start;
                    k._idx = t;
                    k.color = reColor(k.color);
                    k.height = reHeight(k._minutes, k.duration);
                    result[t] = k;
                });

                return result;
            };

            scope.calculateColor = function (evt) {
                if (evt) {
                    var defaultCSS = '#0089C5';
                    if (evt.color) return { 'background-color': '' + evt.color };else if (scope.tag) return { 'background-color': '' + scope.tag };else return { 'background-color': '' + defaultCSS };
                }
            };

            scope.calculateHeight = function (evt) {
                if (evt == null) return;

                var skew = 0,
                    height = null;
                if (evt._minutes) skew = evt._minutes / 60;
                height = evt.duration / 60;

                return {
                    height: height * 100 + '%',
                    top: skew * 100 + '%;'
                };
            };

            scope.control = {
                update: function update(set, key) {
                    for (var i in set) {
                        if (set.hasOwnProperty(i)) {
                            var index = scope.thKey.indexOf(i.toLowerCase());
                            if (index > -1) {
                                scope.hebdom[index] = transform(set[i], key);
                            }
                        }
                    }
                },
                refresh: function refresh(set, key) {
                    scope.hebdom = {};
                    this.update(set, key);
                }
            };

            if (scope.events != null) scope.control.refresh(scope.events);
        }
    }]);

    return Schedule;
}(), (_applyDecoratedDescriptor(_class.prototype, 'controller', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'controller'), _class.prototype)), _class));
exports.default = Schedule;