'use strict'

const fs = require('fs')
const path = require('path')
const re = /import\s?\{(\s?.*\s?){1,}\}\s?from\s[('|")][^('|")]*[('|")]/igm


const ignore = [
    'index.scss',
    '.DS_Store',
    'index.js',
    'theme.scss'
]



let src = path.resolve('src')
let files = fs.readdirSync(src)
let ignoreFile = i => ignore.indexOf(i) === -1

let store = {}

files.filter(ignoreFile).forEach(i => {
    try{
        let components = fs.readFileSync(`${src}/${i}/index.js`, 'utf8')
        let deps = components.match(re)
        console.log(deps)
    } catch(e) {}
})
