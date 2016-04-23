import { dependencies } from '../../external/dependencies'

export default class Select{
    constructor(){
        this.list = [
            { name: 'Jack' },
            { name: 'Rose' },
            { name: 'Heart of Occean' },
            { name: 'Titanic' }
        ]
    }

    output(value){
        console.log(value)
    }
}
