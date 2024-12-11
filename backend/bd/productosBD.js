const Producto = require("../clases/Producto");
const { productosBD } = require("./conexion");

// Validar datos del producto
function validarDatos(producto) {
    return producto.nombre && producto.stock != null && producto.precio != null;
}

// Mostrar productos, opcionalmente filtrados por búsqueda
async function mostrarProductos(search = "") {
    try {
        const productosSnapshot = await productosBD.get();
        let productosValidos = productosSnapshot.docs
            .map(doc => {
                const producto = new Producto({ id: doc.id, ...doc.data() });
                return validarDatos(producto.getProducto) ? producto.getProducto : null;
            })
            .filter(Boolean); // Filtrar valores nulos

        if (search) {
            const searchLower = search.toLowerCase();
            productosValidos = productosValidos.filter(producto =>
                producto.nombre.toLowerCase().includes(searchLower)
            );
        }

        return productosValidos;
    } catch (error) {
        console.error("Error al mostrar productos:", error);
        return [];
    }
}

// Obtener nombres de productos válidos
async function nombresProductos() {
    try {
        const productosSnapshot = await productosBD.get();
        return productosSnapshot.docs
            .map(doc => {
                const producto = new Producto({ id: doc.id, ...doc.data() });
                return validarDatos(producto.getProducto) ? producto.getProducto.nombre : null;
            })
            .filter(Boolean); // Filtrar valores nulos
    } catch (error) {
        console.error("Error al obtener nombres de productos:", error);
        return [];
    }
}

// Buscar producto por ID
async function buscarPorId(id) {
    try {
        const productoDoc = await productosBD.doc(id).get();
        if (!productoDoc.exists) {
            return { error: "Producto no encontrado" };
        }

        const producto = new Producto({ id: productoDoc.id, ...productoDoc.data() });
        return validarDatos(producto.getProducto) ? producto.getProducto : { error: "Datos del producto no válidos" };
    } catch (error) {
        console.error("Error al buscar producto por ID:", error);
        return { error: "Error al buscar producto" };
    }
}

// Buscar productos por nombre
async function buscarPorProducto(nombre) {
    try {
        const productosSnapshot = await productosBD.get();
        const nombreLower = nombre.toLowerCase();

        return productosSnapshot.docs
            .map(doc => {
                const producto = new Producto({ id: doc.id, ...doc.data() });
                return validarDatos(producto.getProducto) ? producto.getProducto : null;
            })
            .filter(producto => producto && producto.nombre.toLowerCase().includes(nombreLower));
    } catch (error) {
        console.error("Error al buscar productos:", error);
        return [];
    }
}

// Crear un nuevo producto
async function nuevoProducto(data) {
    try {
        const producto = new Producto(data);
        if (validarDatos(producto.getProducto)) {
            await productosBD.add(producto.getProducto);
            return { success: "Producto creado correctamente" };
        } else {
            return { error: "Datos del producto no válidos" };
        }
    } catch (error) {
        console.error("Error al crear producto:", error);
        return { error: "Error al crear producto" };
    }
}

// Borrar producto por ID
async function borrarProducto(id) {
    try {
        const producto = await buscarPorId(id);
        if (producto.error) {
            return { error: "Producto no encontrado" };
        }

        await productosBD.doc(id).delete();
        return { success: "Producto eliminado correctamente" };
    } catch (error) {
        console.error("Error al borrar producto:", error);
        return { error: "Error al borrar producto" };
    }
}

// Modificar producto por ID
async function modificarProducto(id, nuevosDatos) {
    try {
        const productoExistente = await buscarPorId(id);
        if (productoExistente.error) {
            return { error: "Producto no encontrado" };
        }

        const productoActualizado = { ...productoExistente, ...nuevosDatos };
        if (validarDatos(productoActualizado)) {
            await productosBD.doc(id).update(productoActualizado);
            return { success: "Producto modificado correctamente" };
        } else {
            return { error: "Datos del producto no válidos" };
        }
    } catch (error) {
        console.error("Error al modificar producto:", error);
        return { error: "Error al modificar producto" };
    }
}

module.exports = {
    mostrarProductos,
    nombresProductos,
    buscarPorId,
    buscarPorProducto,
    nuevoProducto,
    borrarProducto,
    modificarProducto
};
