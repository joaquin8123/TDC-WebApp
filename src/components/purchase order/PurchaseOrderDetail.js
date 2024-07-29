import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Corrige la importación de jwtDecode
import Navbar from "../shared/Navbar";

const PurchaseOrderDetail = () => {
  const { id } = useParams();
  const [role, setRole] = useState("USER");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nameProvider: "",
    date: "",
    status: "PENDING",
    amount: null,
    name: "",
    products: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const authenticated = localStorage.getItem("authenticated") === "true";

      if (!authenticated) {
        navigate("/");
      }
      try {
        const response = await fetch(
          `http://localhost:3002/purchase-order/id/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        const { data } = await response.json();
        setFormData(data.purchaseOrder[0]);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    const token = localStorage.getItem("token");
    const { role } = jwtDecode(token);
    setRole(role);
    fetchData();
  }, []);

  const backOrders = async () => {
    navigate("/purchase-order");
  };

  return (
    <div className="d-flex">
      {/* Barra lateral */}
      <Navbar role={role} />

      {/* Contenido principal */}
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Purchase Order</h1>
        </div>

        {/* Form Order */}
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-12">
                <div className="card mb-4 mx-4">
                  <div className="card-body p-4">
                    <h2>{formData.name}</h2>
                    <div className="input-group mb-3">
                      <span className="input-group-text">Proveedor</span>
                      <input
                        className="form-control"
                        type="text"
                        name="client"
                        value={formData.nameProvider}
                        readOnly
                      />
                    </div>
                    <div className="input-group mb-3">
                      <span className="input-group-text">Fecha</span>
                      <input
                        className="form-control"
                        type="text"
                        name="date"
                        readOnly
                        value={formData.date}
                      />
                    </div>
                    <div className="input-group mb-4">
                      <span className="input-group-text">Importe</span>
                      <input
                        className="form-control"
                        type="text"
                        name="amount"
                        value={formData.amount}
                        readOnly
                      />
                    </div>
                    <div className="input-group mb-4">
                      <span className="input-group-text">Estado</span>
                      <input
                        className="form-control"
                        type="text"
                        name="status"
                        value={formData.status}
                        readOnly
                      />
                    </div>

                    {/* Tabla de Productos */}
                    <h4>Productos</h4>
                    <table className="table table-striped table-bordered">
                      <thead className="thead-dark">
                        <tr>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Cantidad</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.products.map((product, index) => (
                          <tr key={index}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <button
                      className="btn btn-primary px-4"
                      type="button"
                      style={{ marginRight: "5px" }}
                      onClick={backOrders}
                    >
                      Volver
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PurchaseOrderDetail;
