import angular from 'angular'
import uiRouter from 'angular-ui-router'
import { home } from './controller'
import template from './template'

import './Fermi-UI/fermi.scss'
import './css/app.scss'
import './font/fonts.scss'

import './Fermi-UI/Menu'
import './Fermi-UI/Progress'
import './Fermi-UI/Button'


let app = angular.module('Fermi', [
    'ui.router',
    'Fermi.menu',
    'Fermi.progress',
    'Fermi.buttons'
])

app.run(['$rootScope', 'Fermi.Loading', '$window', ($root, Loading) => {

    $root.$on('$stateChangeStart',(e, toState) => {
        if(toState.external){
            e.preventDefault()
            window.open(toState.redirectTo, '_blank')
        } else {
            Loading.start()
        }
    })

    $root.$on('$viewContentLoaded', e => {
        setTimeout(() => Loading.inc(90).done(), 100)
    })
}])

app.controller('home', home)

app.config(['$locationProvider', $location => $location.html5Mode(true)])

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    ($stateProvider, $urlRouter) => {
        $urlRouter.otherwise('/404')

        $stateProvider
            .state('home', {
                url:'/',
                template:template.home,
                controller:'home',
                controllerAs:'Home'
            })
            .state('documentation', {
                url:'/documentation',
                template:template.documentation
            })
            .state('404', {
                url:'/404',
                template:template.page404
            })
            .state('github', {
                url:'/github',
                external: true,
                redirectTo:'https://github.com/saviio/Fermi.UI'
            })

        $urlRouter.when('/home', '/')
        $urlRouter.when('', '/')
    }
])
