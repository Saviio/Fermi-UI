//import global
import angular from 'angular'
import './global.scss'
import './app.css'
import './Icon/iconfont.scss'

//import Fermi.components
import './Switch'
import './Schedule'
import './Tooltips'
import './Breadcrumb'
import './Progress'
import './Tab'
import './Popover'
import './Button'
import './Select'
import './Notification'


import scheduleItems from './scheduleItems.json'

var app=angular.module('app', ['Fermi.switch','Fermi.schedule','Fermi.tooltip','Fermi.breadcrumb','Fermi.progress','Fermi.tab','Fermi.popover','Fermi.buttons','Fermi.select','Fermi.notification']);

app.controller('main',['$scope','$timeout','Fermi.Loading','Fermi.Notification',function($scope,$timeout,loading, notification){

    console.info('Fermi Components were loaded.')
    $scope.test=function(item){
        console.log(item)
    };

    window.loading=loading
    window.notification = notification

    $scope.message="test"
    $scope.tmp=scheduleItems[0]

    var tmp2=scheduleItems[1]


    $timeout(function(){
        $scope.schedule.refresh(tmp2)
    },3000)

    $timeout(()=> {
        window.a=$scope.a,
        window.b=$scope.b,
        window.c=$scope.c,
        window.d=$scope.d,
        window.e=$scope.e,
        window.pop=$scope.pops
        window.selected = $scope.selected
        window.ck = $scope.ck
    },1000)


    var rec=()=>{
        if($scope.entity1>=100)
            $scope.entity1=0
        $scope.entity1+=10
        //console.log($scope.selectEntity)
        $timeout(rec,1000)
    }

    $timeout(rec,100)

    $timeout(()=>window.p=$scope.progress,1)

    loading.start()

    $scope.entity3=55
    $scope.selectEntity=null
    $scope.list=[
        { category: 'meat', name: 'Pepperoni' },
        { category: 'meat', name: 'Sausage' },
        { category: 'meat', name: 'Ground Beef' },
        { category: 'meat', name: 'Bacon' },
        { category: 'veg', name: 'Mushrooms' },
        { category: 'veg', name: 'Onion' },
        { category: 'veg', name: 'Green Pepper' },
        { category: 'veg', name: 'Green Olives' },
        { category: 'veg', name: 'Green Olives' }
    ]


    let list2 = [
        { category: 'meat', name: 'Jack' },
        { category: 'meat', name: 'Rose' },
        { category: 'meat', name: 'Heart of Occean' }
    ]

    window.ss= () => $scope.list = list2



}])
