'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

var _dependencies = require('../../external/dependencies');

var _browser = require('../../utils/browser');

var _transition = require('../../utils/transition');

var _utils = require('../../utils');

var _i18n = require('../../Core/i18n');

var _i18n2 = _interopRequireDefault(_i18n);

var _template = require('../template/template.html');

var _template2 = _interopRequireDefault(_template);

var _confirm2 = require('../template/confirm.html');

var _confirm3 = _interopRequireDefault(_confirm2);

var _normal2 = require('../template/normal.html');

var _normal3 = _interopRequireDefault(_normal2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*

API:

.open(options) => Number

options ::= {
    template: String | dom<class|Id>,
    className: String,
    scope: AngularScope,
    hooks:{
        onOpen: Function,
        onClose: Function
    },
    controller:String,
    controllerAs:String,
    name: String | optional (support for Events: modal::opened, modal::leaving, modal::leaved)
    title: String
}

.closeAll
.close(id)

id ::= Number

private:
  hasOverlay => boolean


*/

var defaultConfirmModal = {
    width: 400,
    title: 'PleaseConfirm',
    content: '',
    okText: 'ok',
    dismissText: 'dismiss',
    onOk: _utils.noop,
    onDismiss: _utils.noop,
    plain: false
};

var defaultNormalModal = {
    width: 400,
    title: '',
    content: '',
    okText: 'ok',
    onOk: _utils.noop,
    plain: false
};

var replacePlainTag = function replacePlainTag(template, isPlain) {
    return template.replace(/#plain\-directive#/m, isPlain ? 'ng-bind-html="content | plain"' : '');
};

var overlayId = '__modalOverlay__';
var overlayInAnimation = 'fm-overlay-In';
var reSelector = /^[#|.]/;
var emptyTemplateError = 'Template should not be set as empty / null / undefined.';

var openedModals = [];
var compile = null;
var rootScope = null;
var controllerGetter = null;

/*
  props::=
     id,
     transition
*/

var ModalInstance = function ModalInstance(props) {
    var resolves = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, ModalInstance);

    this.id = props.id;
    this.closed = new Promise(function (resolve) {
        return resolves.closed = resolve;
    });
    this.opened = new Promise(function (resolve) {
        return resolves.opened = resolve;
    });
    this.close = null;
    this.isClosed = false;
};

//support ngController
//close
//opened/closed   all promise like object?
//confirm ++ dismissed

var Modal = (_dec = (0, _dependencies.dependencies)('$compile', '$controller', '$rootScope'), _dec(_class = function () {
    function Modal($compile, $controller, $rootScope) {
        _classCallCheck(this, Modal);

        this._hasOverlay = false;
        this._overlayNode = null;
        compile = $compile;
        rootScope = $rootScope;
        controllerGetter = $controller;
    }

    _createClass(Modal, [{
        key: '__tryRender__',
        value: function __tryRender__() {
            if (this._hasOverlay) return;

            var overlay = (0, _utils.createElem)('div');
            overlay.id = overlayId;
            this._overlayNode = _utils.last.call(_browser.BODY, overlay);
            this._hasOverlay = true;
            setTimeout(function () {
                return _utils.addClass.call(overlay, overlayInAnimation);
            }, 17);
        }
    }, {
        key: '__tryDispose__',
        value: function __tryDispose__() {
            var _context;

            if (openedModals.length > 0) return;
            if (!this._hasOverlay || this._overlayNode === null || !(_context = this._overlayNode, _utils.inDoc).call(_context)) return;

            var overlayNode = this._overlayNode;
            _utils.removeClass.call(overlayNode, overlayInAnimation);
            this._hasOverlay = false;
            this._overlayNode = null;
            setTimeout(function () {
                return _utils.remove.call(overlayNode);
            }, 400);
        }
    }, {
        key: '__remove__',
        value: function __remove__(id) {
            var index = void 0;
            for (var i = 0; i < openedModals.length; i++) {
                if (openedModals[i].id === id) {
                    index = i;
                    break;
                }
            }

            if (modal) {
                openedModals.splice(index, 1);
                this.__tryDispose__();
            }
        }
    }, {
        key: 'open',
        value: function open(options) {
            var _context2,
                _this = this;

            if (options === undefined) throw new Error('No parameters passed in when call Function: Fermi.Modal.open.');
            if (options.template === undefined) throw new Error(emptyTemplateError);
            this.__tryRender__();

            var className = options.className || 'fm-modal';
            //let modalName = options.name || null
            var title = _i18n2.default.transform()((options.title || '').toString());

            var template = reSelector.test(options.template) ? _utils.query.call(_browser.DOM, options.template).innerHTML : options.template;

            if (_utils.trim.call(template) === '') throw new Error(emptyTemplateError);
            var $template = angular.element(template);

            var passInScope = options.scope || rootScope;
            passInScope = passInScope.__NEW__ ? passInScope : passInScope.$new();
            var modalScope = passInScope;
            var type = (_context2 = options.controller, _utils.getType).call(_context2);
            if (type === 'String' || type === 'Array' || type === 'Function') {
                var alias = options.controllerAs || null;

                var controller = void 0;

                if (type === 'String' || type === 'Function') {
                    controller = controllerGetter(options.controller, {
                        $scope: modalScope,
                        $element: $template
                    }, false, alias);
                } else if (type === 'Array') {
                    var f = options.controller.pop();
                    if (_utils.getType.call(f) !== 'Function') throw Error('Controller should be a Function type.');
                    f.$inject = options.controller;

                    controller = controllerGetter(f, {
                        $scope: modalScope,
                        $element: $template
                    }, false, alias);
                }

                controller.$scope = modalScope;
                if (alias !== null) {
                    if (type === 'String') modalScope[alias] = controller;else if (type === 'Array' || type === 'Function') modalScope[alias] = controller.$scope;
                }
            }

            var templateDOM = compile($template)(modalScope)[0];
            if (!/\$apply|\$digest/.test(modalScope.$root.$$phase)) modalScope.$apply();

            var openedId = (0, _utils.nextId)();
            var resolves = {};

            var modalContainer = (0, _utils.toDOM)(_template2.default);
            modalContainer.setAttribute('_FM-ModalId', openedId);
            var modalContent = _utils.query.call(modalContainer, '.fm-modal');
            if (className !== 'fm-modal') {
                modalContent.className = className;
            }

            if (_utils.trim.call(title) !== '') {
                _utils.query.call(modalContent, '.fm-modal-title').innerHTML = (0, _utils.escapeHTML)(title);
            }

            var closeBtn = _utils.query.call(modalContainer, '.fm-close');
            var modalTransition = new _transition.transition(modalContent, className, false, 5000, {
                onEnter: function onEnter() {
                    if (resolves.opened) resolves.opened();
                },
                onLeave: function onLeave() {
                    _utils.remove.call(modalContainer);
                    if (resolves.closed) resolves.closed();
                    modalScope.$destroy();
                }
            });

            (_context2 = _utils.query.call(modalContainer, '.fm-modal-content'), _utils.prepend).call(_context2, templateDOM);

            var modalIns = new ModalInstance({
                id: openedId,
                transition: modalTransition
            }, resolves);

            modalIns.close = function () {
                if (!modalIns.isClosed) {
                    modalTransition.state = false;
                    _this.__remove__(openedId);
                    modalIns.isClosed = true;
                }
            };

            openedModals.push(modalIns);

            _utils.on.call(closeBtn, 'click', function (e) {
                return modalIns.close();
            });
            _utils.last.call(_browser.BODY, modalContainer);

            modalTransition.state = true;
            return modalIns;
        }
    }, {
        key: 'closeAll',
        value: function closeAll() {
            var modal = void 0,
                copyRef = openedModals.slice(0);
            while (modal = copyRef.pop()) {
                modal.close();
            }
        }

        /*
        特化Modal  confirm(options)
                   normal(options)
          options::=
            title
            okText
            cancelText
            width:400
            content
            plain
        */

    }, {
        key: 'confirm',
        value: function confirm() {
            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            options = Object.assign({}, defaultConfirmModal, options);
            var width = options.width.toString().replace('px', '');
            var scope = rootScope.$new();
            var modal = void 0,
                dismiss = void 0,
                ok = void 0;

            scope.__NEW__ = true;

            angular.extend(scope, {
                width: width,
                content: options.content,
                okText: options.okText,
                dismissText: options.dismissText,
                onDismiss: function onDismiss() {
                    if (!modal.prevent) {
                        modal.dismiss.then(function () {
                            return modal.close();
                        });
                    }
                    dismiss(scope.okBtn, scope.dismissBtn);
                },
                onOk: function onOk() {
                    if (!modal.prevent) {
                        modal.ok.then(function () {
                            return modal.close();
                        });
                    }
                    ok(scope.okBtn, scope.dismissBtn);
                }
            });

            options.scope = scope;
            options.template = replacePlainTag(_confirm3.default, options.plain);

            modal = this.open(options);
            modal.dismiss = new Promise(function (resolve) {
                return dismiss = resolve;
            });
            modal.ok = new Promise(function (resolve) {
                return ok = resolve;
            });
            modal.prevent = false;

            return modal;
        }
    }, {
        key: 'normal',
        value: function normal(options) {
            options = Object.assign({}, defaultNormalModal, options);
            var width = options.width.toString().replace('px', '');
            var scope = rootScope.$new();
            var modal = void 0,
                ok = void 0;

            angular.extend(scope, {
                width: width,
                content: options.content,
                okText: options.okText,
                onOk: function onOk() {
                    if (!modal.prevent) {
                        modal.ok.then(function () {
                            return modal.close();
                        });
                    }
                    ok(scope.okBtn);
                }
            });

            options.scope = scope;
            options.template = replacePlainTag(_normal3.default, options.plain);

            modal = this.open(options);
            modal.ok = new Promise(function (resolve) {
                return ok = resolve;
            });

            return modal;
        }
    }]);

    return Modal;
}()) || _class);
exports.default = Modal;