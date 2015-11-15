import template from '../template/template.html'

//add track-by 优化
export default class Schedule{
    constructor(){
        this.restrict='EA'
        this.replace=true
        this.scope={
            head:'=',
            degree:'=',
            start:'@',
            tag:'@',
            control:'='
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

        $scope.thKey=$scope.hebdomThead.map(e=>e.toLowerCase())

        $scope.hebdom={}

        var transform=(set,key)=>{

            var re  = {
                    STR:/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/,
                    DATE:/\/Date\((\d+)\)\//g,
                    TIMESTAMPT:/^\d{1,}$/
                },
                ret = {}

            key = key || 'starttime'

            set.forEach((k,i)=>{

                var time=undefined

                if(re.STR.test(k[key])){
                    time=new Date(0)
                    var info=k[key].match(re.STR)
                    time.setYear(info[1])
                    time.setMonth(info[2]-1)
                    time.setDate(info[3])
                    time.setHours(info[4])
                    time.setMinutes(info[5])
                    time.setSeconds(info[6])
                } else if (re.DATE.test(k[key])){
                    time=new Date(k[key].match(re.STR)[1])
                } else if (re.TIMESTAMPT.test(k[key])){
                    time=new Date(parseInt(k[key]))
                }

                k.$hours=time.getHours()
                k.$minutes=time.getMinutes()

                var t=k.$hours-start
                k.$idx=t
                ret[t]=k
            })

            return ret
        }

        $scope.calculateColor=(evt)=>{
            if(evt){
                var defaultCSS='#0089C5'
                if(evt.color)
                    return {'background-color':`${evt.color}`}
                else if($scope.tag)
                    return {'background-color':`${$scope.tag}`}
                else
                    return {'background-color':`${defaultCSS}`}
            }
        }

        $scope.calculateHeight=(evt)=>{
            if(evt==null)
                return

            var skew=0,height=null
            if(evt.$minutes)
                skew=evt.$minutes/60
            height=(evt.duration/60)

            return {
                height:`${height*100}%`,
                top:`${skew*100}%;`
            }
        }


        $scope.control={
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
