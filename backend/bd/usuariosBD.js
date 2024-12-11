const Usuario = require("../clases/Usuario");
const { usuariosBD } = require("./conexion");
const { encriptarPassword, validarPassword } = require("../middlewares/funcionesPassword");

function validarDatos(usuario) {
    return usuario.nombre !== undefined && usuario.usuario !== undefined && usuario.password !== undefined;
}

async function mostrarUsuarios(search = "") {
    const snapshot = await usuariosBD.get();
    const usuarios = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    let usuariosValidos = usuarios.filter(usuario => validarDatos(usuario));

    if (search) {
        const searchLower = search.toLowerCase();
        usuariosValidos = usuariosValidos.filter(usuario => 
            usuario.nombre.toLowerCase().includes(searchLower)
        );
    }

    return usuariosValidos;
}

async function buscarPorId(id) {
    const doc = await usuariosBD.doc(id).get();
    if (!doc.exists) {
        return null; // Usuario no encontrado
    }
    const usuario = { id: doc.id, ...doc.data() };
    return validarDatos(usuario) ? usuario : null;
}

async function nuevoUsuario(data) {
    const { salt, hash } = encriptarPassword(data.password);
    data.password = hash;
    data.salt = salt;
    data.tipoUsuario = "usuario";

    const usuario = new Usuario(data);
    if (validarDatos(usuario.getUsuario)) {
        const id = data.id || usuariosBD.doc().id; // Generar ID si no se proporciona
        await usuariosBD.doc(id).set(usuario.getUsuario);
        return { id, ...usuario.getUsuario };
    }
    return false;
}

async function borrarUsuario(id) {
    const usuario = await buscarPorId(id);
    if (usuario) {
        await usuariosBD.doc(id).delete();
        return true;
    }
    return false;
}

async function modificarUsuario(id, nuevosDatos) {
    const usuarioRef = usuariosBD.doc(id);
    const snapshot = await usuarioRef.get();

    if (!snapshot.exists) {
        return { error: "Usuario no encontrado" };
    }

    const usuarioExistente = snapshot.data();

    if (nuevosDatos.password) {
        const { salt, hash } = encriptarPassword(nuevosDatos.password);
        nuevosDatos.password = hash;
        nuevosDatos.salt = salt;
    }

    const usuarioModificado = { ...usuarioExistente, ...nuevosDatos };

    if (validarDatos(usuarioModificado)) {
        await usuarioRef.update(usuarioModificado);
        return { success: true, usuario: usuarioModificado };
    }
    return { error: "Datos no válidos" };
}

async function login(req, usuario, password) {
    const snapshot = await usuariosBD.where("usuario", "==", usuario).get();
    if (snapshot.empty) {
        return { usuario: "anonimo", tipo: "sin acceso" };
    }

    let user = { usuario: "anonimo", tipo: "sin acceso" };
    snapshot.forEach(doc => {
        const data = doc.data();
        if (validarPassword(password, data.password, data.salt)) {
            user.usuario = data.usuario;
            user.tipo = data.tipoUsuario || "usuario";
            req.session[user.tipo] = user;
        }
    });

    return user;
}

function getSessionUsuario(req) {
    return req.session.usuario !== undefined;
}

function getSessionAdmin(req) {
    return req.session.admin !== undefined;
}

async function buscarUsuariosPorNombre(nombre) {
    const snapshot = await usuariosBD.get();
    const usuarios = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    const searchTerm = nombre.toLowerCase();
    return usuarios.filter(usuario => usuario.nombre.toLowerCase().includes(searchTerm));
}

async function nombresUsuarios() {
    const snapshot = await usuariosBD.get();
    const usuarios = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    return usuarios
        .filter(usuario => validarDatos(usuario))
        .map(usuario => usuario.nombre);
}

module.exports = {
    mostrarUsuarios,
    buscarPorId,
    nuevoUsuario,
    borrarUsuario,
    modificarUsuario,
    login,
    getSessionUsuario,
    getSessionAdmin,
    buscarUsuariosPorNombre,
    nombresUsuarios
};
