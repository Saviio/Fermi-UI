import { dependencies } from '../../external/dependencies'

@dependencies('Fermi.Modal')
export default class i18n{
    constructor(modal){
        this.modal = modal
    }

    showModal(){
        this.modal.confirm({
            content: '一个中文的对话框',
            width: 400
        })
    }
}
