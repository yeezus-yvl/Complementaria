const express = require("express");
const rutas = express.Router();
const { 
    mostrarProductos, 
    nuevoProducto, 
    borrarProducto, 
    buscarPorId, 
    modificarProducto, 
    nombresProductos,
    buscarPorProducto 
} = require("../bd/productosBD");

// Ruta para mostrar productos (opcionalmente con filtro de búsqueda)
rutas.get("/mostrar", async (req, res) => {
    try {
        const search = req.query.search || ""; // Obtiene el término de búsqueda si existe
        const productos = await mostrarProductos(search);
        res.status(200).json(productos);
    } catch (error) {
        console.error("Error al mostrar productos:", error);
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

// Ruta para obtener solo los nombres de productos
rutas.get("/nombres", async (req, res) => {
    try {
        const productos = await nombresProductos();
        res.status(200).json(productos);
    } catch (error) {
        console.error("Error al obtener nombres de productos:", error);
        res.status(500).json({ error: "Error al obtener los nombres de productos" });
    }
});

// Ruta para buscar un producto por ID
rutas.get("/buscar/:id", async (req, res) => {
    try {
        const producto = await buscarPorId(req.params.id);
        if (producto.error) {
            return res.status(404).json({ error: producto.error });
        }
        res.status(200).json(producto);
    } catch (error) {
        console.error("Error al buscar producto:", error);
        res.status(500).json({ error: "Error al buscar producto" });
    }
});

// Ruta para buscar productos por nombre
rutas.get("/buscarProducto", async (req, res) => {
    try {
        const producto = req.query.producto || ""; // Obtiene el parámetro 'producto'
        if (!producto.trim()) { // Verifica si está vacío o solo contiene espacios
            console.warn("El parámetro 'producto' está vacío en la consulta.");
            return res.status(400).json({ error: "El parámetro 'producto' es obligatorio." });
        }

        console.log("Consulta recibida para buscarProducto:", producto);
        const productos = await buscarPorProducto(producto);

        if (productos.length === 0) {
            console.log("No se encontraron productos para el término:", producto);
            return res.status(404).json({ error: "No se encontraron productos con ese término." });
        }

        console.log("Productos encontrados:", productos.length);
        res.status(200).json(productos);
    } catch (error) {
        console.error("Error al buscar productos:", error);
        res.status(500).json({ error: "Error al buscar productos" });
    }
});

// Ruta para crear un nuevo producto
rutas.post("/nuevo", async (req, res) => {
    try {
        const resultado = await nuevoProducto(req.body);
        if (resultado.error) {
            return res.status(400).json({ error: resultado.error });
        }
        res.status(201).json({ success: "Producto creado exitosamente" });
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(500).json({ error: "Error al crear producto" });
    }
});

// Ruta para borrar un producto por ID
rutas.delete("/borrar/:id", async (req, res) => {
    try {
        const resultado = await borrarProducto(req.params.id);
        if (resultado.error) {
            return res.status(404).json({ error: resultado.error });
        }
        res.status(200).json({ success: "Producto eliminado correctamente" });
    } catch (error) {
        console.error("Error al borrar producto:", error);
        res.status(500).json({ error: "Error al borrar producto" });
    }
});

// Ruta para modificar un producto por ID
rutas.put("/modificar/:id", async (req, res) => {
    try {
        const resultado = await modificarProducto(req.params.id, req.body);
        if (resultado.error) {
            return res.status(400).json({ error: resultado.error });
        }
        res.status(200).json({ success: "Producto modificado exitosamente" });
    } catch (error) {
        console.error("Error al modificar producto:", error);
        res.status(500).json({ error: "Error al modificar producto" });
    }
});

module.exports = rutas;
