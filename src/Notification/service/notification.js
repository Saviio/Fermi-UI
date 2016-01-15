import { DOM, BODY } from '../../utils/browser'
import template from '../template/template.html'
import{
    onMotionEnd
} from '../../utils'

export default class Notification{
    constructor(){
        this.configuration = {
            top:'25px',
            right:'0px'
        }
    }

    send(message, type = 'success'){

    }

    config(){

    }
}
