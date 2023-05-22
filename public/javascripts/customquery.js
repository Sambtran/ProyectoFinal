
document.addEventListener("DOMContentLoaded",()=>{
    let valor1 = document.getElementById("valor1")
    let valor2 = document.getElementById("valor2")
    let valor3 = document.getElementById("valor3")
    $("#customquery").hide()
    $("#historial").hide()
    $("#navusuario")

    valor1.addEventListener("change",()=>{
    if(valor1.value.replaceAll(' ','')=="pais"){
        while(valor3.firstChild){
            valor3.removeChild(valor3.firstChild)
        }
        let elemento1 =  document.createElement("option")
        elemento1.setAttribute("value","mundo")
        elemento1.innerText="Mundo"
        let elemento2 =  document.createElement("option")
        elemento2.setAttribute("value","ue")
        elemento2.innerText="Union europea"
        valor3.appendChild(elemento1)
        valor3.appendChild(elemento2)
    }
    if(valor1.value.replaceAll(' ','')=="ciudad"){
        while(valor3.firstChild){
            valor3.removeChild(valor3.firstChild)
        }
        $.get("/todoslospaises").then(resultado=>{
            console.log(resultado)
            let arrayoptions=[]
            for (let x of resultado) {
               let elemento =  document.createElement("option")
                elemento.setAttribute("value",x.pais)
                elemento.innerText=x.pais
                valor3.appendChild(elemento)
            }
        })
    }
})


})