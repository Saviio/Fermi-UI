//import global
import angular from 'angular'
import './fermi.scss'

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
import './Step'
import './Pagination'
import './Menu'
import './Modal'

//import mock data
import scheduleItems from './scheduleItems.json'

var app=angular.module('app', [
    'Fermi.switch',
    'Fermi.schedule',
    'Fermi.tooltip',
    'Fermi.breadcrumb',
    'Fermi.tab',
    'Fermi.popover',
    'Fermi.buttons',
    'Fermi.select',
    'Fermi.progress',
    'Fermi.notification',
    'Fermi.step',
    'Fermi.pagination',
    'Fermi.menu',
    'Fermi.modal'
])

app.controller(
    'main',['$scope','$timeout','Fermi.Loading','Fermi.Notification','Fermi.Modal',
        function($scope,$timeout,loading, notification, modal){

        console.info('Fermi Components were loaded.')
        $scope.test=function(item){
            console.log(item)
        }

        //window.loading=loading
        window.notification = notification
        $scope.notification = notification

        $scope.message="test"
        $scope.tmp=scheduleItems[0]

        var tmp2=scheduleItems[1]


        $timeout(function(){
            //$scope.schedule.refresh(tmp2)
        },3000)

        $scope.createModal = () => {
            return modal.open({
                template:'#modalTemplate',
                scope:$scope,
                name:'TEST Modal'
            })
        }

        $scope.normalModal = () => modal.normal({
            content:'Normal Modal~~~',
            width:200
        })

        $scope.confirmModal = () => {
            let modalIns = modal.confirm({
                content:'Confirm Modal~~~',
                width:300
            })
            console.log(modalIns)

            modalIns.ok.then(() => {
                modal.normal({
                    content:'Normal Modal No.2',
                    width:240
                })
                throw new Error('error')
            })
            .catch(() => {
                console.log('Error!')
            })

            modalIns.dismiss.then(() => {
                console.log('dismiss')
            })
        }

        $timeout(()=> {
            window.a=$scope.a,
            window.b=$scope.b,
            window.c=$scope.c,
            window.d=$scope.d,
            window.e=$scope.e,
            window.pop=$scope.pops
            window.selected = $scope.selected
            window.ck = $scope.ck
            window.modal = $scope.createModal
            window.modalControl = modal
            window.asyncModal = () => {
                return modal.confirm({
                    content:'<p>123</p>',
                    plain:true,
                    onCancel:() => {
                        return new Promise((res,rej) => setTimeout(() => res(),1000))
                    }
                })
            }

            window.asyncModal2 = () => {
                return modal.normal({
                    content:'lolololo',
                    width:150
                })
            }

        },1000)

        $scope.$on('checked', data => {
            console.log('ROOT')
        })


        var rec=()=>{
            if($scope.entity1>=100)
                $scope.entity1=0
            $scope.entity1+=10
            $scope.message += 1
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

        $scope.notificationOption ={
            topic:'Callback Test',
            message:'After notification is removed, please check the output in Console.',
            type:'normal',
            callback:function(){
                console.info('callback was executed.')
            }
        }

        window.s=function(){
            document.body.innerHTML=null
            $scope.$destroy()
            //console.log(app)
        }

        window.ss= () => $scope.list = list2
        $timeout(function () {
            window.steps = $scope.steps
        }, 10);

        $scope.output = item => console.log(item)
}])
