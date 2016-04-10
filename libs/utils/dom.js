'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.getCoords = getCoords;
exports.getStyle = getStyle;
exports.hasClass = hasClass;
exports.addClass = addClass;
exports.removeClass = removeClass;
exports.replaceClass = replaceClass;
exports.on = on;
exports.off = off;
exports.before = before;
exports.after = after;
exports.prepend = prepend;
exports.last = last;
exports.remove = remove;
exports.replace = replace;
exports.isDOM = isDOM;
exports.inDoc = inDoc;
exports.toDOM = toDOM;
exports.query = query;
exports.queryAll = queryAll;
exports.createElem = createElem;
exports.isHidden = isHidden;
exports.forceReflow = forceReflow;
exports.setStyle = setStyle;
exports.removeStyle = removeStyle;
exports.props = props;

var _lang = require('./lang');

var testElem = document.createElement('div');
var reUnit = /width|height|top|left|right|bottom|margin|padding/i;
var reBool = /true|false/i;
var fragmentType = 11;
var fetchLastEl = function fetchLastEl(node) {
    return node.type === fragmentType ? node.lastChild : node;
};
var fetchFirstEl = function fetchFirstEl(node) {
    return node.type === fragmentType ? node.firstChild : node;
};

function getCoords(el) {
    if (el === undefined) el = this;
    if (!isDOM(el)) return;

    var box = el.getBoundingClientRect(),
        self = window,
        doc = el.ownerDocument,
        body = doc.body,
        html = doc.documentElement,
        clientTop = html.clientTop || body.clientTop || 0,
        clientLeft = html.clientLeft || body.clientLeft || 0;

    return {
        top: box.top + (self.pageYOffset || html.scrollTop || body.scrollTop) - clientTop,
        left: box.left + (self.pageXOffset || html.scrollLeft || body.scrollLeft) - clientLeft
    };
}

function getStyle(el, name) {
    var removedUnit = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];

    if (typeof el === "string") {
        ;
        var _ref = [this, el, name === undefined ? "" : name];
        el = _ref[0];
        name = _ref[1];
        removedUnit = _ref[2];
    }if (!isDOM(el)) return;

    var style = window.getComputedStyle ? window.getComputedStyle(el, null)[name] : el.currentStyle[name];

    if (name === 'width' || name === 'height') {
        if (name == 'width') style = el.offsetWidth;else if (name == 'height') style = el.offsetHeight;
    }

    if (removedUnit !== "" && (0, _lang.getType)(style) === 'String') {
        style = ~ ~style.replace(new RegExp(removedUnit), "");
    }

    return style;
}

function hasClass(el, cls) {
    if (typeof el === 'string') {
        ;
        var _ref2 = [this, el];
        el = _ref2[0];
        cls = _ref2[1];
    }if (!isDOM(el)) return;
    var clsList = void 0;
    if (el.classList) {
        clsList = Array.from(el.classList);
    } else {
        clsList = (el.getAttribute('class') || '').split(' ');
    }

    return clsList.indexOf(cls) > -1;
}

function addClass(el, cls) {
    if (typeof el === 'string') {
        ;
        var _ref3 = [this, el];
        el = _ref3[0];
        cls = _ref3[1];
    }if (!isDOM(el)) return;

    var clsList = cls.split(' ');

    while (cls = clsList.pop()) {
        if (el.classList) {
            el.classList.add(cls);
        } else {
            var cur = ' ' + (el.getAttribute('class') || '') + ' ';
            if (cur.indexOf(' ' + cls + ' ') < 0) {
                el.setAttribute('class', (cur + cls).trim());
            }
        }
    }
    return el;
}

function removeClass(el, cls) {
    if (typeof el === 'string') {
        ;
        var _ref4 = [this, el];
        el = _ref4[0];
        cls = _ref4[1];
    }if (!isDOM(el)) return;

    var clsList = cls.split(' ');
    while (cls = clsList.pop()) {
        if (el.classList) {
            el.classList.remove(cls);
        } else {
            var cur = ' ' + (el.getAttribute('class') || '') + ' ';
            var tar = ' ' + cls + ' ';
            while (cur.indexOf(tar) >= 0) {
                cur = cur.replace(tar, ' ');
            }

            el.setAttribute('class', cur.trim());
        }

        if (!el.className) {
            el.removeAttribute('class');
        }
    }
    return el;
}

