import BorrarVenta from "@/components/borrarVent";
import Link from "next/link";
import axios from "axios";

async function getVentas() {
    const url = "http://localhost:3000/ventas/mostrar";
    const ventas = await axios.get(url);
    return ventas.data;
}

async function getUsuario() {
    const urlu = "http://localhost:3000/usuarios/mostrar";
    const usuarios = await axios.get(urlu);
    return usuarios.data;
}

async function getProducto() {
    const urlp = "http://localhost:3000/productos/mostrar";
    const productos = await axios.get(urlp);
    return productos.data;
}

export default async function Ventas() {
    const ventas = await getVentas();
    const usuarios = await getUsuario();
    const productos = await getProducto();
    const ventasVendidas = ventas.filter(venta => venta.estatus === "vendido");

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4 text-danger">Ventas Registradas</h1>
            
            {/* Tabla de ventas con colores rojos y vinos */}
            <table className="table table-striped table-bordered table-hover">
                <thead className="thead-dark" style={{ backgroundColor: "#800000", color: "white" }}>
                    <tr>
                        <th>No.</th>
                        <th>Fecha</th>
                        <th>Producto</th>
                        <th>Usuario</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Estatus</th>
                        <th>Borrar</th>
                        <th>Modificar</th>
                    </tr>
                </thead>
                <tbody style={{ backgroundColor: "#f8f9fa" }}>
                    {
                        ventasVendidas.map((venta, index) => {
                            const usuario = usuarios.find(u => u.id === venta.idUsu1);
                            const nombreUsuario = usuario ? usuario.nombre : "Desconocido";

                            const producto = productos.find(p => p.id === venta.idProd1);
                            const nombreProducto = producto ? producto.nombre : "Desconocido";
                            const precioProducto = producto ? producto.precio : "Desconocido";

                            return (
                                <tr key={venta.id} style={{ cursor: "pointer" }}>
                                    <td>{index + 1}</td>
                                    <td>{new Date(venta.fechaHora).toLocaleString()}</td>
                                    <td>{nombreProducto}</td>
                                    <td>{nombreUsuario}</td>
                                    <td>{"$" + precioProducto}</td>
                                    <td>{venta.cantidad}</td>
                                    <td>{venta.estatus}</td>
                                    <td><BorrarVenta id={venta.id} /></td>
                                    <td>
                                        <Link href={`/ventas/modificar/${venta.id}`} className="btn" style={{ backgroundColor: "#8B0000", color: "white" }}>
                                            Modificar
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>

            {/* Botón para agregar nueva venta */}
            <div className="d-flex justify-content-center mt-4">
                <Link href="/ventas/nuevo" className="btn" style={{ backgroundColor: "#B22222", color: "white" }}>
                    Nueva Venta
                </Link>
            </div>
        </div>
    );
}
