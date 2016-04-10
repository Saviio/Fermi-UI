'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//为了看起来比较“完整”的支持使用ES6 Class 来编写Angular Directive，因此做了些小技巧来保证开发体验是一致的，directive的controller方法会在运行时多传入一个或两个依赖。
//directive 流程： compile => controller => link
//可能在某些corner case可能会导致工作失常，尚在斟酌中。

var FermiIdenitifer = 'data-fermiId';
var _cache = new Map();

var Factory = function () {
	function Factory() {
		_classCallCheck(this, Factory);
	}

	_createClass(Factory, null, [{
		key: 'component',
		value: function component(Directive) {
			var factory = function factory() {
				for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
					args[_key] = arguments[_key];
				}

				var instance = new (Function.prototype.bind.apply(Directive, [null].concat(args)))();

				if (typeof instance.compile === 'function') {
					(function () {
						var compileOrg = instance.compile;
						instance.compile = function () {
							var ins = new (Function.prototype.bind.apply(Directive, [null].concat(args)))();

							for (var _len2 = arguments.length, compileArgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
								compileArgs[_key2] = arguments[_key2];
							}

							var $elem = compileArgs[0];
							var restArgs = compileArgs.slice(1);

							var postLink = compileOrg.apply(ins, compileArgs);
							var fmId = (0, _utils.nextFid)();
							_cache.set(fmId, ins);
							$elem.attr(FermiIdenitifer, fmId);

							return function () {
								for (var _len3 = arguments.length, linkArgs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
									linkArgs[_key3] = arguments[_key3];
								}

								var scope = linkArgs[0];
								var $elem = linkArgs[1];
								var restArgs = linkArgs.slice(2);

								if (postLink !== undefined) {
									postLink.apply(ins, linkArgs);
								}

								$elem.removeAttr(FermiIdenitifer);
								_cache.delete(fmId);
							};
						};
					})();
				} else if (typeof instance.link === 'function') {
					(function () {
						var linkOrg = instance.link;
						instance.link = function () {
							for (var _len4 = arguments.length, linkArgs = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
								linkArgs[_key4] = arguments[_key4];
							}

							var scope = linkArgs[0];
							var $elem = linkArgs[1];
							var restArgs = linkArgs.slice(2);

							var fmId = $elem.attr(FermiIdenitifer);
							var caller = void 0;
							if (fmId !== undefined) {
								caller = _cache.get(fmId);
								_cache.delete(fmId);
								$elem.removeAttr(FermiIdenitifer);
							} else {
								caller = new (Function.prototype.bind.apply(Directive, [null].concat(args)))();
							}

							linkOrg.apply(caller, linkArgs);
						};
					})();
				}

				if (typeof instance.controller === 'function') {
					(function () {
						var controllerOrg = instance.controller;
						instance.controller.$inject = instance.controller.$inject || ['$scope', '$element'];

						if (instance.controller.$inject.indexOf('$scope') === -1) {
							instance.controller.$inject = [].concat(_toConsumableArray(instance.controller.$inject), ['$scope']);
						}

						if (instance.controller.$inject.indexOf('$element') === -1) {
							instance.controller.$inject = [].concat(_toConsumableArray(instance.controller.$inject), ['$element']);
						}

						instance.controller = function () {
							var scopeIndex = instance.controller.$inject && instance.controller.$inject.indexOf('$scope');
							var elemIndex = instance.controller.$inject && instance.controller.$inject.indexOf('$element');

							for (var _len5 = arguments.length, controllerArgs = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
								controllerArgs[_key5] = arguments[_key5];
							}

							var $elem = elemIndex !== -1 && elemIndex !== undefined && controllerArgs[elemIndex];

							var fmId = $elem.attr(FermiIdenitifer);
							var caller = void 0;

							if (fmId !== undefined) {
								caller = _cache.get(fmId);
							} else {
								caller = new (Function.prototype.bind.apply(Directive, [null].concat(args)))();
								fmId = (0, _utils.nextFid)();
								_cache.set(fmId, caller);
								$elem.attr(FermiIdenitifer, fmId);
							}

							controllerOrg.apply(caller, controllerArgs);

							if (typeof instance.passing === 'function') {
								instance.passing.apply(caller, [this].concat(controllerArgs));
							}

							if (typeof instance.link !== 'function' && fmId !== undefined) {

								_cache.delete(fmId);
								$elem.removeAttr(FermiIdenitifer);
							}
						};

						instance.controller.$inject = controllerOrg.$inject;
					})();
				} else if (typeof instance.passing === 'function') {

					instance.controller = function () {
						for (var _len6 = arguments.length, controllerArgs = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
							controllerArgs[_key6] = arguments[_key6];
						}

						var scope = controllerArgs[0];
						var $elem = controllerArgs[1];
						var restArgs = controllerArgs.slice(2);

						var fmId = $elem.attr(FermiIdenitifer);
						var caller = void 0;
						if (fmId !== undefined) {
							caller = _cache.get(fmId);
						} else {
							caller = new (Function.prototype.bind.apply(Directive, [null].concat(args)))();
							fmId = (0, _utils.nextFid)();
							_cache.set(fmId, caller);
							$elem.attr(FermiIdenitifer, fmId);
						}
						instance.passing.apply(caller, [this]);

						if (typeof instance.link !== 'function' && fmId !== undefined) {
							$elem.removeAttr(FermiIdenitifer);
							_cache.delete(fmId);
						}
					};

					instance.controller.$inject = ['$scope', '$element'];
				}

				return instance;
			};

			factory.$inject = Directive.$inject || [];
			return factory;
		}
	}, {
		key: 'directive',
		value: function directive(Directive) {
			return function () {
				for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
					args[_key7] = arguments[_key7];
				}

				return new (Function.prototype.bind.apply(Directive, [null].concat(args)))();
			};
		}
	}]);

	return Factory;
}();

exports.default = Factory;