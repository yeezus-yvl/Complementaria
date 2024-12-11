const { log } = require("console");
const crypto = require("crypto");

function encriptarPassword(password) {
    const salt = crypto.randomBytes(32).toString("hex");
    const hash = crypto.scryptSync(password, salt, 100000, 64, "sha512").toString("hex");
    return {
        salt,
        hash
    }
}

function validarPassword(password, hash, salt) {
    const hashEvaluar = crypto.scryptSync(password, salt, 100000, 64, "sha512").toString("hex");
    return hashEvaluar == hash;
}

function usuarioAutorizado(req,res,cb) {
    var usuarioAutorizado=false;
    if (req.session.usuario) {
        console.log("Usuario autorizado");
        usuarioAutorizado=true;
    }
    return usuarioAutorizado;
}

function adminAutorizado(req,res,cb) {
    var adminAutorizado=false;
    if (req.session.admin) {
        console.log("Admin autorizado");
        adminAutorizado=true;
    }

    return adminAutorizado;
}

module.exports = {
    encriptarPassword,
    validarPassword,
    usuarioAutorizado,
    adminAutorizado
}

