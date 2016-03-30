import './es'
import './demo'
import './markup'
import './description'
import template from './template/componentbox.html'

import './css/componentBox.scss'

class componentBox{
    constructor(){
        this.scope = {}
        this.restrict = 'EA'
        this.transclude = true
        this.replace = true
        this.template = template
    }
}

export default angular.module('ComponentBox', [
        'componentbox-es',
        'componentbox-demo',
        'componentbox-markup',
        'componentbox-description'
    ])
    .directive('componentbox', () => new componentBox())
