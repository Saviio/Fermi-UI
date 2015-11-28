//import global
import angular from 'angular'
import './global.scss'
import './app.css'


//import Fermi.components
import './Switch'
import './Schedule'
import './Tooltips'
import './Breadcrumb'
import './Progress'
import './Tab'
import './Popover'
import './Button'


import scheduleItems from './scheduleItems.json'

var app=angular.module('app', ['Fermi.switch','Fermi.schedule','Fermi.tooltip','Fermi.breadcrumb','Fermi.progress','Fermi.tab','Fermi.popover','Fermi.buttons']);

app.controller('main',['$scope','$timeout','Fermi.Loading',function($scope,$timeout,loading){

    console.info('Fermi Components were loaded.')
    $scope.test=function(item){
        console.log(item)
    };

    window.loading=loading

    $scope.message="test"
    $scope.tmp=scheduleItems[0]

    var tmp2=scheduleItems[1]


    $timeout(function(){
        $scope.schedule.refresh(tmp2)
    },3000)

    $timeout(()=> {window.a=$scope.a,window.b=$scope.b,window.c=$scope.c,window.d=$scope.d,window.e=$scope.e},1000)


    var rec=()=>{
        if($scope.entity1>=100)
            $scope.entity1=0
        $scope.entity1+=10
        $timeout(rec,1000)
    }

    $timeout(rec,100)

    $timeout(()=>window.p=$scope.progress,1)

    loading.start()

    $scope.entity3=55


}])