function replaceClass(el, orig, mdi) {
    var _context;

    if (typeof el === 'string') {
        ;
        var _ref5 = [this, el, orig];
        el = _ref5[0];
        orig = _ref5[1];
        mdi = _ref5[2];
    }if (!isDOM(el)) return;
    (_context = el, removeClass).call(_context, orig);
    (_context = el, addClass).call(_context, mdi);
    return el;
}

function on(el, event, cb) {
    if (typeof el === 'string') {
        ;
        var _ref6 = [this, el, event];
        el = _ref6[0];
        event = _ref6[1];
        cb = _ref6[2];
    }if (!isDOM(el)) return;
    var evts = event.split(' ');
    while (evts.length) {
        el.addEventListener(evts.pop(), cb);
    }
    return el;
}

function off(el, event, cb) {
    if (typeof el === 'string') {
        ;
        var _ref7 = [this, el, event];
        el = _ref7[0];
        event = _ref7[1];
        cb = _ref7[2];
    }if (!isDOM(el)) return;
    var evts = event.split(' ');
    while (evts.length) {
        el.removeEventListener(evts.pop(), cb);
    }
    return el;
}

function before(target, el) {
    if (arguments.length === 1) {
        ;
        var _ref8 = [this, target];
        target = _ref8[0];
        el = _ref8[1];
    }el = toDOM(el);
    var lastEl = fetchLastEl(el);
    target.parentNode.insertBefore(el, target);
    return lastEl;
}

function after(target, el) {
    if (arguments.length === 1) {
        ;
        var _ref9 = [this, target];
        target = _ref9[0];
        el = _ref9[1];
    }el = toDOM(el);
    var lastEl = fetchLastEl(el);
    return target.nextSibling ? before(target.nextSibling, el) : target.parentNode.appendChild(el), lastEl;
}

function prepend(target, el) {
    var _context2;

    if (arguments.length === 1) {
        ;
        var _ref10 = [this, target];
        target = _ref10[0];
        el = _ref10[1];
    }el = toDOM(el);
    var firstEl = fetchFirstEl(el);
    return target.firstChild ? (_context2 = target.firstChild, before).call(_context2, el) : target.appendChild(el), firstEl;
}

function last(target, el) {
    var _context3;

    if (arguments.length === 1) {
        ;
        var _ref11 = [this, target];
        target = _ref11[0];
        el = _ref11[1];
    }el = toDOM(el);
    var lastEl = fetchLastEl(el);
    return target.length > 0 ? (_context3 = target.lastChild, after).call(_context3, el) : target.appendChild(el), lastEl;
}

function remove(el) {
    if (arguments.length === 0) {
        ;
        el = this;
    }el.parentNode.removeChild(el);
}

function replace(target, el) {
    if (arguments.length === 1) {
        ;
        var _ref12 = [this, target];
        target = _ref12[0];
        el = _ref12[1];
    }el = toDOM(el);

    var lastEl = fetchLastEl(el);
    var parent = target.parentNode;
    if (parent) {
        parent.replaceChild(el, target);
    }
    return lastEl;
}

function isDOM(el) {
    if (el.nodeType && el.nodeName) return true;
    return false;
}

function inDoc(el) {
    if (arguments.length === 0) el = this;
    var doc = document.documentElement;
    var parent = el && el.parentNode;
    return doc === el || doc === parent || !!(parent && parent.nodeType === 1 && doc.contains(parent));
}

function toDOM(el) {
    if (arguments.length === 0) el = this;
    if (typeof el === 'string') {
        el = (0, _lang.trim)(el);
        var dom = createElem('div');
        var fragment = document.createDocumentFragment();
        dom.innerHTML = el;
        while (dom.firstChild) {
            fragment.appendChild(dom.firstChild);
        }
        el = fragment.childNodes.length === 1 ? fragment.childNodes[0] : fragment;
    }

    return el;
}

