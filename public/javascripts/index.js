import * as helper from "./helper.js";
let section1 = document.getElementById("seccion1")
    const body = document.getElementsByTagName("body")[0]
    var login = document.getElementById("login")
    let loginanonimo = document.getElementById("loginanonimo")
    loginanonimo.addEventListener("click",()=>{
        login.style.gridTemplateColumns="100% 0%"
        login.style.opacity="0%"
        body.style.gridTemplateColumns="0fr 0fr 1fr 0fr"
    })
    fetch('https://api.ipify.org/').then(
        r => r.text()
    ).then((ip)=>{
        console.log(ip)
        $.ajax({
            type: "POST",
            url: "/recogida",
            data: {ip:ip},
            success: "succes",
        });
    });
console.log(navigator)





