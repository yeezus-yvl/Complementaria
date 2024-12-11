"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

export default function NavBar() {
    const [usuarios, setUsuarios] = useState([]);
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [sugerencias, setSugerencias] = useState([]);
    const [tipoBusqueda, setTipoBusqueda] = useState("");
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (pathname.includes("/productos/mostrar")) {
            setTipoBusqueda("productos");
        } else if (pathname.includes("/usuarios/mostrar")) {
            setTipoBusqueda("usuarios");
        } else {
            setTipoBusqueda("");
        }
    }, [pathname]);

    useEffect(() => {
        async function fetchData() {
            try {
                if (tipoBusqueda === "usuarios") {
                    const response = await axios.get("http://localhost:3000/usuarios/mostrar");
                    setUsuarios(response.data);
                } else if (tipoBusqueda === "productos") {
                    const response = await axios.get("http://localhost:3000/productos/mostrar");
                    setProductos(response.data);
                }
            } catch (error) {
                console.error(`Error al cargar ${tipoBusqueda}:`, error);
            }
        }
        if (tipoBusqueda) {
            fetchData();
        }
    }, [tipoBusqueda]);

    const filtrarSugerencias = async (query) => {
        if (tipoBusqueda === "usuarios") {
            setSugerencias(
                usuarios.filter((usuario) =>
                    usuario.nombre.toLowerCase().includes(query.toLowerCase())
                )
            );
        } else if (tipoBusqueda === "productos") {
            try {
                const response = await axios.get(
                    `http://localhost:3000/productos/buscarProducto?producto=${query}`
                );
                setSugerencias(response.data);
            } catch (error) {
                console.error("Error al buscar productos:", error);
                setSugerencias([]);
            }
        }
    };

    const handleBusqueda = (e) => {
        const query = e.target.value;
        setBusqueda(query);
        if (query.trim() !== "") {
            filtrarSugerencias(query);
        } else {
            setSugerencias([]);
        }
    };

    const handleSeleccionar = (item) => {
        setBusqueda(tipoBusqueda === "usuarios" ? item.nombre : item.nombre); // Corregido: ambos deben ser item.nombre
        setSugerencias([]);
    };

    const handleBuscarSubmit = (e) => {
        e.preventDefault();
        if (tipoBusqueda === "usuarios") {
            router.push(`/usuarios/mostrar?nombre=${busqueda}`);
        } else if (tipoBusqueda === "productos") {
            router.push(`/productos/mostrar?producto=${busqueda}`);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#8B0000" }}>
            <div className="container-fluid">
                <Link className="navbar-brand" href="#" style={{ color: "#fff" }}>
                    Navbar
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" href="/" style={{ color: "#fff" }}>
                                Inicio
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href="/blog" style={{ color: "#fff" }}>
                                Blog
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href="/usuarios/mostrar" style={{ color: "#fff" }}>
                                Usuarios
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href="/productos/mostrar" style={{ color: "#fff" }}>
                                Productos
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href="/ventas/mostrar" style={{ color: "#fff" }}>
                                Ventas
                            </Link>
                        </li>
                    </ul>
                    <form className="d-flex position-relative" role="search" onSubmit={handleBuscarSubmit}>
                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder={`Buscar ${tipoBusqueda}`}
                            value={busqueda}
                            onChange={handleBusqueda}
                            style={{
                                borderColor: "#B22222", // Rojo vino
                                borderWidth: "2px",
                                padding: "10px",
                                fontSize: "16px",
                            }}
                        />
                        <button className="btn btn-outline-light" type="submit" style={{ backgroundColor: "#B22222" }}>
                            Buscar
                        </button>
                        {busqueda && sugerencias.length > 0 && (
                            <ul
                                className="list-group mt-2 position-absolute"
                                style={{
                                    top: "100%",
                                    zIndex: 1050,
                                    backgroundColor: "white",
                                    width: "100%",
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                    borderColor: "#B22222",
                                }}
                            >
                                {sugerencias.map((item, index) => (
                                    <li
                                        key={index}
                                        className="list-group-item"
                                        onClick={() => handleSeleccionar(item)}
                                        style={{
                                            cursor: "pointer",
                                            color: "#8B0000", // Color rojo/vino
                                        }}
                                    >
                                        {tipoBusqueda === "usuarios" ? item.nombre : item.nombre}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </form>
                </div>
            </div>
        </nav>
    );
}
