export default class fakeEvent{
    constructor(checked){
        this.target = {
            checked:!!checked
        }
    }

    preventDefault(){}
    stopPropagation(){}
}
