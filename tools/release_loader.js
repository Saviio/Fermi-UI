'use strict'

let mkdirp = require('mkdirp')
let path = require('path')
var re = /require\(['|"](.*)\.html['|"]\)/igm

module.exports = function(source, map) {
    this.cacheable && this.cacheable()
    let tmplDeps = re.match(source)
    debugger 
    return source
}
