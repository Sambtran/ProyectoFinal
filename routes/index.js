
const { Client } = require('pg')
const dotenv = require("dotenv")
const geoip = require("geoip-lite")
var express = require('express');
var router = express.Router();
dotenv.config()
function crearCliente(){
    var cliente = new Client({
        user: "alberto",
        host: "localhost",
        database: "Proyecto",
        password: "123",
        port: "5432"
    })
    return cliente
}

 async function recogidaAnonima (datos,ip){
    let cliente = crearCliente()
  await cliente.connect()
  let pais = datos.country
  if(datos.region==""){
      var region = null
  }else{
      var region = datos.region
  }
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
      let sql = `insert into "Informacion".geodata (rowid, ip, user_id, pais, region, eu, zonahoraria, latitud, longitud, metrocode, fallo) values (default,'${ip}',null,'${pais}','${region}',${eu},'${zonahoraria}',${latitud},${longitud},${metrocode},${fallo});`
    const res = await client.query(sql)
    return true
  }catch (error){
    return false
  }
  finally {
    await cliente.end();
  }

}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post("/recogida",(req, res)=>{
  let ip = req.body.ip
  let cosas = geoip.lookup(ip.toString())
  console.log(cosas)
  if(recogidaAnonima(cosas,ip)){
    console.log("ha funcionado")
  }else{
    console.log("No ha funcionado")
  }
})

module.exports = router;
