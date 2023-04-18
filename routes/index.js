var express = require('express');
var router = express.Router();
var geoip = require("geoip-lite")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post("/recogida",(req, res)=>{
  let ip = req.body.ip
  let cosas = geoip.lookup(ip.toString())
  console.log(cosas)
  console.log(ip)
})

module.exports = router;
