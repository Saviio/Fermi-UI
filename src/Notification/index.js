import notification from './service/notification'
import './css/notification.scss'

const service = {
    namespace:'Fermi.Notification',
    name:'fermiNotification',
    inject:[]
}

export default angular.module(service.namespace, service.inject)
	.service(service.namespace, notification)
	.name;
