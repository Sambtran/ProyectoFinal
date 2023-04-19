const dotenv = require("dotenv")
const geoip = require("geoip-lite")
dotenv.config()
export async function start () {
const { Client } = require('pg')
const client = new Client({
    user: "alberto",
    host: "localhost",
    database: "Proyecto",
    password: "123",
    port: "5432"
})
}
export async function recogidaAnonima (datos,ip){
    await client.connect()
    let pais = datos.country
    let region = datos.region
    let eu = datos.eu
    let zonahoraria = datos.timezone
    let latitud = datos.ll[0]
    let lognitud = datos.ll[1]
    let metrocode = datos.metro
    let fallo = datos.area
    try {
        const res = await client.query(`insert into "Informacion".geodata (rowid, ip, user_id, pais, region, eu, zonahoraria, latitud, longitud, metrocode, fallo) 
    values (default,${ip},null,${pais},${region},${eu},${zonahoraria},${latitud},${longitud},${metrocode},${fallo});`)
        return true
    }catch (error){
        return false
    }
    finally {
        await client.end();
    }

}