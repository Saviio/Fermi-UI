import { dependencies } from '../../external/dependencies'

@dependencies('Fermi.Modal')
export default class Modal{
    constructor(modal){
        this.modal = modal
    }

    showNormal(){
        this.modal.normal({
            content:'Normal Modal',
            width:240
        })
    }


    showConfirm(){
        this.modal.confirm({
            content:'Confirm Modal',
            width:300
        })
    }

    showAsync(){
        let modalIns = this.modal.confirm({
            content:'Please click ok to show another modal.',
            width:300
        })

        modalIns.prevent = true
        modalIns.ok.then((ok, dismiss) => {
            ok.loading()
            return new Promise(resolve => {
                setTimeout(() => {
                    this.modal.normal({
                        content: 'Sorry to have kept you waiting.',
                        width:240
                    })
                    resolve()
                }, 3000)
            }).then(() => {
                ok.done()
                modalIns.close()
            })
        })

        modalIns.dismiss.then(() => modalIns.close())
    }

    showCustomized(){
        let option = {
            template: '#modalTemplate'
        }
        this.modal.open(option)
    }
}
