'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {

    var testElem = document.createElement('div');
    var prefix = null;
    var eventPrefix = null;

    var getCoords = function getCoords(elem) {
        var box = elem.getBoundingClientRect(),
            self = window,
            doc = elem.ownerDocument,
            body = doc.body,
            html = doc.documentElement,
            clientTop = html.clientTop || body.clientTop || 0,
            clientLeft = html.clientLeft || body.clientLeft || 0;
        return { top: box.top + (self.pageYOffset || html.scrollTop || body.scrollTop) - clientTop, left: box.left + (self.pageXOffset || html.scrollLeft || body.scrollLeft) - clientLeft };
    };

    function getStyle(elem, name) {
        var removeUnit = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];

        var style = window.getComputedStyle ? window.getComputedStyle(elem, null)[name] : elem.currentStyle[name];

        if ((name === 'width' || name === 'height') && style === 'auto') {
            if (name == 'width') style = elem.offsetWidth;else if (name == 'height') style = elem.offsetHeight;
        }

        if (removeUnit !== "") style = ~ ~style.replace(new RegExp(removeUnit), "");

        return style;
    }

    function escapeHTML(str) {

        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;").replace(/"/g, "&#34;").replace(/'/g, "&#39;");
    }

    function getDOMState(attrs, key) {
        var state = null;
        if (attrs[key] == undefined) {
            state = false;
        } else if (attrs[key] === "") {
            state = true;
        } else {
            var v = attrs[key];
            if (/true|false/i.test(v)) state = !!v;else if (/^\d{1,}$/.test(v)) state = ~ ~v;else state = v;
        }
        return state;
    }

    function addClass(el, cls) {
        if (el.classList) {
            el.classList.add(cls);
        } else {
            var cur = ' ' + (el.getAttribute('class') || '') + ' ';
            if (cur.indexOf(' ' + cls + ' ') < 0) {
                el.setAttribute('class', (cur + cls).trim());
            }
        }
    }

    function removeClass(el, cls) {
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

    function detechPrefix() {
        if (prefix !== null && eventPrefix !== null) return { prefix: prefix, eventPrefix: eventPrefix };

        var vendor = { Webkit: 'webkit', Moz: '', O: 'o' };
        for (var i in vendor) {
            if (testElem.style[i + 'TransitionProperty'] !== undefined) {
                prefix = '-' + i.toLowerCase() + '-';
                eventPrefix = vendor[i];
                return { prefix: prefix, eventPrefix: eventPrefix };
            }
        }
        prefix = eventPrefix = "";
        return { prefix: prefix, eventPrefix: eventPrefix };
    }

    function onMotionEnd(cb) {
        var _this = this;

        if (!(this instanceof angular.element)) return;

        var _detechPrefix = detechPrefix();

        var prefix = _detechPrefix.prefix;
        var eventPrefix = _detechPrefix.eventPrefix;

        var el = this[0];

        var handler = function handler(e) {
            if (e.target === el) {
                _this.unbind(eventPrefix + 'TransitionEnd', handler);
                _this.unbind('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', handler);
                cb();
            }
        };

        this.bind(eventPrefix + 'TransitionEnd', handler);
        this.bind('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', handler);
    }

    function debounce(func, wait) {
        var timeout, args, context, timestamp, result;
        var later = function later() {
            var last = Date.now() - timestamp;
            if (last < wait && last >= 0) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            }
        };
        return function () {
            context = this;
            args = arguments;
            timestamp = Date.now();
            if (!timeout) {
                timeout = setTimeout(later, wait);
            }
            return result;
        };
    }

    return {
        coords: getCoords,
        style: getStyle,
        DOMState: getDOMState,
        escapeHTML: escapeHTML,
        addClass: addClass,
        removeClass: removeClass,
        prefix: detechPrefix,
        onMotionEnd: onMotionEnd,
        debounce: debounce
    };
};