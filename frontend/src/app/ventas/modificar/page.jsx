"use client";

import { useRouter } from 'next/navigation';

export default function BuscarVenta() {
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        const id = document.getElementById("id").value;
        
        if (id) {
            router.push(`/ventas/modificar/${id}`);
        }
    };

    return (
        <div className="m-0 row justify-content-center">
            <form onSubmit={handleSubmit} className="col-6 mt-5">
                <div className="card" style={{ border: "1px solid #800000" }}>
                    <div className="card-header" style={{ backgroundColor: "#800000", color: "white" }}>
                        <center><h1>Buscar Venta para Modificar</h1></center>
                    </div>
                    <div className="card-body">
                        <div className="mb-3">
                            <label htmlFor="id" className="form-label" style={{ color: "#8B0000" }}>ID de la Venta</label>
                            <input className="form-control" id="id" required autoFocus type="text" />
                        </div>
                    </div>
                    <div className="card-footer" style={{ backgroundColor: "#f8f9fa" }}>
                        <center>
                            <button className="btn" style={{ backgroundColor: "#B22222", color: "white" }} type="submit">Buscar Venta</button>
                        </center>
                    </div>
                </div>
            </form>
        </div>
    );
}
