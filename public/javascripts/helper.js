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
export function  mostrarnav(nav){
    const body = document.getElementsByTagName("main")[0]
    $(nav).fadeIn("slow")
    console.log(body)
    body.style.height="97%"
    setTimeout(()=>{
        nav.style.position="relative"
    },450)
}
export function esnodelist(nodes){
    NodeList.prototype.isPrototypeOf(nodes)

}