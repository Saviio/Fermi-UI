import angular from 'angular'
import uiRouter from 'ui-router'
import { entry } from './controller'
import template from './template'

import './Fermi-UI/fermi.scss'
import './css/app.scss'

import './Fermi-UI/Menu'
import './Fermi-UI/Progress'


let app = angular.module('Fermi', [
    'ui.router',
    'Fermi.menu',
    'Fermi.progress'
])

app.run(['$rootScope','Fermi.Loading', ($root, Loading) => {
    $root.$on('$locationChangeStart', e => {
        Loading.start()
    })

    $root.$on('$viewContentLoaded', e => {
        setTimeout(() => Loading.inc(90).done(), 100)
    })
}])

app.controller('entry', entry)

app.config(['$locationProvider', $location => $location.html5Mode(true)])

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    ($stateProvider, $urlRouter) => {
        $urlRouter.otherwise('/404')


        $stateProvider
            .state('index', {
                url:'/',
                template:template.entry,
                controller:'entry',
                controllerAs:'Index'
            })
            .state('documentation', {
                url:'/documentation',
                template:template.documentation
            })

        $urlRouter.when('/index', '/')
        $urlRouter.when('', '/')
    }
])
