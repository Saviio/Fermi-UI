import template from '../template/template.html'


export default class ScheduleDirective{
    constructor(){
        this.restrict='EA'
        this.replace=true
        this.scope={
            head:'=',
            degree:'=',
            start:'@',
            tag:'@',
            alias:'='
        }
        this.transclude=true
        this.template=template
        this.controller.$inject=['$scope','$attrs']
    }

    controller($scope,$attrs){
        var self=this

        $scope.hebdomThead= $scope.head || [
            'Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'
        ]

        $scope.period = $scope.degree || [
            '9 am','10 am','11 am','12 pm','13 pm','14 pm','15 pm','16 pm','17 pm','18 pm','19 pm','20 pm','21 pm','22 pm'
        ]

        var start=(() => $scope.start == null ? parseInt($scope.period[0].match(/\d{1,2}/)[0]) : $scope.start )()

        $scope.thKey=$scope.hebdomThead.map((e)=>e.toLowerCase())

        $scope.hebdom={}

        var transform=(set,key) => {
            var re=/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:(0|3)0/
            var key=key||'starttime'

            var ret={}

            set.forEach((k,i)=>{
                var
                     isGMT = re.test(k[key])
                    ,time  = (new Date(k[key]))

                if(isGMT){
                    k.$hours=time.getHours()
                    k.$minutes=time.getMinutes()
                } else {
                    k.$hours=time.getUTCHours()
                    k.$minutes=time.getUTCMinutes()
                }

                var t=k.$hours-start
                k.$scheduleIndex=t
                ret[t]=k
            })

            return ret
        }

        $scope.calculateColor=(evt)=>{
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


        $scope.calculateHeight=(evt)=>{
            if(evt==null) return

            var
                skew   = 0
               ,height = null

            if(evt.$minutes)
                skew=evt.$minutes/60
                
            height=(evt.duration/60)
            return `;height:${height*100}%;top:${skew*100}%;`
        }


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
    }
}
