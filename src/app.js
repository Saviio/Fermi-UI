import angular from 'angular'
import uiRouter from 'angular-ui-router'
import { home, documentation, level2 } from './controller'
import * as view from './view'


import 'Fermi-UI'
import 'Fermi-UI/lib/index.css'

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
    'Fermi.breadcrumb',
    'Fermi.step',
    'Fermi.tab',
    'Fermi.pagination',
    'Fermi.checkbox',
    'Fermi.radio',
    'Fermi.switch',
    'Fermi.notification',
    'Fermi.modal',
    'Fermi.select',
    'Fermi.core'
])

app.controller('home', home)
app.controller('documentation', documentation)
app.controller('button', level2.button)
app.controller('breadcrumb', level2.breadcrumb)
app.controller('step', level2.step)
app.controller('pagination', level2.pagination)
app.controller('checkbox', level2.checkbox)
app.controller('radio', level2.radio)
app.controller('notification', level2.notification)
app.controller('modal', level2.modal)
app.controller('demoModal', level2.demoModal)
app.controller('progress', level2.progress)
app.controller('select', level2.select)

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

app.config(['FMi18nProvider', i18n => i18n.locale('enUS')])
app.config(['$compileProvider', $compileProvider => $compileProvider.debugInfoEnabled(false)])
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
                onEnter:() => body.classList.add('documentation'),
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
            button,
            breadcrumb,
            menu,
            step,
            tab,
            pagination,
            checkbox,
            radio,
            switcher,
            notification,
            modal,
            popover,
            progress,
            tooltip,
            select
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
            .state('documentation.breadcrumb', {
                url:'/breadcrumb',
                template: breadcrumb,
                controller:'breadcrumb',
                controllerAs:'Breadcrumb'
            })
            .state('documentation.menu', {
                url:'/menu',
                template: menu
            })
            .state('documentation.step', {
                url:'/step',
                template:step,
                controller:'step',
                controllerAs:'Step'
            })
            .state('documentation.tab', {
                url:'/tab',
                template:tab
            })
            .state('documentation.pagination', {
                url:'/pagination',
                template:pagination,
                controller:'pagination',
                controllerAs:'Pagination'
            })
            .state('documentation.checkbox', {
                url:'/checkbox',
                template:checkbox,
                controller:'checkbox',
                controllerAs:'Checkbox'
            })
            .state('documentation.radio', {
                url:'/radio',
                template:radio,
                controller:'radio',
                controllerAs:'Radio'
            })
            .state('documentation.switch', {
                url:'/switch',
                template:switcher
            })
            .state('documentation.notification', {
                url:'/notification',
                template:notification,
                controller:'notification',
                controllerAs:'Notification'
            })
            .state('documentation.modal', {
                url:'/modal',
                template:modal,
                controller:'modal',
                controllerAs:'Modal'
            })
            .state('documentation.progress', {
                url:'/progress',
                template:progress,
                controller:'progress',
                controllerAs:'Progress'
            })
            .state('documentation.popover', {
                url:'/popover',
                template:popover
            })
            .state('documentation.tooltip', {
                url:'/tooltip',
                template:tooltip
            })
            .state('documentation.select', {
                url:'/select',
                template:select,
                controller:'select',
                controllerAs:'Select'
            })

        $urlRouter.when('/home', '/')
        $urlRouter.when('/index', '/')
        $urlRouter.when('', '/')
    }
])
