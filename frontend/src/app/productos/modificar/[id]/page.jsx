"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from "axios";

export default function ModificarProducto({ params }) {
    const router = useRouter();
    const { id } = params;
    const [producto, setProducto] = useState({ nombre: '', precio: '', stock: '' });
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:3000/productos/mostrar/${id}`)
            .then(response => {
                console.log(response.data);
                if (response.data) {
                    setProducto(response.data); // Cargar datos del producto
                }
                setCargando(false);
            })
            .catch(error => {
                console.error("Error al obtener producto:", error);
                setCargando(false);
            });
    }, [id]);

    const modificarProducto = async (e) => {
        e.preventDefault();
        const url = `http://localhost:3000/productos/modificar/${id}`;
        
        try {
            await axios.put(url, producto);
            router.push("/productos/mostrar");
        } catch (error) {
            console.error('Error al modificar el producto:', error.response ? error.response.data : error.message);
        }
    };

    if (cargando) {
        return <div>Cargando...</div>; // Muestra un mensaje de carga mientras se obtienen los datos
    }

    return (
        <div className="m-0 row justify-content-center">
            <form onSubmit={modificarProducto} className="col-md-6 col-12 mt-5">
                <div className="card shadow-lg rounded-4" style={{ backgroundColor: "#F2E3E3" }}>
                    <div className="card-header text-center" style={{ backgroundColor: "#8B0000", color: "white" }}>
                        <h1>Modificar Producto</h1>
                    </div>
                    <div className="card-body">
                        <div className="mb-3">
                            <label htmlFor="nombre" className="form-label" style={{ color: "#8B0000" }}>Producto</label>
                            <input 
                                className="form-control"
                                id="nombre"
                                required
                                type="text"
                                value={producto.nombre} // Asegura que el valor es el estado actual
                                onChange={(e) => setProducto({ ...producto, nombre: e.target.value })}
                                style={{
                                    borderColor: "#B22222",
                                    backgroundColor: "#FFF3F3",
                                    fontSize: "16px"
                                }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="precio" className="form-label" style={{ color: "#8B0000" }}>Precio</label>
                            <input 
                                className="form-control"
                                id="precio"
                                required
                                type="number"
                                step="0.01"
                                value={producto.precio} // Asegura que el valor es el estado actual
                                onChange={(e) => setProducto({ ...producto, precio: e.target.value })}
                                style={{
                                    borderColor: "#B22222",
                                    backgroundColor: "#FFF3F3",
                                    fontSize: "16px"
                                }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="stock" className="form-label" style={{ color: "#8B0000" }}>Stock</label>
                            <input 
                                className="form-control"
                                id="stock"
                                required
                                type="number"
                                value={producto.stock} // Asegura que el valor es el estado actual
                                onChange={(e) => setProducto({ ...producto, stock: e.target.value })}
                                style={{
                                    borderColor: "#B22222",
                                    backgroundColor: "#FFF3F3",
                                    fontSize: "16px"
                                }}
                            />
                        </div>
                    </div>
                    <div className="card-footer">
                        <center>
                            <button 
                                className="btn btn-primary col-12"
                                type="submit"
                                style={{
                                    backgroundColor: "#B22222",
                                    borderColor: "#B22222",
                                    color: "white",
                                    fontSize: "18px"
                                }}
                            >
                                Guardar Cambios
                            </button>
                        </center>
                    </div>
                </div>
            </form>
        </div>
    );
}
