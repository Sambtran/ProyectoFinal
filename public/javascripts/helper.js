export function getclass(div,clase){
    try {


    let texto = div.getAttribute("class")
    texto = texto.split(" ")
    for (const string of texto) {
        if(string===clase){
            return true
        }
    }
    return false
}catch (exception){
        return false
    }}
export  function tieneid(div,id){
    if(div.getAttribute("id")===id){
        return true
    }else{
        false
    }
}