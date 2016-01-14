import { getType } from './index'

let copy = function(dest, ignore){
    let obj = {}
    if(ignore::getType() !== 'Array'){
        ignore = [ignore]
    }

    for(var i in dest){
        if(ignore.indexOf(i) === -1){
            obj[i] = dest[i]
        }
    }

    return obj
}

export default class cache{
    constructor(){
        this.__mapData__ = {}
    }

    has(key){
        return this.__mapData__[key] !== undefined
    }

    remove(key){
        let data = this.__mapData__[key]
        this.__mapData__ = copy(this.__mapData__, key)
        return data
    }

    clear(){
        this.__mapData__ = {}
    }

    add(key, data){
        this.__mapData__[key] = data
    }

    get(key){
        return this.__mapData__[key]
    }
}
