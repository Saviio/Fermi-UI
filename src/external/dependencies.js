import { getType } from '../utils'

export function dependencies(...injection){
    return function(target, key, descriptor){
        if(injection.length === 1 &&  injection[0]::getType() === 'Array'){
            injection = injection[0]
        }

        if(target !== null && key === undefined && descriptor === undefined){
            let clazz = class extends target {
                constructor(...args){
                    super(...args)
                }
            }

            clazz.$inject = injection
            return clazz
        } else {
            if(key === 'controller'){
                let raw = descriptor.value
                raw.$inject = injection
                Object.defineProperty(target, key, {
                    ...descriptor,
                    value: raw
                })
            }
        }
    }
}
