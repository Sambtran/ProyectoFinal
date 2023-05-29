import * as helper from "./helper.js";
import {mostrarnav, setToken} from "./helper.js";

document.addEventListener("DOMContentLoaded",()=>{
    $("#tiposdegrafico").hide()
    $("nav").hide()
    let volver=document.getElementsByClassName("volver-atrasp")[0]
    let volveran=document.getElementsByClassName("volver-atras-anp")[0]
    $("#logedg").hide()
    console.log(volver)
    $(volver).bind("click",()=>{
        body.style.gridTemplateRows="1fr 1fr 0fr 0fr"
        $("#loged").hide()
        $("#logedg").hide()
        $("#loginanonimo").show()
        $("#loginconuser").show()

    })
    $(volveran).bind("click",()=>{
        body.style.gridTemplateRows="1fr 1fr 0fr 0fr"
        $("#loged").hide()
        $("#logedg").hide()
        $("#contenido").hide()
        $("nav").hide()
        $("#loginanonimo").show()
        $("#loginconuser").show()

    })
    let body = document.getElementsByTagName("main")[0]

    function invocation(){
        // Cookies.remove("user_id")
        //Cookies.remove("cookiesaccepted")
        $("#selectpais").hide()
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
        if(Cookies.get("user_id")!=undefined&&Cookies.get("user_id")!=false&&Cookies.get("user_id")!=null){
            $(".page").hide()
            cargarusuario(Cookies.get("user_id"))
            $("#loged").show()
            $("#logedg").show()
            let salires=document.getElementsByClassName("desconexion")
            for (const salire of salires) {
                salire.remove()
            }
            mostrarnav(nav,body)
            let desconexion= document.createElement("div")
            desconexion.innerText="Desconectar"
            desconexion.addEventListener("click",()=>{
                Cookies.remove("user_id")
                location.reload()
            })
            desconexion.setAttribute("class","desconexion")
            desconexion.setAttribute("id","desconexion")

            nav.appendChild(desconexion)
            $("#tiposdegrafico").fadeIn("slow")
            token = Cookies.get("user_id")

        }else{
            loginanonimo.addEventListener("click",async () => {
                $("#contenido").show()
                $("#loginconuser").fadeOut("slow")
                $("#loginanonimo").fadeOut("slow")
                setTimeout(()=>{
                    mostrarnav(nav,body)
                },400)
                $("#loged").hide()
                $("#logedg").hide()
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
                                'rgb(255, 205, 86)',
                                'rgb(24,26,100)',
                                'rgb(156,206,68)',
                                'rgb(165,176,149)',

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
                                'rgb(255, 99, 132)',
                                'rgb(54, 162, 235)',
                                'rgb(255, 205, 86)',
                                'rgb(24,26,100)',
                                'rgb(156,206,68)',
                                'rgb(165,176,149)',
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
            $("#loginconuser").bind("click",(ev)=>{
                $("#loginconuser").fadeOut("slow")
                $("#loginanonimo").fadeOut("slow")
                $("#navusuario").hide()
                setTimeout(()=>{
                },400)
                $("#loged").show()
                $("#logedg").show()

            })

            $("#submit").bind("click",()=>{
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
                            let salires=document.getElementsByClassName("desconexion")
                            for (const salire of salires) {
                                salire.remove()
                            }
                            let desconexion= document.createElement("div")
                            desconexion.innerText="Desconectar"
                            desconexion.addEventListener("click",()=>{
                                Cookies.remove("user_id")
                                location.reload()
                            })
                            desconexion.setAttribute("class","desconexion")
                            desconexion.setAttribute("id","desconexion")

                            nav.appendChild(desconexion)
                            $.post( "/ponerenactivo",{id:result.id} )
                            cargarusuario(result.id)}
                        $("#loged").show()
                        $("#logedg").show()
                        $("#tiposdegrafico").fadeIn("slow")
                        token = result.id
                    }

                })
            })
        }
    }
    var nav = document.getElementsByTagName("nav")[0]
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
    let navlogin = document.getElementById("navlogin")
    $(navlogin).unbind("click")
    $(navlogin).bind("click",()=>{
        $(".page").show()
        $("#selectpais").hide()
        $("#loged").show()
        $("#logedg").show()
        $("#contenido").hide()
        $(nav).hide()
        $("#tiposdegrafico").hide()
        Cookies.set("user_id",null)
        //DESCONEXION
    })
    $("#selectpais").bind("change",()=>{
        console.log("hola")
        if(lienzo3geo!=null && lienzo3geo!=undefined){
            lienzo3geo.destroy()}
        $.post( "/regioncomun",{token:token,pais:$("#selectpais option:selected").text()} ).done(resultado=>{
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
                labels.push(dato.region)
            }
            console.log(datosgraficos)
            const ctx = $("#lienzeogeo3")
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
            lienzo3geo=new Chart(ctx, {
                type: tipo,
                data: data,
                options:{
                    plugins: {
                        title: {
                            display: true,
                            text: 'Regiones mas comunes del pais en %'

                        }
                    }}
            });
            arraylienzos.push(lienzo3geo)
        })

    })
})
var arraylienzos = []
var seguro = 0
function cargarusuario(token,tipo){
    setToken(token)
    $("#loginanonimo").hide()
    $("#loginconuser").hide()
    let auxiliar2 = document.getElementById("auxiliar2")
    let navuser = document.getElementById("navusuario")
    $(navuser).show()
    let hijosnavuser = navuser.childNodes
    let Z=0
    for (let j = 0; j < hijosnavuser.length ; j++) {
        if(hijosnavuser[j].tagName == 'DIV') {
            let  hijo = hijosnavuser[j]
            console.log(hijo)
            if(Z==0){
                $(hijo).bind("click",()=>{
                    console.log("este es 1")
                    $("#customquery").hide()
                    $("#historial").hide()
                    $("#contgeneral").show()
                })
            }
            if(Z==1){
                $(hijo).bind("click",()=>{
                    console.log("este es 2")
                    $("#customquery").show()
                    $("#historial").hide()
                    $("#contgeneral").hide()
                })
            }
            if(Z==2){
                $(hijo).bind("click",()=>{
                    console.log("este es 3")
                    $("#customquery").hide()
                    $("#historial").show()
                    $("#contgeneral").hide()
                    let historial = Cookies.get("historial")
                    historial = JSON.parse(historial)
                    let containerhistorial = document.getElementById("subhistorial")
                    let hijoseliminar = containerhistorial.childNodes
                    if(hijoseliminar.length>0){
                        for (let e of hijoseliminar) {
                            e.remove()
                        }
                    }
                    for (let x of historial) {
                        let nuevo = document.createElement("div")
                        nuevo.setAttribute("class","historialel")
                        nuevo.addEventListener("click",()=>{
                            console.log("TOKEN ES = "+token)
                            $.post("/customquery",{sentencia:x,token:token}).then(res=> {

                                let mostrador = document.getElementById("Mostrador")
                                // Create the table element
                                let table = document.createElement("table");

                                // Get the keys (column names) of the first object in the JSON data
                                let cols = Object.keys(res[0]);

                                // Create the header element
                                let thead = document.createElement("thead");
                                thead.setAttribute("class","tbl-header")
                                let tr = document.createElement("tr");

                                // Loop through the column names and create header cells
                                cols.forEach((item) => {
                                    let th = document.createElement("th");
                                    th.innerText = item; // Set the column name as the text of the header cell
                                    tr.appendChild(th); // Append the header cell to the header row
                                });
                                thead.appendChild(tr); // Append the header row to the header
                                table.append(tr) // Append the header to the table

                                // Loop through the JSON data and create table rows
                                res.forEach((item) => {
                                    let tr = document.createElement("tr");

                                    // Get the values of the current object in the JSON data
                                    let vals = Object.values(item);

                                    // Loop through the values and create table cells
                                    vals.forEach((elem) => {
                                        let td = document.createElement("td");
                                        td.innerText = elem; // Set the value as the text of the table cell
                                        tr.appendChild(td); // Append the table cell to the table row
                                    });
                                    table.appendChild(tr); // Append the table row to the table
                                });
                                table.setAttribute("class","tbl-content")
                                mostrador.appendChild(table)

                            })})
                        let nuevop=document.createElement("p")
                        nuevop.innerText=x
                        nuevo.appendChild(nuevop)
                        containerhistorial.appendChild(nuevo)
                    }
                })
            }Z++}
    }
    let contgeneral = document.getElementById("contgeneral")
    contgeneral.style='display: grid;grid-template-areas:"nt lg""nt lg";'
    $("#selectpais").show()
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
    console.log($("#selectpais option:selected").val())
    $.post( "/regioncomun",{token:token,pais:$("#selectpais option:selected").text()} ).done(resultado=>{
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
            labels.push(dato.region)
        }
        console.log(datosgraficos)
        const ctx = $("#lienzeogeo3")
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
        lienzo3geo=new Chart(ctx, {
            type: tipo,
            data: data,
            options:{
                plugins: {
                    title: {
                        display: true,
                        text: 'Regiones mas comunes del pais en %'

                    }
                }}
        });
        arraylienzos.push(lienzo3geo)

    })

}



    $("#contenido").hide()
    loginanonimo.addEventListener("click",async () => {
        $("nav").fadeIn()
        $("#contenido").show()
        $("#loginconuser").fadeOut("slow")
        $("#loginanonimo").fadeOut("slow")
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
                        'rgb(255, 205, 86)',
                        'rgb(24,26,100)',
                        'rgb(156,206,68)',
                        'rgb(165,176,149)',

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
                options: {
                    plugins: {
                        legend: {
                            labels: {
                                // This more specific font property overrides the global property
                                font: {
                                    size: 50
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: 'Paises mas comunes en %',
                            font: {
                                size: 60
                            }
                        }
                    }
                }
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
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)',
                        'rgb(24,26,100)',
                        'rgb(156,206,68)',
                        'rgb(165,176,149)',
                    ],
                    hoverOffset: 4
                }]
            };
            new Chart(ctx, {
                type: 'doughnut',
                data: data,
                options: {
                    plugins: {
                        legend: {
                            labels: {
                                // This more specific font property overrides the global property
                                font: {
                                    size: 50
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: 'Dispositivos mas comunes en %',
                            font: {
                                size: 60
                            }
                        }
                    }
                }
            });

        })
    })
