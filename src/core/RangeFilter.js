
export default function(){
    return (input, total) => {
        for (var i = 0, total = parseInt(total); i<total; i++)
            input.push(i)
        return input
    }
}
