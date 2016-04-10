import notification from './service/notification'
//import './css/notification.scss'

const service = {
    namespace:'Fermi.notification',
    name:'fermiNotification',
    inject:[]
}

export default angular.module(service.namespace, service.inject)
	.service('Fermi.Notification', notification)
	.name;
