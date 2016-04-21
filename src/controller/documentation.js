import { dependencies } from '../external/dependencies'


let leak

if(__LEAK__){
    let index = 0
    let running = false
    let rand = () => Math.floor(Math.random() * 10 + 1)
    leak = function(){
        let path = [
            "li[ui-sref='documentation.introduction']",
            "li[ui-sref='documentation.menu']",
            "li[ui-sref='documentation.button']",
            "li[ui-sref='documentation.step']",
            "li[ui-sref='documentation.tab']",
            "li[ui-sref='documentation.pagination']",
            "li[ui-sref='documentation.checkbox']",
            "li[ui-sref='documentation.radio']",
            "li[ui-sref='documentation.select']",
            "li[ui-sref='documentation.switch']"
        ]
        document.querySelector(path[rand() - 1]).click()
        setTimeout(() => leak(), 500)
    }
}




@dependencies('$timeout', '$state')
export default class Documentation{
    constructor(timeout, state){
        if(state.current.name === 'documentation'){
            state.transitionTo('documentation.introduction')
        }

        if(__LEAK__){
            if(!running){
                leak()
                running = true
            }
        }
    }
}
