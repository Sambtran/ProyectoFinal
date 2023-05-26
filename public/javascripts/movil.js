import * as helper from "./helper.js";

document.addEventListener("DOMContentLoaded",()=>{
    let body = document.getElementsByTagName("body")[0]
    $("#contenido").hide()
    loginanonimo.addEventListener("click",async () => {
        body.style.gridTemplateRows = "0fr 0fr 1fr 0fr"
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
})