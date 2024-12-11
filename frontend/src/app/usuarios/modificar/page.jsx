"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function BuscarUsuario() {
    const router = useRouter();
    const [id, setId] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (id) {
            // Redirigir al formulario de edición del usuario con el ID
            router.push(`/usuarios/modificar/${id}`);
        }
    };

    return (
        <div className="m-0 row justify-content-center">
            <form onSubmit={handleSubmit} className="col-6 mt-5">
                <div className="card shadow-lg p-4 rounded-4" style={{ backgroundColor: "#f5e3e3" }}>
                    <div className="card-header text-center" style={{ backgroundColor: "#8B0000", color: "#fff" }}>
                        <h1>Buscar el usuario para modificar</h1>
                    </div>
                    <div className="card-body">
                        <div className="mb-3">
                            <label htmlFor="id" className="form-label" style={{ color: "#B22222" }}>
                                ID del Usuario
                            </label>
                            <input
                                className="form-control rounded-3"
                                id="id"
                                required
                                autoFocus
                                type="text"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
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
                                Buscar el usuario
                            </button>
                        </center>
                    </div>
                </div>
            </form>
        </div>
    );
}
