
var { Client } = require('pg')
var bcrypt = require("bcrypt")
const dotenv = require("dotenv")
var geoip = require("geoip-lite")
var express = require('express');
const {log} = require("debug");
var router = express.Router();
const {georecogida, getusername, validarusuario, numeropaises,osRecogida,OSsimple, datosSOwversion, datosOSversion,
  ponerenactivo, usuarioautorizado, paisesdeUE, regioncomun, todoslospaises
} = require("./dao");
const {hash, compare} = require("bcrypt");
let arraydetodoslospaises = []

todoslospaises().then(todoslospaises1=>{
  for (let X of todoslospaises1.rows) {
    arraydetodoslospaises.push(X)
  }
  console.log(arraydetodoslospaises)

})
dotenv.config()

/* GET home page. */
router.get('/', function(req, res, next) {
  todoslospaises().then(todoslospaises1=>{
    for (let X of todoslospaises1.rows) {
      arraydetodoslospaises.push(X)
    }
  res.render('index', { title: 'Express',todoslospaises:arraydetodoslospaises});

});
router.get('/datosgraficos', async function(req, res, next) {
  console.log("entra en datos graficos")
  let resultado = await numeropaises()
  console.log(resultado)
  res.send(resultado)

});
router.get('/datosSO', async function(req, res, next) {
  console.log("entra en datos graficos")
  let resultado = await OSsimple()
  console.log(resultado)
  res.send(resultado)

});
//SECCION OS DE USUARIO
router.post('/datosOSversion', async function(req, res, next) {
  console.log("entra en datos graficos")
  usuarioautorizado(req.body.token).then(async resi => {
    if (resi == true) {
      let resultado = await datosOSversion()
      console.log(resultado)
      res.send(resultado)
    } else {
      res.send(false)
    }
  })
});
router.post('/paisesdeUE', async function(req, res, next) {
  console.log("entra en datos graficos")
  usuarioautorizado(req.body.token).then(async resi => {
    if (resi == true) {
      let resultado = await paisesdeUE()
      console.log(resultado)
      res.send(resultado)
    } else {
      res.send(false)
    }
  })
});
router.post('/regioncomun', async function(req, res, next) {
  console.log("entra en datos graficos")
  usuarioautorizado(req.body.token).then(async resi => {
    if (resi == true) {
      let resultado = await regioncomun(req.body.pais)
      console.log(resultado)
      res.send(resultado)
    } else {
      res.send(false)
    }
  })
});
router.post('/regioncomun', async function(req, res, next) {
  console.log("entra en datos graficos")
  usuarioautorizado(req.body.token).then(async resi => {
    if (resi == true) {
      let resultado = await regioncomun(req.body.pais)
      console.log(resultado)
      res.send(resultado)
    } else {
      res.send(false)
    }
  })
});
router.post("/login",(req, res)=>{
  let username = req.body.user
  let password = req.body.password.toString()
  const saltRounds = 10
  /*Generar hash de contraseña
  bcrypt.genSalt(saltRounds).then(salt=>{
    return bcrypt.hash(password,salt)
  }).then(hash=>{
    console.log("hash "+hash)
  })*/
  validarusuario(username,password).then(resultado=>{
    res.send({id:resultado})
  })
})
router.post("/ponerenactivo",(req, res)=>{
  let id = req.body.id
  const saltRounds = 10
  /*Generar hash de contraseña
  bcrypt.genSalt(saltRounds).then(salt=>{
    return bcrypt.hash(password,salt)
  }).then(hash=>{
    console.log("hash "+hash)
  })*/
  ponerenactivo(id)
  return true
})

router.post("/georecogida",(req, res)=>{
  let ip = req.body.ip
  let geodatos = geoip.lookup(ip.toString())
  let osName = req.body.osName
  let osBits = req.body.osBits
  let osVersion = req.body.osVersion
  console.log(geodatos)
    georecogida(geodatos,ip)
    osRecogida(ip,osName,osBits,osVersion)

})

module.exports = router;
