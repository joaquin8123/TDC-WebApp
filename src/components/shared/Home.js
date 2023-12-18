import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import populateTable from "../helpers/populateTable";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {      
      const authenticated = localStorage.getItem("authenticated") === "true";
      
      if(!authenticated){
        navigate("/");
      }

      try {
        const response = await fetch("http://localhost:3002/order/");
        const { data } = await response.json();
        setOrders(data.orders);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    fetchData();
  }, []);

  const logOut = async () => {
    localStorage.removeItem("authenticated");
    navigate("/");
  };

  return (
    <div className="d-flex">
      {/* Barra lateral */}
      <nav
        id="sidebar"
        className="col-md-3 col-lg-2 d-md-block bg-light sidebar vh-100" // Añade la clase vh-100
      >
        <div className="position-sticky d-flex flex-column">
          <ul className="nav flex-column mb-auto">
            <li className="nav-item">
              <a className="nav-link active" href="#">
                Orders
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Products
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Analytics
              </a>
            </li>
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
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Orders</h1>
        </div>

        {/* Tabla de pedidos */}
        {populateTable(orders)}
      </main>
    </div>
  );
};

export default Home;
