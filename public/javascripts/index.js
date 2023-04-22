import * as helper from "./helper.js";
let section1 = document.getElementById("seccion1")
    const body = document.getElementsByTagName("body")[0]
    var login = document.getElementById("login")
    let loginanonimo = document.getElementById("loginanonimo")
    loginanonimo.addEventListener("click",()=>{
        body.style.gridTemplateColumns="0fr 0fr 1fr 0fr"
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
        let datosnavegacion = navigator
    })
    $("#loginconuser").bind("click touchstart",(ev)=>{
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
             console.log(result.id)
       })
    })






