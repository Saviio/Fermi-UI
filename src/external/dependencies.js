
export function dependencies(...injection){
    return target => {
        target.$inject = injection
    }
}
