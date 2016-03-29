import angular from 'angular'
import uiRouter from 'angular-ui-router'
import { home, documentation } from './controller'
import * as template from './template'


import './Fermi-UI/fermi.scss'
import './Fermi-UI/Menu'
import './Fermi-UI/Progress'
import './Fermi-UI/Button'
import './Fermi-UI/Popover'
import './Fermi-UI/core'



import './css/app.scss'
import './directive/ng-highlight'
import './css/tomorrow.scss'
import './font/fonts.scss'



const body = document.body
let app = angular.module('Fermi', [
    'HighlightGrammer',
    'ui.router',
    'Fermi.menu',
    'Fermi.progress',
    'Fermi.buttons',
    'Fermi.popover',
    'Fermi.core'
])

app.controller('home', home)
app.controller('documentation', documentation)
app.run(['$rootScope', 'Fermi.Loading', '$window', ($root, Loading) => {
    $root.$on('$stateChangeStart',(e, toState) => {
        if(toState.external){
            e.preventDefault()
            window.open(toState.redirectTo, '_blank')
        } else {
            Loading.start()
        }
    })

    $root.$on('$viewContentLoaded', (e, toState) => {
        setTimeout(() => Loading.inc(.9).done(), 100)
    })
}])

app.config(['$locationProvider', $location => $location.html5Mode(true)])
app.config([
    '$stateProvider',
    '$urlRouterProvider',
    ($stateProvider, $urlRouter) => {
        $urlRouter.otherwise('/404')

        //Router::L1
        $stateProvider
            .state('home', {
                url:'/',
                template:template.home,
                controller:'home',
                controllerAs:'Home',
                onEnter:() => body.classList.add('home'),
                onExit:() => body.classList.remove('home')
            })
            .state('documentation', {
                url:'/documentation',
                controller:'documentation',
                controllerAs:'Document',
                template:template.documentation,
                onEnter:() => {
                    body.classList.add('documentation')

                },
                onExit:() => body.classList.remove('documentation')
            })
            .state('404', {
                url:'/404',
                template: template.page404,
                onEnter:() => body.classList.add('page-not-found'),
                onExit:() => body.classList.remove('page-not-found')
            })
            .state('github', {
                url:'/github',
                external: true,
                redirectTo:'https://github.com/saviio/Fermi.UI'
            })

        //Router::L2
        let {
            introduction
        } = template.level2

        $stateProvider
            .state('documentation.introduction', {
                url:'/introduction',
                template: introduction
            })
            .state('documentation.installation', {
                url:'/installation',
                template:'<div>test</div>'
            })

        $urlRouter.when('/home', '/')
        $urlRouter.when('/index', '/')
        $urlRouter.when('', '/')
    }
])
