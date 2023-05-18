const {Client} = require("pg");
const {query} = require("postgre");
const {log} = require("debug");
const bcrypt = require("bcrypt");

 async function crearCliente(){
    let cliente = new Client({
        user: "alberto",
        host: "dpg-chj76ju7avj2pb5nhvsg-a.frankfurt-postgres.render.com",
        database: "proyecto_vl98",
        password: "ARtMXXgxQ6UXOz37tB7WP0YesR7a5kcy",
        port: "5432",
        ssl:true
    })
    return cliente
}

  async function georecogida (datos,ip,token){
    let cliente = await crearCliente()
    await cliente.connect()
    let pais = datos.country
    //en caso de que la región no sea detectada se pondra como nula
    if(datos.region==""){
        var region = null
    }else{
        var region = datos.region
    }
    //Si se encuentra en la union europea
    if(datos.eu==1){
        var eu=true
    }else{
        var eu=false
    }
    let zonahoraria = datos.timezone
    let latitud = datos.ll[0]
    let longitud = datos.ll[1]
    let metrocode = datos.metro
    let fallo = datos.area
    let fecha = new Date()
    fecha = fecha.toLocaleDateString() + " " + fecha.toLocaleTimeString();
    console.log(fecha)
    try {
        if(token!=undefined){}else{token=null}
        let sql = `insert into "Informacion".geodata (rowid, ip, user_id, pais, region, eu, zonahoraria, latitud, longitud, metrocode, fallo,date) values (default,'${ip}',${token},'${pais}','${region}',${eu},'${zonahoraria}',${latitud},${longitud},${metrocode},${fallo},'${fecha}');`
        const res = await cliente.query(sql)
        return true
    }catch (error){
        return false
    }
    finally {
        await cliente.end();
    }

}
async function getusername(username){
     let cliente = await crearCliente()
     await cliente.connect()
    try {
     let sql = `SELECT nombre,password,user_id FROM "Informacion".users WHERE nombre like '${username}'`
     const res = await cliente.query(sql)
     let lineas = res.rows
        return lineas
     }catch (error){
        console.log(error)}
     finally {
        cliente.end()
    }

}
async function validarusuario(username,password){
    let resultado = await getusername(username)
    var id = false
    for (let result of resultado) {
      if( await  bcrypt.compare(password, result.password)){
          id=result.password
      }
        return id
    }
}

async function ponerenactivo(id){
    let cliente = await crearCliente()
    await cliente.connect()
    let sql = `UPDATE "Informacion".users  SET "activo" = true WHERE "password" like '%${id}%' `
    await cliente.query(sql)
    await cliente.end();
}
async function numeropaises(){
    let cliente = await crearCliente()
    await cliente.connect()
    let sql = `select pais,count(*)  FROM "Informacion".geodata GROUP BY pais`
    let resultado =  await cliente.query(sql)
    await cliente.end();
    return resultado.rows
}
async function osRecogida(ip,osName,osBits,osVersion){
    let cliente = await crearCliente()

    try {
        await cliente.connect()
        if(osBits==" x64"){
            osBits=true
        }else{
            osBits=false
        }
        let sql = `insert into "Informacion".os (osrowid,"osName",osip,bits,"osVersion") values (default,'${osName}','${ip}',${osBits},'${osVersion}');`
        const res = await cliente.query(sql)
        return true
    }catch (error){
         return false
    }
    finally {
        await cliente.end();

    }
}
async function OSsimple(){
    let cliente = await crearCliente()
    await cliente.connect()
    let sql = `select "osName",count(*)  FROM "Informacion".os GROUP BY "osName"`
    let resultado =  await cliente.query(sql)
    await cliente.end();
    return resultado.rows

}
async function datosOSversion(){
    let cliente = await crearCliente()
    await cliente.connect()
    let sql = `select "osVersion",count(*) from "Informacion".os where "osName" like '%Windows%' group by "osVersion"`
    let resultado =  await cliente.query(sql)
    await cliente.end();
    return resultado.rows
}
async function paisesdeUE(){
    let cliente = await crearCliente()
    await cliente.connect()
    let sql = `select "pais",count(*) from "Informacion".geodata where eu=true group by pais`
    let resultado =  await cliente.query(sql)
    await cliente.end();
    return resultado.rows
}

async function usuarioautorizado(token){
    let cliente = await crearCliente()
    await cliente.connect()
    let sql = `SELECT "activo" from "Informacion".users where "password" like '%${token}%'`
    let resultado =  await cliente.query(sql)
    await cliente.end();
    if(resultado.rows[0].activo==true){
        return true
    }else{
        false
    }
}

module.exports = {paisesdeUE,usuarioautorizado,crearCliente,ponerenactivo,georecogida,getusername,validarusuario,numeropaises,osRecogida,OSsimple,datosOSversion}