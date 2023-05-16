import * as helper from "./helper.js";
import {mostrarnav} from "./helper.js";
document.addEventListener("DOMContentLoaded",()=>{
$("#loged").hide();
$("#tiposdegrafico").hide()
let section1 = document.getElementById("seccion1")
    const body = document.getElementsByTagName("main")[0]
const nav = document.getElementsByTagName("nav")[0]
    var login = document.getElementById("login")
    let loginanonimo = document.getElementById("loginanonimo")
    function invocation(){
        //Cookies.remove("user_id")
       // Cookies.remove("cookiesaccepted")
        console.log(Cookies.get("user_id")+"  "+Cookies.get("cookiesaccepted"))
        if(true){
            fetch('https://api.ipify.org/').then(
                r => r.text()
            ).then((ip)=>{
                let os = navigator.appVersion
                os = os.split('(')
                os=os[1].split(')')
                os=os[0].split(';')
                let osVersion = os[0].split('NT')
                let osname = osVersion[0]
                osVersion = osVersion[1]
                let data={
                    ip:ip,
                    osName:osname,
                    osVersion:osVersion,
                    osBits:os[2]
                }
                console.log(ip)
                $.ajax({
                    type: "POST",
                    url: "/georecogida",
                    data: data,
                    success: "succes",
                });


            });
        }else{
            alert("Sin cookies no va")
        }
        if(Cookies.get("user_id")!=undefined){
            body.style.gridTemplateColumns="0fr 0fr 1fr 0fr"
            $(".page").hide()
            cargarusuario()
            $("#loged").show()
            mostrarnav(nav,body)
            $("#tiposdegrafico").fadeIn("slow")




        }else{
            loginanonimo.addEventListener("click",async () => {
                body.style.gridTemplateColumns = "0fr 0fr 1fr 0fr"
                $("#contenido").show()
                $("#loginconuser").fadeOut("slow")
                $("#loginanonimo").fadeOut("slow")
                setTimeout(()=>{
                    mostrarnav(nav,body)
                },400)
                $("#loged").hide()
                $.get( "/datosgraficos" ).done(resultado=>{
                    console.log(resultado)
                    let datosgraficos = resultado
                    let labels = []
                    let datainfo = []
                    let total = 0
                    for (let dato of datosgraficos) {
                        total += parseInt(dato.count)
                    }
                    for (let dato of datosgraficos) {
                        datainfo.push(parseInt(parseInt(dato.count)*100/total))
                    }
                    for (let dato of datosgraficos) {
                        labels.push(dato.pais)
                    }
                    console.log(datosgraficos)
                    const ctx = $("#lienzo1")
                    const data = {
                        labels:labels,
                        datasets: [{
                            label: ["Pais"],
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
                $.get( "/datosSO" ).done(resultado=>{
                    console.log(resultado)
                    let datosgraficos = resultado
                    let labels = []
                    let datainfo = []
                    let total = 0
                    for (let dato of datosgraficos) {
                        total += parseInt(dato.count)
                    }
                    for (let dato of datosgraficos) {
                        datainfo.push(parseInt(parseInt(dato.count)*100/total))
                    }
                    for (let dato of datosgraficos) {
                        labels.push(dato.osName)
                    }
                    console.log(datosgraficos)
                    const ctx = $("#lienzo2")
                    const data = {
                        labels:labels,
                        datasets: [{
                            label: ["OS"],
                            data: datainfo,
                            backgroundColor: [
                                'rgb(123,147,250)',
                                'rgb(252,105,105)',
                                'rgb(108,108,108)'
                            ],
                            hoverOffset: 4
                        }]
                    };
                    new Chart(ctx, {
                        type: 'doughnut',
                        data: data,
                    });

                })
            })
            $("#loginconuser").bind("click touchstart",(ev)=>{
                $("#loginconuser").fadeOut("slow")
                $("#loginanonimo").fadeOut("slow")
                setTimeout(()=>{
                },400)
                $("#loged").show()
                body.style.gridTemplateColumns="0fr 0fr 1fr 0fr"
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
                    console.log(result)
                    if(result!=false){
                        if(result.id!=false){
                            if($("#recordar").is(":checked")){
                                Cookies.set('user_id',result.id,{expires:7})
                            }
                            $(".page").hide()
                            mostrarnav(nav,body)
                        }
                             cargarusuario()}
                            $("#loged").show()
                            $("#tiposdegrafico").fadeIn("slow")
                })
            })
        }
    }
$("#contenido").hide()
$(nav).hide()
    console.log(Cookies.get("cookiesaccepted"))
    if(Cookies.get("cookiesaccepted")=='true'){
        $("#cookies").hide()
        invocation()
    }else{
    $(".buttonx").bind("click",()=>{
        Cookies.set("cookiesaccepted",true,{expires:7})
        invocation()
        $("#cookies").hide()
  })}
})

function cargarusuario(token){
    $.get( "/datosSO" ).done(resultado=>{
        console.log(resultado)
        let datosgraficos = resultado
        let labels = []
        let datainfo = []
        let total = 0
        for (let dato of datosgraficos) {
            total += parseInt(dato.count)
        }
        for (let dato of datosgraficos) {
            datainfo.push(parseInt(parseInt(dato.count)*100/total))
        }
        for (let dato of datosgraficos) {
            labels.push(dato.osName)
        }
        console.log(datosgraficos)
        const ctx = $("#lienzoOS1")
        const data = {
            labels:labels,
            datasets: [{
                label: ["OS"],
                data: datainfo,
                backgroundColor: [
                    'rgb(123,147,250)',
                    'rgb(252,105,105)',
                    'rgb(108,108,108)'
                ],
                hoverOffset: 4
            }]
        };
        new Chart(ctx, {
            type: 'doughnut',
            data: data,
        });

    })
    $.get( "/datosSO" ).done(resultado=>{
        console.log(resultado)
        let datosgraficos = resultado
        let labels = []
        let datainfo = []
        let total = 0
        for (let dato of datosgraficos) {
            total += parseInt(dato.count)
        }
        for (let dato of datosgraficos) {
            datainfo.push(parseInt(parseInt(dato.count)*100/total))
        }
        for (let dato of datosgraficos) {
            labels.push(dato.osName)
        }
        console.log(datosgraficos)
        const ctx = $("#lienzoOS2")
        const data = {
            labels:labels,
            datasets: [{
                label: ["OS"],
                data: datainfo,
                backgroundColor: [
                    'rgb(123,147,250)',
                    'rgb(252,105,105)',
                    'rgb(108,108,108)'
                ],
                hoverOffset: 4
            }]
        };
        new Chart(ctx, {
            type: 'doughnut',
            data: data,
        });

    })
}

