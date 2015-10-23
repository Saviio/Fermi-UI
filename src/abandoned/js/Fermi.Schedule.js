;(function(angular,undefined){

    var schedule= angular.module('Fermi.schedule',['Fermi.core'])

    schedule.directive('fermiSchedule', [function(){
        return {
            restrict:'EA',
            replace:true,
            scope:{
                head:'=',
                degree:'=',
                start:'@',
                tag:'@',
                alias:'='
            },
            transclude:true,
            template:`
                <div class="schedule-container">
                    <table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout:fixed;" class="schedule-head">
                        <tbody>
                            <td style="width:60px;"></td>
                            <td ng-repeat="content in hebdomThead" class="schedule-thead">
                                {{content}}
                            </td>
                        </tbody>
                    </table>
                    <div class="schedule-wrapper">
                        <table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout:fixed;" class="schedule-main">
                            <tbody>
                                <tr height="1">
                                    <td style="width:60px;">
                                    </td>
                                    <td colspan="7">
                                        <div class="schedule-hours-wrapper">
                                            <div class="schedule-hours">
                                                <div ng-repeat="n in [] | range:period.length" class="schedule-cell"></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="width:60px">
                                        <div ng-repeat="time in period" class="schedule-time-pri">
                                            {{time}}
                                        </div>
                                    </td>
                                    <td ng-repeat="day in [] | range:hebdomThead.length" ng-init="parentIndex=$index">
                                        <div ng-repeat="evt in [] | range:period.length" class="schedule-grid">
                                            <div class="schedule-event" style={{calculateHeight(hebdom[parentIndex][$index])}} ng-if="hebdom[parentIndex] && hebdom[parentIndex][$index].title!=undefined">
                                                <div class="schedule-event-tag" style={{calculateColor(hebdom[parentIndex][$index])}} ></div>
                                                <div class="schedule-event-content">
                                                    <div>
                                                        {{ hebdom[parentIndex][$index].title }}
                                                    </div>
                                                    <div>
                                                        {{ hebdom[parentIndex][$index].comment }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `,
            controller:['$scope','$attrs',function($scope,$attrs){

                var self=this

                /*var hashCode = function(str) {
                    var hash = 0, i, chr, len;
                    if (str.length == 0) return hash;
                    for (i = 0, len = str.length; i < len; i++) {
                        chr   = str.charCodeAt(i);
                        hash  = ((hash << 5) - hash) + chr;
                        hash |= 0;
                    }

                    return hash;
                }*/

                $scope.hebdomThead= $scope.head || [
                    'Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'
                ]

                $scope.period = $scope.degree || [
                    '9 am','10 am','11 am','12 pm','13 pm','14 pm','15 pm','16 pm','17 pm','18 pm','19 pm','20 pm','21 pm','22 pm'
                ]

                var start=(function(){
                    return $scope.start == null ? parseInt($scope.period[0].match(/\d{1,2}/)[0]) : $scope.start
                })()

                $scope.thKey=$scope.hebdomThead.map((e)=>e.toLowerCase())

                $scope.hebdom={}

                var transform=function(set,key){
                    var re=/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:(0|3)0/
                    var key=key||'starttime'

                    var ret={}

                    set.forEach((k,i)=>{
                        var
                             isGMT = re.test(k[key])
                            ,time  = (new Date(k[key]))

                        if(isGMT){
                            k._hours=time.getHours()
                            k._minutes=time.getMinutes()
                        } else {
                            k._hours=time.getUTCHours()
                            k._minutes=time.getUTCMinutes()
                        }

                        var t=k._hours-start
                        k._idx=t
                        ret[t]=k
                    })

                    return ret
                }

                $scope.calculateColor=function(evt){
                    if(evt){
                        var defaultCSS='#0089C5'
                        if(evt.color)
                            return `;background-color:${evt.color};`
                        else if($scope.tag)
                            return `;background-color:${$scope.tag};`
                        else
                            return `;background-color:${defaultCSS};`
                    }
                }


                $scope.calculateHeight=function(evt){
                    if(evt==null) return

                    var skew=0,height=null
                    if(evt._minutes)
                        skew=evt._minutes/60
                    height=(evt.duration/60)
                    return `;height:${height*100}%;top:${skew*100}%;`
                }


                /*this.update=function(set,key){

                }

                this.refresh=function(set,key){
                    $scope.hebdom={}
                    self.update(set,key)
                }*/

                $scope.alias={
                    update:function(set,key){
                        for(var i in set){
                            if(set.hasOwnProperty(i)){
                                var index=$scope.thKey.indexOf(i.toLowerCase())
                                if(index>-1)
                                    $scope.hebdom[index]=transform(set[i],key)
                            }
                        }
                    },
                    refresh:function(set,key){
                        $scope.hebdom={}
                        this.update(set,key)
                    }
                }

            }]
        }
    }])

})(angular)
