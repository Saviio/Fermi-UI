'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.noop = noop;
exports.is = is;
exports.nextFid = nextFid;
exports.nextId = nextId;
exports.nextUid = nextUid;
exports.clamp = clamp;
exports.range = range;
exports.queue = queue;
exports.debounce = debounce;
exports.trim = trim;
exports.isPromise = isPromise;
exports.getType = getType;
exports.escapeHTML = escapeHTML;
function noop() {}

function is(v1, v2) {
    if (this !== undefined) {
        var _ref = [this, v1];
        v1 = _ref[0];
        v2 = _ref[1];
    }

    if (!Object.is) {
        if (v1 === 0 && v2 === 0) return 1 / v1 === 1 / v2;
        if (v1 !== v1) return v2 !== v2;
        return v1 === v2;
    } else {
        return Object.is(v1, v2);
    }
}

var _FMId = 1;
function nextFid() {
    _FMId++;
    var id = _FMId.toString().split('');
    var len = id.length;
    for (var i = 0; i < 5 - len; i++) {
        id.unshift("0");
    }return id.join('.').toString();
}

function nextId() {
    return _FMId++;
}

function nextUid() {
    return '_F' + ("0000" + (Math.random() * Math.pow(36, 6) << 0).toString(36)).slice(-6) + nextId();
}

function clamp(val, min, max) {
    return val < min ? min : val > max ? max : val;
}

function range(size) {
    var start = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    var arr = [];
    for (var i = start; i <= size; i++) {
        arr.push(i);
    }return arr;
}

function queue() {
    var isAsync = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
    var interval = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    var waiting = [];

    var next = function next() {
        var fn = waiting.shift();
        if (fn) {
            isAsync ? setTimeout(function () {
                return fn(next);
            }, interval) : fn(next);
        }
    };

    var entry = function entry(fn) {
        waiting.push(fn);
        if (waiting.length === 1) next();
    };

    entry.count = function () {
        return waiting.length;
    };
    return entry;
}

function debounce(func, wait) {
    var timeout = void 0,
        args = void 0,
        ctx = void 0,
        timestamp = void 0,
        ret = void 0;
    var later = function later() {
        var last = Date.now() - timestamp;
        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            ret = func.apply(ctx, args);
            if (!timeout) ctx = args = null;
        }
    };

    return function () {
        ctx = this;
        args = arguments;
        timestamp = Date.now();
        if (!timeout) timeout = setTimeout(later, wait);
        return ret;
    };
}

function trim(str) {
    if (arguments.length === 0) str = this;
    return str.replace(/^\s+|\s+$/g, '');
}

function isPromise(obj) {
    return !!obj && ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function getType(obj) {
    if (arguments.length === 0) obj = this;
    return Object.prototype.toString.call(obj).replace(/^\[object (\w+)\]$/, '$1');
}

function escapeHTML(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&#34;").replace(/'/g, "&#39;");
}