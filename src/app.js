import angular from 'angular';

import './Switch/index.js'
import './Schedule/index.js'
import './Tooltips/index.js'
import './Breadcrumb/index.js'
import './Progress/index.js'
import './Tab/index.js'

import './global.scss'
import './app.css'


var app=angular.module('app', ['Fermi.switch','Fermi.schedule','Fermi.tooltip','Fermi.breadcrumb','Fermi.progress','Fermi.Tab']);

app.controller('main',['$scope','$timeout',function($scope,$timeout){

    console.info('Fermi Components were loaded.')
    $scope.test=function(item){
        console.log(item)
    };


    var tmp={
        Monday:[ {title:'IELTS',duration:120,comment:'Duration:120 Mins',starttime:'2015-07-24T13:00:00'} ],
        Saturday:[ {title:'IELTS',duration:180,comment:'Duration:120 Mins',starttime:'2015-07-24T12:30:00'} ],
        Thursday:[ {title:'English Fit',duration:60,comment:'Duration:60 Mins',starttime:'2015-07-24T10:15:00'} ],
        Friday:[ {title:'IELTS',duration:180,comment:'Duration:120 Mins',starttime:'2015-07-24T15:00:00'} ]
    }

    var tmp2={
        monday:[ {title:'IELTS',duration:120,comment:'Duration:120 Mins',starttime:'2015-07-24T14:00:00'},{title:'IELTS',duration:120,comment:'Duration:120 Mins',starttime:'2015-07-24T10:15:00'},{title:'IELTS',duration:120,comment:'Duration:120 Mins',starttime:'2015-07-24T17:30:00'} ],
        Saturday:[ {title:'IELTS',duration:180,comment:'Duration:120 Mins',starttime:'2015-07-24T11:30:00'},{title:'English Fit',duration:60,comment:'Duration:120 Mins',starttime:'2015-07-24T15:30:00'},{title:'IELTS',duration:120,comment:'Duration:120 Mins',starttime:'2015-07-24T17:45:00'} ],
        Thursday:[ {title:'English Fit',duration:60,comment:'Duration:60 Mins',starttime:'2015-07-24T11:15:00'},{title:'IELTS',duration:60,comment:'Duration:120 Mins',starttime:'2015-07-24T18:45:00'},{title:'IELTS',duration:180,comment:'Duration:120 Mins',starttime:'2015-07-24T18:00:00'} ],
        Friday:[ {title:'IELTS',duration:180,comment:'Duration:120 Mins',starttime:'2015-07-24T14:00:00'} ],
        Wednesday:[{title:'TOF',duration:120,comment:'Duration:60 Mins',starttime:'2015-07-24T17:00:00'},{title:'IELTS',duration:120,comment:'Duration:120 Mins',starttime:'2015-07-24T09:05:00'}]
    }

    $timeout(function(){
        $scope.events.update(tmp)
    },1000)

    $timeout(function(){
        $scope.events.refresh(tmp2)
    },3000)


    var rec=()=>{
        if($scope.entity1>=100)
            $scope.entity1=-1
        $scope.entity1+=1
        $timeout(rec,100)
    }

    $timeout(rec,1000)
}])
