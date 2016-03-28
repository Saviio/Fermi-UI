import { dependencies } from '../external/dependencies'

@dependencies('$timeout')
export default class Home{
    constructor(timeout){
        this.lineSample = 0
        this.popover = true
        this.timeout = timeout
        timeout(::this.showLineProgress, 2000)
    }

    test(){
        console.log(1)
    }


    showLineProgress(){
        if(this.lineSample >= 100){
            this.lineSample = 0
        } else {
            this.lineSample += 10
        }
        this.timeout(::this.showLineProgress, 2000)
    }

    togglePopover(){
        if(this.popover){
            this.popoverSample.close()
        } else {
            this.popoverSample.open()
        }

        this.popover = !this.popover
    }
}
