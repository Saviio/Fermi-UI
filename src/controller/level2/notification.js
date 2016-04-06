import { dependencies } from '../../external/dependencies'

@dependencies('Fermi.Notification')
export default class Notification{
    constructor(notification){
        this.notification = notification
    }

    showDefault(){
        this.notification.default('Default', 'Here\'s a default message.')
    }

    showNormal(){
        this.notification.normal('Normal', 'Here\'s a normal message.')
    }

    showSuccess(){
        this.notification.success('Success', 'Here\'s a successful message.')
    }

    showWarning(){
        this.notification.warn('Warning', 'Here\'s a warning message.')
    }

    showError(){
        this.notification.error('Error', 'Here\'s a error.')
    }

    showCustomized(){
        let option = {
            topic: 'customized message',
            message: 'After notification is removed, please check the output in console.',
            type:'normal',
            callback:() => console.info('callback is executed.')
        }
        this.notification.send(option)
    }
}
