'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.animationEndEvent = exports.animationProp = exports.transitionEndEvent = exports.transitionProp = undefined;

var _browser = require('./browser');

var isWebkitTrans = _browser.WIN.ontransitionend === undefined && _browser.WIN.onwebkittransitionend !== undefined;
var isWebkitAnim = _browser.WIN.onanimationend === undefined && _browser.WIN.onwebkitanimationend !== undefined;

var transitionProp = isWebkitTrans ? 'WebkitTransition' : 'transition';
var transitionEndEvent = isWebkitTrans ? 'webkitTransitionEnd' : 'transitionend';
var animationProp = isWebkitAnim ? 'WebkitAnimation' : 'animation';
var animationEndEvent = isWebkitAnim ? 'webkitAnimationEnd' : 'animationend';

exports.transitionProp = transitionProp;
exports.transitionEndEvent = transitionEndEvent;
exports.animationProp = animationProp;
exports.animationEndEvent = animationEndEvent;