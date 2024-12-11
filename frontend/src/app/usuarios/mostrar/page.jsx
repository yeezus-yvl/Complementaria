"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

export default function MostrarUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [mostrarBuscador, setMostrarBuscador] = useState(false); // El buscador está oculto por defecto
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get("http://localhost:3000/usuarios/mostrar");
                setUsuarios(response.data);
            } catch (error) {
                console.error("Error al cargar los usuarios:", error);
            }
        };

        fetchUsuarios();

        // Obtener el parámetro de búsqueda de la URL
        const nombreBuscado = searchParams.get("nombre");
        if (nombreBuscado) {
            setBusqueda(nombreBuscado);
        } else {
            setBusqueda("");  // Si no hay búsqueda en la URL, restablecer el campo
        }
    }, [searchParams]);

    const handleBusqueda = (e) => {
        setBusqueda(e.target.value);
    };

    const eliminarUsuario = async (id) => {
        if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            try {
                await axios.delete(`http://localhost:3000/usuarios/borrarUsuario/${id}`);
                setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
                alert("Usuario eliminado correctamente");
            } catch (error) {
                console.error("Error al eliminar usuario:", error);
                alert("Hubo un error al eliminar el usuario");
            }
        }
    };

    const handleEditar = (id) => {
        router.push(`/usuarios/modificar/${id}`);
    };

    // Filtrar usuarios según el término de búsqueda
    const usuariosFiltrados = usuarios.filter((usuario) =>
        usuario.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4" style={{ color: "#B22222", fontWeight: "bold" }}>Lista de Usuarios</h1>

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
                    placeholder="Buscar por nombre del usuario"
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
                                <th>Nombre</th>
                                <th>Usuario</th>
                                <th>Eliminar</th>
                                <th>Editar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuariosFiltrados.length === 1 ? (
                                <tr key={usuariosFiltrados[0].id}>
                                    <td>1</td>
                                    <td>{usuariosFiltrados[0].id}</td>
                                    <td>{usuariosFiltrados[0].nombre}</td>
                                    <td>{usuariosFiltrados[0].usuario}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm rounded-3"
                                            style={{
                                                backgroundColor: "#B22222", // Rojo vino
                                                color: "#fff",
                                                padding: "8px 12px",
                                            }}
                                            onClick={() => eliminarUsuario(usuariosFiltrados[0].id)}
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
                                            onClick={() => handleEditar(usuariosFiltrados[0].id)}
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ) : usuariosFiltrados.length === 0 && busqueda ? (
                                <tr>
                                    <td colSpan="6" style={{ color: "#7F8C8D" }}>No se encontraron usuarios con el nombre "{busqueda}"</td>
                                </tr>
                            ) : (
                                usuariosFiltrados.map((usuario, index) => (
                                    <tr key={usuario.id}>
                                        <td>{index + 1}</td>
                                        <td>{usuario.id}</td>
                                        <td>{usuario.nombre}</td>
                                        <td>{usuario.usuario}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm rounded-3"
                                                style={{
                                                    backgroundColor: "#B22222", // Rojo vino
                                                    color: "#fff",
                                                    padding: "8px 12px",
                                                }}
                                                onClick={() => eliminarUsuario(usuario.id)}
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
                                                onClick={() => handleEditar(usuario.id)}
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
