import * as helper from "./helper.js";
let section1 = document.getElementById("seccion1")
    const body = document.getElementsByTagName("body")[0]
    var login = document.getElementById("login")
    let loginanonimo = document.getElementById("loginanonimo")
$("#contenido").hide()
Cookies.remove("user_id")
if(true){
    fetch('https://api.ipify.org/').then(
        r => r.text()
    ).then((ip)=>{
        console.log(ip)
        $.ajax({
            type: "POST",
            url: "/georecogida",
            data: {ip:ip},
            success: "succes",
        });
    });

}else{
    alert("Sin cookies no va")
}
if(Cookies.get("user_id")!=undefined){
    body.style.gridTemplateColumns="0fr 0fr 0fr 1fr"
    $(".page").hide()


}else{
    loginanonimo.addEventListener("click",async () => {
        $("#contenido").show()
        body.style.gridTemplateColumns = "0fr 0fr 1fr 0fr"
        $.get( "/datosgraficos" ).done(resultado=>{
            console.log(resultado)
            let datosgraficos = resultado
            let labels = []
            let datainfo = []
            for (let dato of datosgraficos) {
                labels.push(dato.pais)
                datainfo.push(dato.count)
            }
            console.log(datosgraficos)
            const ctx = $("#lienzo1")
            const data = {
                labels:labels,
                datasets: [{
                    label: ["Sistema operativo"],
                    data: datainfo,
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)'
                    ],
                    hoverOffset: 4
                }]
            };
            const config = {
                type: 'doughnut',
                data: data,
            };
            new Chart(ctx, {
                type: 'doughnut',
                data: data,
            });

        })
    })
    $("#loginconuser").bind("click touchstart",(ev)=>{
        $("#loged").show()
        body.style.gridTemplateColumns="0fr 0fr 0fr 1fr"
        $("#loged").style=" background: white;\n" +
            "    font-family: 'Inter UI', sans-serif;\n" +
            "    margin: 0;\n" +
            "    padding: 20px;"
    })

    $("#submit").bind("click touchstart",()=>{
        let user = $("#nickname").val()
        let password =   $("#password").val()
         $.ajax({
            type: "POST",
            url: "/login",
            data: {user:user,
                   password:password},
            success: "succes",
        }).then(result=>{
             if(result!=false){
                 if($("#recordar").is(":checked")){
                    Cookies.set('user_id',result.id,{expires:7})
                 }
                 $(".page").hide()
             }
       })
    })
}




