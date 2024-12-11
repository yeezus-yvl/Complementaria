"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

export default function MostrarProductos() {
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [mostrarBuscador, setMostrarBuscador] = useState(false); // El buscador está oculto por defecto
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get("http://localhost:3000/productos/mostrar");
                setProductos(response.data);
            } catch (error) {
                console.error("Error al cargar los productos:", error);
            }
        };

        fetchProductos();

        // Obtener el parámetro de búsqueda de la URL
        const productoBuscado = searchParams.get("producto");
        if (productoBuscado) {
            setBusqueda(productoBuscado);
        } else {
            setBusqueda("");  // Si no hay búsqueda en la URL, restablecer el campo
        }
    }, [searchParams]);

    const handleBusqueda = (e) => {
        setBusqueda(e.target.value);
    };

    const eliminarProducto = async (id) => {
        if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
            try {
                await axios.delete(`http://localhost:3000/productos/borrarProducto/${id}`);
                setProductos(productos.filter((producto) => producto.id !== id));
                alert("Producto eliminado correctamente");
            } catch (error) {
                console.error("Error al eliminar producto:", error);
                alert("Hubo un error al eliminar el producto");
            }
        }
    };

    const handleEditar = (id) => {
        router.push(`/productos/modificar/${id}`);
    };

    // Filtrar productos según el término de búsqueda
    const productosFiltrados = productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4" style={{ color: "#B22222", fontWeight: "bold" }}>Lista de Productos</h1>

            {/* Botón para ocultar/mostrar el buscador */}
            <button
                className="btn btn-outline-danger mb-4"
                onClick={() => setMostrarBuscador(!mostrarBuscador)}
                style={{
                    borderRadius: "5px",
                    padding: "8px 20px",
                    fontSize: "14px",
                    border: "2px solid #B22222",
                    color: "#B22222"
                }}
            >
                {mostrarBuscador ? "Ocultar Buscador" : "Mostrar Buscador"}
            </button>

            {/* Campo de búsqueda */}
            {mostrarBuscador && (
                <input
                    className="form-control mb-4"
                    type="text"
                    placeholder="Buscar por nombre del producto"
                    value={busqueda}
                    onChange={handleBusqueda}
                    style={{
                        borderColor: "#B22222", // Rojo vino
                        backgroundColor: "#F8D7DA", // Fondo suave
                        color: "#B22222", // Texto rojo
                        width: "100%",
                        padding: "12px",
                        fontSize: "16px",
                        borderRadius: "5px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                />
            )}

            <div className="card shadow-lg p-4 rounded-4" style={{ backgroundColor: "#F8D7DA" }}>
                <div className="card-body">
                    <table className="table table-borderless text-center text-dark">
                        <thead style={{ backgroundColor: "#B22222", color: "#fff" }}>
                            <tr>
                                <th>Num</th>
                                <th>ID</th>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Eliminar</th>
                                <th>Editar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productosFiltrados.length === 1 ? (
                                <tr key={productosFiltrados[0].id}>
                                    <td>1</td>
                                    <td>{productosFiltrados[0].id}</td>
                                    <td>{productosFiltrados[0].nombre}</td>
                                    <td>{productosFiltrados[0].precio}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm rounded-3"
                                            style={{
                                                backgroundColor: "#B22222", // Rojo vino
                                                color: "#fff",
                                                padding: "8px 12px",
                                            }}
                                            onClick={() => eliminarProducto(productosFiltrados[0].id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm rounded-3"
                                            style={{
                                                backgroundColor: "#DC3545", // Rojo más intenso
                                                color: "#fff",
                                                padding: "8px 12px",
                                            }}
                                            onClick={() => handleEditar(productosFiltrados[0].id)}
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ) : productosFiltrados.length === 0 && busqueda ? (
                                <tr>
                                    <td colSpan="6" style={{ color: "#7F8C8D" }}>No se encontraron productos con el nombre "{busqueda}"</td>
                                </tr>
                            ) : (
                                productosFiltrados.map((producto, index) => (
                                    <tr key={producto.id}>
                                        <td>{index + 1}</td>
                                        <td>{producto.id}</td>
                                        <td>{producto.nombre}</td>
                                        <td>{producto.precio}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm rounded-3"
                                                style={{
                                                    backgroundColor: "#B22222", // Rojo vino
                                                    color: "#fff",
                                                    padding: "8px 12px",
                                                }}
                                                onClick={() => eliminarProducto(producto.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm rounded-3"
                                                style={{
                                                    backgroundColor: "#DC3545", // Rojo más intenso
                                                    color: "#fff",
                                                    padding: "8px 12px",
                                                }}
                                                onClick={() => handleEditar(producto.id)}
                                            >
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
