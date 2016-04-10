"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    return function (input, total) {
        for (var i = 0, total = parseInt(total); i < total; i++) {
            input.push(i);
        }
        return input;
    };
};