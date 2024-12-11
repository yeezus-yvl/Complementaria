"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ModificarUsuario({ params }) {
    const router = useRouter();
    const { id } = params;
    const [usuario, setUsuario] = useState({ nombre: "", password: "", usuario: "" });

    useEffect(() => {
        axios
            .get(`http://localhost:3000/usuarios/mostrar/${id}`)
            .then((response) => setUsuario(response.data))
            .catch((error) => console.error("Error al obtener usuario:", error));
    }, [id]);

    const modificarUsuario = async (e) => {
        e.preventDefault();
        const url = `http://localhost:3000/usuarios/modificar/${id}`;

        try {
            await axios.put(url, usuario);
            router.push("/usuarios/mostrar");
        } catch (error) {
            console.error("Error al modificar el usuario:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="m-0 row justify-content-center">
            <form onSubmit={modificarUsuario} className="col-6 mt-5">
                <div className="card shadow-lg p-4 rounded-4" style={{ backgroundColor: "#f5e3e3" }}>
                    <div className="card-header text-center" style={{ backgroundColor: "#8B0000", color: "#fff" }}>
                        <h1>Modificar el usuario</h1>
                    </div>
                    <div className="card-body">
                        <div className="mb-3">
                            <label htmlFor="nombre" className="form-label" style={{ color: "#B22222" }}>
                                Nombre
                            </label>
                            <input
                                className="form-control rounded-3"
                                id="nombre"
                                required
                                type="text"
                                value={usuario.nombre}
                                onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
                                style={{ borderColor: "#8B0000" }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label" style={{ color: "#B22222" }}>
                                Contraseña
                            </label>
                            <input
                                className="form-control rounded-3"
                                id="password"
                                required
                                type="password"
                                value={usuario.password}
                                onChange={(e) => setUsuario({ ...usuario, password: e.target.value })}
                                style={{ borderColor: "#8B0000" }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="usuario" className="form-label" style={{ color: "#B22222" }}>
                                Usuario
                            </label>
                            <input
                                className="form-control rounded-3"
                                id="usuario"
                                required
                                type="text"
                                value={usuario.usuario}
                                onChange={(e) => setUsuario({ ...usuario, usuario: e.target.value })}
                                style={{ borderColor: "#8B0000" }}
                            />
                        </div>
                    </div>
                    <div className="card-footer">
                        <center>
                            <button
                                className="btn w-100 rounded-3"
                                type="submit"
                                style={{ backgroundColor: "#8B0000", color: "#fff" }}
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
