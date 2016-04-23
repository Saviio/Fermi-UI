export const reElemLabel = /(fermi)\:(\w*[^\s])/ig
export const reChildElem = /\>(\B)\</

export function capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export function removeClass(el, cls){
    let clsList = cls.split(' ')
    while(cls = clsList.pop()){
        if (el.classList) {
            el.classList.remove(cls)
        } else {
            let cur = ' ' + (el.getAttribute('class') || '') + ' '
            let tar = ' ' + cls + ' '
            while (cur.indexOf(tar) >= 0) {
                cur = cur.replace(tar, ' ')
            }
            el.setAttribute('class', cur.trim())
        }

        if (!el.className) {
            el.removeAttribute('class')
        }
    }
    return el
}

export function escape(str){
    return str.replace(/&/g,"&amp;")
            .replace(/</g,"&lt;")
            .replace(/>/g,"&gt;")
            .replace(/"/g,"&#34;")
            .replace(/'/g,"&#39;")
}

export function transform(html){
    return html.replace(reElemLabel, ($0, $1, $2) => `${capitalize($1)}:${capitalize($2)}`)
}
