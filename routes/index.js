var {Client} = require('pg')
var bcrypt = require("bcrypt")
const dotenv = require("dotenv")
var geoip = require("geoip-lite")
var express = require('express');
const {log} = require("debug");
var API_key = "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";
var opencito = require("openai")

var app = express();
var router = express.Router();
const {
    georecogida, getusername, validarusuario, numeropaises, osRecogida, OSsimple, datosSOwversion, datosOSversion,
    ponerenactivo, usuarioautorizado, paisesdeUE, regioncomun, todoslospaises, regiondepais, customqueryE
} = require("./dao");
const {hash, compare} = require("bcrypt");
const {Configuration, OpenAIApi} = require("openai");
let arraydetodoslospaises = []

todoslospaises().then(todoslospaises1 => {
    for (let X of todoslospaises1.rows) {
        arraydetodoslospaises.push(X)
    }
    console.log(arraydetodoslospaises)

})
dotenv.config()
router.get('/movil', function (req, res, next) {
    todoslospaises().then(todoslospaises1 => {
        for (let X of todoslospaises1.rows) {
            let seguro
            for (let x of arraydetodoslospaises) {
                if (X.pais == x.pais) {
                    seguro = true
                }
            }
            if (seguro != true) {
                arraydetodoslospaises.push(X)
            }
        }
    })
    res.render('./movil.ejs', {title: 'Express', todoslospaises: arraydetodoslospaises});

});
/* GET home page. */
router.get('/', function (req, res, next) {
    todoslospaises().then(todoslospaises1 => {
        for (let X of todoslospaises1.rows) {
            let seguro
            for (let x of arraydetodoslospaises) {
                if (X.pais == x.pais) {
                    seguro = true
                }
            }
            if (seguro != true) {
                arraydetodoslospaises.push(X)
            }
        }
    })
    res.render('index', {title: 'Express', todoslospaises: arraydetodoslospaises});

});
router.get('/datosgraficos', async function (req, res, next) {
    console.log("entra en datos graficos")
    let resultado = await numeropaises()
    console.log(resultado)
    res.send(resultado)

});
router.get('/datosSO', async function (req, res, next) {
    console.log("entra en datos graficos")
    let resultado = await OSsimple()
    console.log(resultado)
    res.send(resultado)

});
//SECCION OS DE USUARIO
router.post('/datosOSversion', async function (req, res, next) {
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
router.post('/paisesdeUE', async function (req, res, next) {
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
router.post('/customquery', async function (req, res, next) {
    if(req.body.excpecion==true||true){
        let resultadino = await customqueryE(req.body.sentencia,req.body.token)
        resultadino=resultadino.rows
        if(resultadino!=undefined){
        for (let y of resultadino) {
            y.user_id="tu"
            y.ouser_id="tu"
            let aux = y.zonahoraria.split('/')
            y.zonahoraria=aux[1]
        }        res.send(resultadino)
        }else{
            res.send(false)

        }
    }else{
    try {
        const configuration = new opencito.Configuration({
            apiKey: API_key
        })
        const openai = await new opencito.OpenAIApi(configuration)
        let resultado = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: 'Con la tabla os en el esquema "Informacion" con los campos: osName TIPO:VARCHAR (Nombre del sistema operativo),osip TIPO:VARCHAR (ip del registro),bits(true or false, si es true es 64 bits si es false son 32),osVersion TIPO:VARCHAR (Version del sistema operativo). Y la tabla geodata en el esquema "Informacion" con los campos: ip TIPO:VARCHAR (ip del registro), pais TIPO:VARCHAR (Codigo del pais), region TIPO:VARCHAR (Codigo de la region),eu(Si es true esta en la Union europea, si es falso no lo esta),zonahoraria TIPO:VARCHAR (zona horaria del registro),date(fecha que se creo el registro),city TIPO:VARCHAR (ciudad) creame una consulta sql en postgres que me indique ' +
                   req.body.sentencia+ ' rodeame los campos con comillas'}]
        })
       let resit = await customqueryE(resultado.data.choices[0].message)
    } catch (error) {
        console.log(error)
    }}
});
router.post('/regioncomun', async function (req, res, next) {
    console.log("entra en datos graficos")
    usuarioautorizado(req.body.token).then(async resi => {
        try {
        if (resi == true) {
            let pais = req.body.pais
            pais = pais.replace(/ /g,'')
            let resultado = await regioncomun(pais)
            console.log(resultado)
            res.send(resultado)
        } else {
            res.send(false)
        }}catch (error){
            console.log(error)
        }
    })
});

router.post("/login", (req, res) => {
    let username = req.body.user
    let password = req.body.password.toString()
    const saltRounds = 10
    /*Generar hash de contraseña
    bcrypt.genSalt(saltRounds).then(salt=>{
      return bcrypt.hash(password,salt)
    }).then(hash=>{
      console.log("hash "+hash)
    })*/
    validarusuario(username, password).then(resultado => {
        res.send({id: resultado})
    })
})
router.post("/ponerenactivo", (req, res) => {
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

router.post("/georecogida", (req, res) => {
    let ip = req.body.ip
    let geodatos = geoip.lookup(ip.toString())
    let osName = req.body.osName
    let osBits = req.body.osBits
    let osVersion = req.body.osVersion
    console.log(geodatos)
    georecogida(geodatos, ip,req.body.token)
    osRecogida(ip, osName, osBits, osVersion,req.body.token)

})
router.get('/todoslospaises', async function (req, res, next) {
    todoslospaises().then(resultado => {
        res.send(resultado.rows)
    })
});

router.post('/regiondepais', async function (req, res, next) {
    regiondepais(req.body.pais).then(resultado => {
        res.send(resultado)
    })
});
module.exports = router;
