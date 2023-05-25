const {Client} = require("pg");
const {query} = require("postgre");
const {log} = require("debug");
var visionuser = 1
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
    if(true){
        let sql = `Select * from "Informacion".users where "password" like '%${token}%';`
        let res = await cliente.query(sql)
        console.log(res)
            if(res.rows.length<1){
              token=null
            }
    }
    if(datos.region==""){
        var region = null
    }else{
        var region = datos.region
    }
      if(datos.city==""){
          var city = null
      }else{
          var city = datos.city
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

    try {
        let sql = `insert into "Informacion".geodata (rowid, ip, user_id, pais, region, eu, zonahoraria, latitud, longitud, metrocode,fallo,date,city) values (default,'${ip}',${token},'${pais}','${region}',${eu},'${zonahoraria}',${latitud},${longitud},${metrocode},${fallo},default,'${city}');`
        console.log(sql)
        const res = await cliente.query(sql)
        return true
    }catch (error){
        console.log(error)
        console.log("ERROR geo")
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
    let sql = `select pais,count(*)  FROM "Informacion".geodata GROUP BY pais order by count(*) desc`
    let resultado =  await cliente.query(sql)
    await cliente.end();
    return resultado.rows
}
async function osRecogida(ip,osName,osBits,osVersion,token){
    let cliente = await crearCliente()
    if(token!=null && token!=undefined){
        let sql = `Select * from "Informacion".users where "password" like '%${token}%';`
        let res = await cliente.query(sql)
        if(res.rows.length<1){
            token=null
        }
    }
    try {
        await cliente.connect()
        if(osBits==" x64"){
            osBits=true
        }else{
            osBits=false
        }
        let sql = `insert into "Informacion".os (osrowid,"osName",osip,bits,"osVersion","user_id") values (default,'${osName}','${ip}',${osBits},'${osVersion}','${token}');`
        const res = await cliente.query(sql)
        return true
    }catch (error){
         return false
        console.log("ERROR OS")
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
    let sql = `select "osVersion",count(*) from "Informacion".os where "osName" like '%Windows%' and "osVersion" IS NOT NULL group by "osVersion"`
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

async function regioncomun(pais){
    let cliente = await crearCliente()
    await cliente.connect()
    let sql = `select region,count(*) from "Informacion".geodata where pais='${pais}' AND region is not null GROUP BY region ORDER BY count(*) desc`
    let resultado =  await cliente.query(sql)
    await cliente.end();
    return resultado.rows
}
async function regiondepais(pais){
    let cliente = await crearCliente()
    await cliente.connect()
    let sql = `select region from "Informacion".geodata where pais like '%${pais}%' and geodata.region notnull group by region `
    let resultado =  await cliente.query(sql)
    await cliente.end();
    return resultado
}

async function usuarioautorizado(token){
    let cliente = await crearCliente()
    await cliente.connect()
    let sql = `SELECT "activo" from "Informacion".users where "password" like '%${token}%'`
    let resultado =  await cliente.query(sql)
    await cliente.end();
    try {
    if(resultado.rows[0].activo==true){
        return true
    }else{
        false
    }}catch (error){
        return false
    }
}
async function todoslospaises(){
    let cliente = await crearCliente()
    await cliente.connect()
    let sql = `select Distinct pais from "Informacion".geodata `
    let resultado =  await cliente.query(sql)
    await cliente.end();
    return resultado
}
async function customqueryE(textosql ,token){
    let cliente = await crearCliente()
    await cliente.connect()
    let viewsql = `Create temp view userview${visionuser} AS select * from "Informacion".geodata JOIN "Informacion".os  on "Informacion".geodata.user_id
= "Informacion".os.ouser_id where "Informacion".geodata.user_id like '%${token}%';`
    await cliente.query(viewsql)
    let sql = `Select * from userview${visionuser} ${textosql} `
    let resultado =  await cliente.query(sql)
    let delsql = `DROP VIEW userview${visionuser};`
    visionuser++
    await cliente.query(delsql)
    await cliente.end();
    if(resultado.rows.length>0){
    return resultado}else {
        return false
    }
}

module.exports = {customqueryE,regiondepais,todoslospaises,regioncomun,paisesdeUE,usuarioautorizado,ponerenactivo,georecogida,getusername,validarusuario,numeropaises,osRecogida,OSsimple,datosOSversion}