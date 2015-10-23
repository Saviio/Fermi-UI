
export default function(){
    var getCoords = function(elem){
        var box = elem.getBoundingClientRect(),
        self= window,
        doc = elem.ownerDocument,
        body = doc.body,
        html = doc.documentElement,
        clientTop = html.clientTop || body.clientTop || 0,
        clientLeft = html.clientLeft || body.clientLeft || 0
        return { top: (box.top + (self.pageYOffset || html.scrollTop || body.scrollTop ) - clientTop), left: (box.left + (self.pageXOffset || html.scrollLeft || body.scrollLeft) - clientLeft) };
    }

    function getStyle(elem, name) {
        var style=window.getComputedStyle ? window.getComputedStyle(elem, null)[name] : elem.currentStyle[name]

        if( (name==='width' || name==='height') && style==='auto'){
            if(name=='width')
                style=elem.offsetWidth
            else if(name=='height')
                style=elem.offsetHeight
        }
        return style
    }

    return {
        coords:getCoords,
        style:getStyle
    }
}
