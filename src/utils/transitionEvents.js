import { WIN } from './browser'

const isWebkitTrans = WIN.ontransitionend === undefined && WIN.onwebkittransitionend !== undefined
const isWebkitAnim = WIN.onanimationend === undefined && WIN.onwebkitanimationend !== undefined

let transitionProp = isWebkitTrans ? 'WebkitTransition' : 'transition'
let transitionEndEvent = isWebkitTrans ? 'webkitTransitionEnd' : 'transitionend'
let animationProp = isWebkitAnim ? 'WebkitAnimation' : 'animation'
let animationEndEvent = isWebkitAnim ? 'webkitAnimationEnd' : 'animationend'


export {
    transitionProp,
    transitionEndEvent,
    animationProp,
    animationEndEvent
}
