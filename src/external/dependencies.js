
export function dependencies(...injection){
    return function(target, key, descriptor){
        target.$inject = injection
    }
}
