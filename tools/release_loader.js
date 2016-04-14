'use strict'

let fs = require('fs-extra')
let path = require('path')
let reTemplate = /require\(['|"](.*\.html)['|"]\)/igm
let reSCSS = /require\(['|"](.*\.scss)['|"]\)\s?;?/igm

let dir = path.resolve()

let directory = function(path){
    try{
        fs.ensureDirSync(path)
    } catch(e) {
        throw new Error('Creating dict failed:' + path)
    }
    this.base = path
}


directory.prototype.write = function(filename, source){
    try{
        fs.outputFileSync(this.base + '/' + filename, source)
    } catch(e) {
        throw new Error('File was not created. Error:' + e)
    }
    return this
}

let removeSCSS = function(source){
    return source.replace(reSCSS, '')
}

let createContext = function(module){
    let outDir = 'lib'
    let base = 'src'

    let folderPath = module.resource.replace(dir + '/' + base + '/', '').split('/')
    let filename = folderPath.pop()

    let outputPath = [dir, outDir].concat(folderPath).join('/')
    let currentPath = [dir, base].concat(folderPath).join('/')

    return {
        outDir:outDir,
        output:outputPath,
        current:currentPath,
        file:filename
    }
}


module.exports = function(source, map) {
    this.cacheable && this.cacheable()
    let context = createContext(this)
    let dep = null
    let _source = removeSCSS(source)

    while(dep = (reTemplate.exec(source) || [])[1]){
        let file = fs.readFileSync(path.resolve(context.current, dep), 'utf8')
        _source = _source.replace(new RegExp("require\\(['|\"]" + dep + "['|\"]\\)", 'igm'), JSON.stringify(file))
    }

    let outputDir = new directory(context.output)
    outputDir.write(context.file, _source)

    return source
}
