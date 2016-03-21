import angular from 'angular'
import uiRouter from 'ui-router'
import { entry } from './controller'
import template from './template'
import './css/app.scss'

let app = angular.module('Fermi', [
    'ui.router'
])

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouter){
        $urlRouter.otherwise('/notFound')

        $stateProvider
            .state('index', {
                url:'',
                template:template.entry,
                controller:entry,
                controllerAs:'entry'
            })
            .state('design', {
                url:'/design',
                template:template.design
            })
            .state('components', {
                url:'/components',
                template:template.components
            })

        $urlRouter.when('/index', '')
    }
])
