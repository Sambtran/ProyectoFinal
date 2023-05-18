import * as helper from "./helper.js";
import {mostrarnav} from "./helper.js";
var token
document.addEventListener("DOMContentLoaded",()=>{
$("#loged").hide();
$("#tiposdegrafico").hide()
let section1 = document.getElementById("seccion1")
    const body = document.getElementsByTagName("main")[0]
const nav = document.getElementsByTagName("nav")[0]
    var login = document.getElementById("login")
    let loginanonimo = document.getElementById("loginanonimo")
    function invocation(){
       // Cookies.remove("user_id")
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
            cargarusuario(Cookies.get("user_id"))
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
                            $.post( "/ponerenactivo",{id:result.id} )
                            cargarusuario(result.id)}
                        $("#loged").show()
                        $("#tiposdegrafico").fadeIn("slow")
                        token = result.id
                        }

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
var arraylienzos = []
var seguro = 0
function cargarusuario(token,tipo){
    let lienzos = document.getElementsByClassName("lienzoOS")
    let geos = document.getElementsByClassName("lienzoGEO")

    let tiposfraficos = document.getElementsByClassName("tiposdegrafico")
    let i = 0
    if(seguro!=0){
        for (let lenzillo of arraylienzos) {
            lenzillo.destroy()
        }
    }
    seguro++
    for (const tiposfrafico of tiposfraficos) {
        console.log(tiposfrafico)
        if(i==0){
            $(tiposfrafico).unbind()
            $(tiposfrafico).bind("click",()=>{
                cargarusuario(token,"bar")
            })
        }
        if(i==1){
            $(tiposfrafico).unbind()
            $(tiposfrafico).bind("click",()=>{
                cargarusuario(token,"doughnut")
            })
        }if(i==2){
            $(tiposfrafico).unbind()
            $(tiposfrafico).bind("click",()=>{
                cargarusuario(token,"polarArea")
            })
        }
        i++
    }
    if(tipo==undefined||tipo==null){
        tipo="doughnut"
    }
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
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(101,255,83)',
                    'rgba(39,40,44,0.39)',
                    'rgb(0,255,177)',
                    'rgb(135,148,77)',
                ],
                hoverOffset: 4
            }]
        };
      let lienzo1OS =  new Chart(ctx, {
            type: tipo,
            data: data,
          options:{
              plugins: {
                  title: {
                      display: true,
                      text: 'SO mas comunes'
                  }
              }}
        });
        arraylienzos.push(lienzo1OS)
    })
    $.post( "/datosOSversion",{token:token} ).done(resultado=>{
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
            labels.push(dato.osVersion)
        }
        console.log(datosgraficos)
        const ctx = $("#lienzoOS2")
        const data = {
            labels:labels,
            datasets: [{
                label: ["OS"],
                data: datainfo,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(101,255,83)',
                    'rgba(39,40,44,0.39)',
                    'rgb(0,255,177)',
                    'rgb(135,148,77)',
                ],
                hoverOffset: 4
            }]
        };
        let lienzo2OS =  new Chart(ctx, {
            type: tipo,
            data: data,
            options:{
                plugins: {
                    title: {
                        display: true,
                        text: 'Versiones de windows en %'
                    }
                }}
        });
        arraylienzos.push(lienzo2OS)
        //GEO

    })
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
        const ctx = $("#lienzeogeo1")
        const data = {
            labels:labels,
            datasets: [{
                label: ["Pais"],
                data: datainfo,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(101,255,83)',
                    'rgba(39,40,44,0.39)',
                    'rgb(0,255,177)',
                    'rgb(135,148,77)',
                ],
                hoverOffset: 4
            }]
        };
        const config = {
            type: 'doughnut',
            data: data,
        };
        let lienzo1geo=new Chart(ctx, {
            type: tipo,
            data: data,
            options:{
                plugins: {
                    title: {
                        display: true,
                        text: 'Paises mas comunes en %'
                    }
                }}
        });
        arraylienzos.push(lienzo1geo)

    })

    $.post( "/paisesdeUE",{token:token} ).done(resultado=>{
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
        const ctx = $("#lienzeogeo2")
        const data = {
            labels:labels,
            datasets: [{
                label: ["Pais"],
                data: datainfo,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(101,255,83)',
                    'rgba(39,40,44,0.39)',
                    'rgb(0,255,177)',
                    'rgb(135,148,77)',


                ],
                hoverOffset: 4
            }]
        };
        let lienzo2geo=new Chart(ctx, {
            type: tipo,
            data: data,
            options:{
                plugins: {
                    title: {
                        display: true,
                        text: 'Paises mas comunes de la UE en %'
                    }
            }}
        });
        arraylienzos.push(lienzo2geo)

    })
}

