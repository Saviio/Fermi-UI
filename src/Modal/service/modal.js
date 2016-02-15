import { dependencies } from '../../external/dependencies'
import template from '../template/template.html'
import { DOM as dom } from '../utils/browser'
import {
    query
} from '../utils'
/*

API:

.open(options) => Number

options ::= {
    template: String | dom<class|Id>,
    className: String,
    scope: AngularScope,
    hooks:{
        onOpen: Function,
        onClose: Function
    }
}

.closeAll
.close(id)

id ::= Number

private:
  hasOverlay => boolean


*/

const overlayId = '__modalOverlay__'

let hasOverlay = () => dom::query(`#${overlayId}`) === null
let openedModals = []

export default class Modal{
    constructor(){

    }
}
