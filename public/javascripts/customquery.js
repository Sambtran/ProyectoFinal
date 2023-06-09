import {esnodelist, mostrarnav, setToken,getToken} from "./helper.js";


document.addEventListener("DOMContentLoaded",()=>{
    let sentencia = document.getElementById("sentencia")
    let valor1 = document.getElementById("valor1")
    let valor2 = document.getElementById("valor2")
    let valor3 = document.getElementById("valor3")
    let ejecutar = document.getElementById("ejecutar")
    let container = document.getElementById("container")
    sentencia.placeholder="SELECT * FROM TODO"
    $("#customquery").hide()
    $("#historial").hide()
    $("#navusuario")
    ejecutar.addEventListener("click",()=>{
        var historial = Cookies.get("historial")
        let auxiliar=[]
        try {
            historial=JSON.parse(historial)
            for (let X of historial) {
                if(X==' '){
                    X="TODO"
                }
                auxiliar.push(X)
            }
            console.log(auxiliar)
        }catch (error){
            console.log(error)
        }
        console.log("yey")
        console.log("TOKEN  "+getToken())
        $.post("/customquery",{sentencia:$("#sentencia").val(),token:getToken()}).then(res=>{
            if(res==false){
                $("#sentencia").val("FALLO")
            }
            else{


            let pusheable=$("#sentencia").val()
            if($("#sentencia").val()==''||$("#sentencia").val()==' '){
                pusheable="TODO"
            }
            auxiliar.push(pusheable)
            auxiliar=JSON.stringify(auxiliar)
            Cookies.set("historial",auxiliar)
            if($("#excepcion").is(":checked")||true){
                console.log(window.screen.width)
                if(screen.width<768){
                    console.log("ERWHGAORHGOAERHG")
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


                }
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
                container.innerHTML=''
                container.appendChild(table)
            }else{

            }}

            console.log(res)
        })

    })
})

