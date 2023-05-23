
document.addEventListener("DOMContentLoaded",()=>{
    let sentencia = document.getElementById("sentencia")
    let valor1 = document.getElementById("valor1")
    let valor2 = document.getElementById("valor2")
    let valor3 = document.getElementById("valor3")
    let ejecutar = document.getElementById("ejecutar")
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
        if(valor1.value.replaceAll(' ','')=="os"){
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
    valor3.addEventListener("change",()=>{
        if(valor1.value.replaceAll(' ','')=="os"){
            $.post("/regiondepais",{pais:valor3.value.replaceAll(' ','')}).then(resultado=>{
                if(resultado.length>0){
                    let nuevo = document.createElement("select")
                    let blanco = document.createElement("option")
                    blanco.setAttribute("val",' ')
                    blanco.innerText=" "
                    nuevo.appendChild(blanco)
                    for (let region of resultado) {
                        let regionc = region.region
                        let selecteable = document.createElement("option")
                        selecteable.setAttribute("value",regionc)
                        selecteable.innerText=regionc
                        nuevo.appendChild(selecteable)
                    }
                    nuevo.setAttribute("id","soreg")
                    try {
                        $("#soreg").remove()
                    }catch (error){}
                    sentencia.appendChild(nuevo)
                }})}
        })

    ejecutar.addEventListener("click",()=>{
        let valores = []
        let palabras = sentencia.childNodes
        for (const palabra of palabras) {
            valores.push(palabra.value.replaceAll(' ',''))
        }
        $.get("/customquery",{toke:token,valores:valores}).then(res=>{

        })
    })




})
