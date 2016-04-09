let config = {
    zhCN:{
        'Go' : '跳至',
        'PleaseConfirm' : '请确认',
        'ok' : '确定',
        'dismiss' : '取消',
        'pleaseInput':'请输入',
        'page':'页'
    },
    enUS:{
        'Go' : 'Go',
        'PleaseConfirm' : 'Please Confirm',
        'ok' : 'OK',
        'dismiss' : 'Dismiss',
        'page':'Page',
        'pleaseInput':'Please input...',
    }
}

class service{
    constructor(){
        this.lang = 'zhCN'
    }

    locale(lang){
        this.lang = lang
    }

    localize(lang, option){
        config[lang] = option
    }

    transform(){
        return (key) => {
            if(key === null || key === undefined || key === '') return ''
            let pack = config[this.lang]
            if(pack === undefined){
                throw new Error('no language package supported, please the config manually via i18n.localize(lang, config).')
            }

            return pack[key]
        }
    }
}

const instance = new service()

export default instance
