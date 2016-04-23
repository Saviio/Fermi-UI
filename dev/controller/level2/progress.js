import { dependencies } from '../../external/dependencies'

@dependencies('$scope', '$timeout', 'Fermi.Loading')
export default class Progress{
    constructor(scope, timeout, loading){
        this.circle1 = 0
        this.loading = loading


        let f = function(){
            this.circleRec()
            this.linearRec()
            timeout(f, 1000)
        }.bind(this)

        f()
    }

    circleRec(){
        this.circle1 +=10
        if(this.circle1 > 100) this.circle1 = 0
    }

    linearRec(){
        this.line +=10
        if(this.line > 100) this.line = 0
    }

    showLoadingbar(){
        this.loading.start()
    }

    closeLoadingbar(){
        this.loading.done()
    }
}
