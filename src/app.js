//import global
import angular from 'angular'
import './global.scss'
import './app.css'


//import Fermi.components
import './Switch/index.js'
import './Schedule/index.js'
import './Tooltips/index.js'
import './Breadcrumb/index.js'
import './Progress/index.js'
import './Tab/index.js'
import './Popover/index.js'
import './Button/index.js'


import scheduleItems from './scheduleItems.json'

var app=angular.module('app', ['Fermi.switch','Fermi.schedule','Fermi.tooltip','Fermi.breadcrumb','Fermi.progress','Fermi.tab','Fermi.popover','Fermi.buttons']);

app.controller('main',['$scope','$timeout',function($scope,$timeout){

    console.info('Fermi Components were loaded.')
    $scope.test=function(item){
        console.log(item)
    };

    $scope.message="test"
    $scope.tmp=scheduleItems[0]

    var tmp2=scheduleItems[1]


    $timeout(function(){
        //$scope.schedule.refresh(tmp2)
    },3000)

    $timeout(()=> {window.a=$scope.a,window.b=$scope.b,window.c=$scope.c,window.d=$scope.d,window.e=$scope.e},1000)


    var rec=()=>{
        window.f=$scope.entity2
        if($scope.entity1>100)
            $scope.entity1=-1
        else
            $timeout(rec,2000)
        $scope.entity1+=10
    }

    $timeout(rec,2000)

    $timeout(()=>window.p=$scope.progress,1)



}])
