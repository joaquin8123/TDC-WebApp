import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import SalesByMonth from "./SalesByMonth";
import SalesByProduct from "./SalesByProduct";
import "react-toastify/dist/ReactToastify.css";
import AmountMonthly from "./AmountMonthly";
import { jwtDecode } from "jwt-decode";
import Navbar from "../shared/Navbar";
import AuditReport from "./AuditReport";

const Analytics = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("USER");

  useEffect(() => {
    const fetchData = async () => {
      const authenticated = localStorage.getItem("authenticated") === "true";

      if (!authenticated) {
        navigate("/");
      }
    };
    const token = localStorage.getItem("token");
    const { role } = jwtDecode(token);
    setRole(role);
    fetchData();
  }, []);

  return (
    <div className="d-flex">
      {/* Barra lateral */}
      <Navbar role={role} />

      {/* Contenido principal */}
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <h1>Estadisticas</h1>

        <div className="row">
          <div className="col-md-6">
            <h2>Ventas por Mes</h2>
            <SalesByMonth />
          </div>
          <div className="col-md-6">
            <h2>Ventas por Producto</h2>
            <SalesByProduct />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <AmountMonthly />
          </div>
          <div className="col-md-6">
            <AuditReport />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