/*
//not supported in old browsers
export function toDOM(el) {
    if(arguments.length === 0) el = this
    if(typeof el === 'string'){
        var temp = document.createElement('template');
        temp.innerHTML = strHTML;
        return temp.content;
    }
    return el
}
*/

function query(el) {
    var base = this ? this.__esModule ? document : this : document;
    if (typeof el === 'string') {
        var selector = el;
        el = base.querySelector(selector);
    }
    return el;
}

function queryAll(el) {
    var base = this ? this.__esModule ? document : this : document;
    if (typeof el === 'string') {
        var selector = el;
        el = base.querySelectorAll(selector);
    }
    return el;
}

function createElem(tag) {
    return document.createElement(tag);
}

function isHidden(el) {
    return !(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}

function forceReflow(el) {
    if (arguments.length === 0) el = this;
    el.offsetHeight;
}

function setStyle(el, styles) {
    if (arguments.length === 1) {
        ;
        var _ref13 = [this, el];
        el = _ref13[0];
        styles = _ref13[1];
    }var hasCSSText = typeof el.style.cssText !== 'undefined';
    var oldStyleText = void 0;
    var oldStyle = {};
    oldStyleText = hasCSSText ? el.style.cssText : el.getAttribute('style');
    oldStyleText.split(';').forEach(function (css) {
        if (css.indexOf(':') !== -1) {
            var _css$split = css.split(':');

            var _css$split2 = _slicedToArray(_css$split, 2);

            var key = _css$split2[0];
            var value = _css$split2[1];

            oldStyle[key.trim()] = value.trim();
        }
    });

    var newStyle = {};
    Object.keys(styles).forEach(function (key) {
        var value = styles[key];
        newStyle[key] = value;
    });

    var mergedStyle = Object.assign({}, oldStyle, newStyle);
    var styleText = Object.keys(mergedStyle).map(function (key) {
        return key + ': ' + mergedStyle[key] + ';';
    }).join(' ');
    if (hasCSSText) {
        el.style.cssText = styleText;
    } else {
        el.setAttribute('style', styleText);
    }
    return el;
}

function removeStyle(el, shouldRemovedStyles) {
    if (arguments.length === 1) {
        ;

        var _ref14 = [this, el];
        el = _ref14[0];
        shouldRemovedStyles = _ref14[1];
    }var hasCSSText = typeof el.style.cssText !== 'undefined';
    var styleText = void 0,
        style = {};

    var ignoreKeys = Object.keys(shouldRemovedStyles);
    styleText = hasCSSText ? el.style.cssText : el.getAttribute('style');
    styleText.split(';').forEach(function (css) {
        if (css.indexOf(':') !== -1) {
            var _css$split3 = css.split(':');

            var _css$split4 = _slicedToArray(_css$split3, 2);

            var key = _css$split4[0];
            var value = _css$split4[1];

            key = key.trim();
            if (ignoreKeys.indexOf(key) === -1) {
                style[key.trim()] = value.trim();
            }
        }
    });

    var newStyleText = Object.keys(style).map(function (key) {
        return key + ': ' + style[key] + ';';
    }).join(' ');
    if (hasCSSText) {
        el.style.cssText = newStyleText;
    } else {
        el.setAttribute('style', newStyleText);
    }
    return el;
}

function props(el, key) {
    if (typeof el === 'string') {
        ;

        var _ref15 = [this, el];
        el = _ref15[0];
        key = _ref15[1];
    }var attr = null;
    if (el instanceof angular.element) {
        var _context4;

        attr = (_context4 = el).attr.bind(_context4);
    } else if (isDOM(el)) {
        var _context5;

        attr = (_context5 = el).getAttribute.bind(_context5);
    } else {
        throw new Error("Element was not specified.");
    }

    var ret = attr(key);

    if (ret == undefined) {
        return false;
    } else if (key === 'disabled' && ret === 'disabled') {
        return true;
    } else if (ret === "") {
        return true;
    } else if (reBool.test(ret)) {
        return ret === 'true';
    } else if (/^\d{1,}$/.test(ret)) {
        return ~ ~ret;
    }

    return ret;
}