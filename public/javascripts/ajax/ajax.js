const dotenv = require("dotenv")
const geoip = require("geoip-lite")
dotenv.config()
async function start () {
const { Client } = require('pg')
const client = new Client({
    user: "alberto",
    host: "localhost",
    database: "Proyecto",
    password: "123",
    port: "5432"
})
await client.connect()
const res = await client.query(`select * FROM "Informacion".users`)
console.log(res.rows[0])}
start()
let res = geoip.lookup("92.58.223.2")
console.log(res)