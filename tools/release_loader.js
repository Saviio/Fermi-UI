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
        throw new Error('Create directory failed:' + path + ', Error:' e)
    }
    this.base = path
}


directory.prototype.write = function(filename, source){
    try{
        fs.outputFileSync(this.base + path.sep + filename, source)
    } catch(e) {
        throw new Error('File was not created. Error:' + e)
    }
    return this
}

let removeSCSS = function(source){
    return source.replace(reSCSS, '')
}

let createContext = function(module, outDir, base){
    outDir = outDir || 'lib'
    base =  base || 'src'

    let folderPath =  [], p
    let folders = module.resource.split(path.sep)
    while(p = folders.pop()){
        folderPath.unshift(p)
        if(folders.join(path.sep) === dir){
            for(let i = 0; i < folderPath.length; i++){
                if(folderPath[i] === base) {
                    folderPath.splice(i, 1)
                    break
                }
            }
            break
        }
    }

    let filename = folderPath.pop()
    let outputPath = [dir, outDir].concat(folderPath).join(path.sep)
    let currentPath = [dir, base].concat(folderPath).join(path.sep)

    return {
        outDir:outDir,
        output:outputPath,
        current:currentPath,
        file:filename
    }
}


module.exports = function(source, map) {
    //entry file index.js will be overrided.
    this.cacheable && this.cacheable()
    let context = createContext(this)
    let _source = removeSCSS(source)
    let dep = null

    while(dep = (reTemplate.exec(source) || [])[1]){
        let file = fs.readFileSync(path.resolve(context.current, dep), 'utf8')
        _source = _source.replace(new RegExp("require\\(['|\"]" + dep + "['|\"]\\)", 'igm'), JSON.stringify(file))
    }

    let outputDir = new directory(context.output)
    outputDir.write(context.file, _source)

    this.callback(null, source, map)
}
