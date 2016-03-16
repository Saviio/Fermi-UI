import { dependencies } from '../../external/dependencies'
import template from '../template/template.html'


const reStr = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/
const reDate = /\/Date\((\d+)\)\//g
const reTimeStamp = /^\d{1,}$/


export default class Schedule{
    constructor(){
        this.restrict = 'EA'
        this.replace = true
        this.scope = {
            headers:'=?',
            period:'=?',
            start:'@',
            tag:'@',
            control:'=?',
            events:'=?'
        }
        this.transclude = true
        this.template = template
    }

    @dependencies('$scope')
    controller(scope){
        scope.headers = scope.headers || [
            'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
        ]

        scope.period = scope.period || [
            '9 am','10 am','11 am','12 pm','13 pm','14 pm','15 pm','16 pm','17 pm','18 pm','19 pm','20 pm','21 pm','22 pm'
        ]

        let start=(() =>
            scope.start == null
            ? parseInt(scope.period[0].match(/\d{1,2}/)[0])
            : scope.start
        )()

        scope.thKey = scope.headers.map(e => e.toLowerCase())
        scope.hebdom = {}

        let reColor = color => {
            let defaultCSS = '#0089C5'
            if(color) return `background-color:${color}`
            else if(scope.tag) return `background-color:${scope.tag}`
            else return `background-color:${defaultCSS}`
        }

        let reHeight = (minutes, duration) => {
            if(minutes === undefined || duration === undefined ) return ''

            let skew = 0, height = null
            if(minutes) skew = minutes/60
            height = duration/60

            return `height:${height * 100}%;top:${skew * 100}%;`
        }

        let transform = (set, key) => {
            let result = {}

            key = key || 'starttime'

            set.forEach((k, i) => {
                let time
                if(reStr.test(k[key])){
                    time = new Date(0)
                    let info = k[key].match(reStr)
                    time.setYear(info[1])
                    time.setMonth(info[2]-1)
                    time.setDate(info[3])
                    time.setHours(info[4])
                    time.setMinutes(info[5])
                    time.setSeconds(info[6])
                } else if (reDate.test(k[key])){
                    time = new Date(k[key].match(reStr)[1])
                } else if (reTimeStamp.test(k[key])){
                    time = new Date(parseInt(k[key]))
                }

                k._hours = time.getHours()
                k._minutes = time.getMinutes()

                let t = k._hours-start
                k._idx = t
                k.color = reColor(k.color)
                k.height = reHeight(k._minutes, k.duration)
                result[t] = k
            })

            return result
        }

        scope.calculateColor = evt => {
            if(evt){
                let defaultCSS = '#0089C5'
                if(evt.color) return {'background-color':`${evt.color}`}
                else if(scope.tag) return {'background-color':`${scope.tag}`}
                else return {'background-color':`${defaultCSS}`}
            }
        }

        scope.calculateHeight = evt => {
            if(evt == null) return

            let skew = 0, height = null
            if(evt._minutes) skew = evt._minutes / 60
            height = evt.duration / 60

            return {
                height:`${height * 100}%`,
                top:`${skew * 100}%;`
            }
        }


        scope.control = {
            update:function(set, key){
                for(var i in set){
                    if(set.hasOwnProperty(i)){
                        let index = scope.thKey.indexOf(i.toLowerCase())
                        if(index > -1){
                            scope.hebdom[index] = transform(set[i], key)
                        }
                    }
                }
            },
            refresh:function(set, key){
                scope.hebdom = {}
                this.update(set, key)
            }
        }

        if(scope.events != null) scope.control.refresh(scope.events)
    }
}
