import * as helper from "./helper.js";
let body = document.getElementsByTagName("body")[0]
let section1 = document.getElementById("seccion1")
import("https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js").then(() => {
    const body = document.getElementsByTagName("body")[0]
    var login = document.getElementById("login")
    let loginanonimo = document.getElementById("loginanonimo")
    loginanonimo.addEventListener("click",()=>{
        login.style.gridTemplateColumns="100% 0%"
        login.style.opacity="0%"
        body.style.gridTemplateColumns="0fr 0fr 1fr 0fr"

    })
})




