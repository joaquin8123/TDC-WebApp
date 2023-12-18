import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, Link } from "react-router-dom";
import SalesByMonth from "./SalesByMonth";
import SalesByProduct from "./SalesByProduct";
import "react-toastify/dist/ReactToastify.css";
import AmountMonthly from "./AmountMonthly";
import { jwtDecode } from "jwt-decode";

const Analytics = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("USER");

  const logOut = async () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("token");
    navigate("/");
  };

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
      <nav
        id="sidebar"
        className="col-md-3 col-lg-2 d-md-block bg-light sidebar vh-100"
      >
        <div className="position-sticky d-flex flex-column">
          <ul className="nav flex-column mb-auto">
            <li className="nav-item">
              <a className="nav-link" href="#">
                <Link to={`/orders`}>Ordenes</Link>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <Link to={`/products`}>Productos</Link>
              </a>
            </li>
            {role === "ADMIN" && (
              <li className="nav-item">
                <a className="nav-link" href="#">
                  <Link to={`/analytics`}>Estadisticas</Link>
                </a>
              </li>
            )}
          </ul>
          <div className="mt-auto">
            <ul className="nav flex-column">
              <li className="nav-item">
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={logOut}
                >
                  Log Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

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
        <div>
          <div className="col-md-12">
            <AmountMonthly />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
