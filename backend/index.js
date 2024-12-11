const express = require("express");
const cors = require("cors");
const session = require("express-session");
require('dotenv').config();

const usuariosRutas = require("./rutas/rutasUsuarios");
const productosRutas = require("./rutas/rutasProductos");
const ventasRutas = require("./rutas/rutasVentas");

const app = express();
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
app.use(cors()); 
app.use(session({
    name:'session',
    secret:process.env.KEYS,
    resave: false,
    saveUninitialized: true,
    maxAge:1000*60*60*24
}));


app.use("/usuarios", usuariosRutas);  
app.use("/productos", productosRutas); 
app.use("/ventas", ventasRutas);  


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Servidor en http://localhost:" + port);
});
