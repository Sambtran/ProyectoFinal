
var { Client } = require('pg')
var bcrypt = require("bcrypt")
const dotenv = require("dotenv")
var geoip = require("geoip-lite")
var express = require('express');
const {log} = require("debug");
var router = express.Router();
const {georecogida, getusername, validarusuario} = require("./dao");
const {hash, compare} = require("bcrypt");

dotenv.config()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });

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
router.post("/georecogida",(req, res)=>{
  let ip = req.body.ip
  let cosas = geoip.lookup(ip.toString())
  console.log(cosas)
    georecogida(cosas,ip)
})

module.exports = router;
