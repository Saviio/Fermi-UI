'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var plain = function plain($sce) {
  return function (html) {
    return $sce.trustAsHtml(html);
  };
};
plain.$inject = ['$sce'];

exports.default = plain;