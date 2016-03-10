//import global
import angular from 'angular'
import './fermi.scss'

//import Fermi.components
import './Core'
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
import './Checkbox'
import './Radio'


//import mock data
import scheduleItems from './scheduleItems.json'

var app = angular.module('app', [
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
    'Fermi.modal',
    'Fermi.checkbox',
    'Fermi.radio'
])

app.controller(
    'main',['$scope','$timeout','Fermi.Loading','Fermi.Notification','Fermi.Modal',
        function($scope, $timeout, loading, notification, modal){

        console.info('Fermi Components were loaded.')
        $scope.test=function(item){
            console.log(item)
        }

        window.loading = loading
        window.notification = notification
        $scope.notification = notification

        $scope.message="test"
        $scope.tmp=scheduleItems[0]
        $scope.checkbox
        $scope.radio = {}
        $scope.z

        var tmp2=scheduleItems[1]
        $scope.checkboxOnChange = v => console.log(v)

        $timeout(function(){
            $scope.schedule.refresh(tmp2)
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
            //console.log(modalIns)
            modalIns.prevent = true
            modalIns.ok.then((ok, dismiss) => {
                ok.loading()
                return new Promise(res => {
                    setTimeout(() => {
                        modal.normal({
                            content:'Another Modal No.3',
                            width:240
                        })
                        res()
                    }, 3000)
                }).then(() => {
                    ok.done()
                    modalIns.close()
                })
                /*modal.normal({
                    content:'Another Modal No.3',
                    width:240
                })*/
            })
            .catch(e => {
                console.log(e)
            })

            modalIns.dismiss.then((ok, dismiss) => {
                console.log('dismiss')
                modalIns.close()
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
            window.query = $scope.entity2
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

            window.ctrlModal = () => {
                return modal.open({
                    template:'#modalTemplate2',
                    scope:$scope,
                    name:'TEST Modal',
                    controller:'test',
                    controllerAs:'check'
                })
            }

            window.checkbox = $scope.checkbox
            window.radio = $scope.radio

        },1000)

        $scope.$on('checked', data => {
            console.log('ROOT')
        })

        //$scope.entity1 = 0
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

        $scope.entity3 = 45
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
        setTimeout(() => {
            var root = angular.element(document.getElementsByTagName('body'))
            var watchers = []

            var f = element => {
                angular.forEach(['$scope', '$isolateScope'], scopeProperty => {
                    if (element.data() && element.data().hasOwnProperty(scopeProperty)) {
                        angular.forEach(element.data()[scopeProperty].$$watchers,  watcher => watchers.push(watcher))
                    }
                })

                angular.forEach(element.children(), childElement => f(angular.element(childElement)))
            }

            f(root)

            console.log("total watchers: " + (new Set(watchers)).size)
        }, 1)

}])

app.controller('test', [function(){
    this.a = 'ControllerAs Modal Test'
}])


app.controller('secondCtrl', ['$timeout', function($timeout){
    this.radio1 = {}
    this.radio2 = {}
    this.radio3 = {}

    this.group = {}

    this.testFn = value => {
        console.log('Group output: ' + value)
    }

    this.testFn2 = value => {
        console.log('Single Radio output: ' + value)
    }

    $timeout(() => {
        window.rradio = [this.radio1, this.radio2, this.radio3]
        window.radioGroup = this.group
    }, 10);
}])
