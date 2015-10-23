

export default class SwitchDirective {
    constructor(){
        this.restrict='EA'
        this.replace=true
        this.require='^ngModel'
        this.scope={
            ngModel:'=',
            label:'@'
        }
        this.transclude=true
        this.template=`
            <div class="switch">
                <label for={{label+"_switcher"}}>
                <input type="checkbox" ng-model="ngModel" ng-attr-name={{label+"_switcher"}}></input>
                <span ng-click=";ngModel=!ngModel"></span>
                </label>
            </div>
        `
    }
}
