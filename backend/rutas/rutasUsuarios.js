const express = require("express");
const rutas = express.Router();

const { 
    getSessionUsuario,
    getSessionAdmin,
    login,
    mostrarUsuarios,
    nuevoUsuario,
    borrarUsuario,
    buscarPorId,
    modificarUsuario,
    nombresUsuarios,
    buscarUsuariosPorNombre 
} = require("../bd/usuariosBD");

// Obtener todos los usuarios o filtrar por término de búsqueda
rutas.get("/mostrar", async (req, res) => {
    try {
        const search = req.query.search || "";
        const usuarios = await mostrarUsuarios(search);
        res.status(200).json(usuarios);
    } catch (error) {
        console.error("Error al mostrar usuarios:", error);
        res.status(500).json({ error: "Error al obtener los usuarios" });
    }
});

// Obtener solo los nombres de los usuarios válidos
rutas.get("/nombres", async (req, res) => {
    try {
        const nombres = await nombresUsuarios();
        res.status(200).json(nombres);
    } catch (error) {
        console.error("Error al obtener nombres de usuarios:", error);
        res.status(500).json({ error: "Error al obtener los nombres" });
    }
});

// Buscar usuario por ID
rutas.get("/buscar/:id", async (req, res) => {
    try {
        const usuario = await buscarPorId(req.params.id);
        if (usuario) {
            res.status(200).json(usuario);
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error("Error al buscar usuario:", error);
        res.status(500).json({ error: "Error al buscar usuario" });
    }
});

// Buscar usuarios por nombre (parcial o completo)
rutas.get("/buscarPorNombre", async (req, res) => {
    try {
        const nombre = req.query.nombre || "";
        const usuarios = await buscarUsuariosPorNombre(nombre);
        res.status(200).json(usuarios);
    } catch (error) {
        console.error("Error al buscar usuarios por nombre:", error);
        res.status(500).json({ error: "Error al buscar usuarios" });
    }
});

// Eliminar usuario por ID
rutas.delete("/borrar/:id", async (req, res) => {
    try {
        const borrado = await borrarUsuario(req.params.id);
        if (borrado) {
            res.status(200).json({ success: "Usuario eliminado correctamente" });
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error("Error al borrar usuario:", error);
        res.status(500).json({ error: "Error al borrar usuario" });
    }
});

// Crear un nuevo usuario
rutas.post("/nuevo", async (req, res) => {
    try {
        const usuario = await nuevoUsuario(req.body);
        if (usuario) {
            res.status(201).json({ success: "Usuario creado correctamente", usuario });
        } else {
            res.status(400).json({ error: "Datos no válidos" });
        }
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ error: "Error al crear usuario" });
    }
});

// Modificar un usuario por ID
rutas.put("/modificar/:id", async (req, res) => {
    try {
        const resultado = await modificarUsuario(req.params.id, req.body);
        if (resultado.success) {
            res.status(200).json({ success: "Usuario modificado correctamente", usuario: resultado.usuario });
        } else {
            res.status(400).json({ error: resultado.error });
        }
    } catch (error) {
        console.error("Error al modificar usuario:", error);
        res.status(500).json({ error: "Error al modificar usuario" });
    }
});

// Iniciar sesión
rutas.post("/login", async (req, res) => {
    try {
        const usuario = await login(req, req.body.usuario, req.body.password);
        res.status(200).json(usuario);
    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ error: "Error en el login" });
    }
});

// Verificar sesión de usuario
rutas.get("/getSessionUsuario", (req, res) => {
    try {
        const sesionActiva = getSessionUsuario(req);
        res.status(200).json({ activo: sesionActiva });
    } catch (error) {
        console.error("Error al verificar sesión de usuario:", error);
        res.status(500).json({ error: "Error al verificar la sesión" });
    }
});

// Verificar sesión de administrador
rutas.get("/getSessionAdmin", (req, res) => {
    try {
        const sesionActiva = getSessionAdmin(req);
        res.status(200).json({ activo: sesionActiva });
    } catch (error) {
        console.error("Error al verificar sesión de administrador:", error);
        res.status(500).json({ error: "Error al verificar la sesión" });
    }
});

module.exports = rutas;
