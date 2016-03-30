import angular from 'angular'
import uiRouter from 'angular-ui-router'
import { home, documentation, level2 } from './controller'
import * as view from './view'


import './Fermi-UI/fermi.scss'
import './Fermi-UI/Menu'
import './Fermi-UI/Progress'
import './Fermi-UI/Button'
import './Fermi-UI/Popover'
import './Fermi-UI/tooltips'
import './Fermi-UI/core'



import './css/app.scss'
import './directive/ng-highlight'
import './directive/ng-escape'
import './directive/componentbox'
import './css/tomorrow.scss'
import './font/fonts.scss'



const body = document.body
let app = angular.module('Fermi', [
    'HighlightGrammer',
    'ComponentBox',
    'EscapeHTML',
    'ui.router',
    'Fermi.menu',
    'Fermi.progress',
    'Fermi.buttons',
    'Fermi.popover',
    'Fermi.tooltip',
    'Fermi.core'
])

app.controller('home', home)
app.controller('documentation', documentation)
app.controller('button', level2.button)
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
                template:view.home,
                controller:'home',
                controllerAs:'Home',
                onEnter:() => body.classList.add('home'),
                onExit:() => body.classList.remove('home')
            })
            .state('documentation', {
                url:'/documentation',
                controller:'documentation',
                controllerAs:'Document',
                template:view.documentation,
                onEnter:() => {
                    body.classList.add('documentation')

                },
                onExit:() => body.classList.remove('documentation')
            })
            .state('404', {
                url:'/404',
                template: view.page404,
                onEnter:() => body.classList.add('page-not-found'),
                onExit:() => body.classList.remove('page-not-found')
            })
            .state('github', {
                url:'/github',
                external: true,
                redirectTo:'https://github.com/saviio/Fermi.UI'
            })
            .state('antd', {
                url:'/antd',
                external: true,
                redirectTo:'http://ant.design/'
            })

        //Router::L2
        let {
            introduction,
            button
        } = view.level2


        $stateProvider
            .state('documentation.introduction', {
                url:'/introduction',
                template: introduction
            })
            .state('documentation.button', {
                url:'/button',
                template: button,
                controller:'button',
                controllerAs:'Button'
            })

        $urlRouter.when('/home', '/')
        $urlRouter.when('/index', '/')
        $urlRouter.when('', '/')
    }
])
