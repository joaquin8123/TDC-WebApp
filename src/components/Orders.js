import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import populateTable from "../helpers/populateTable";
import { useNavigate, Link } from "react-router-dom";
import { Pagination } from "react-bootstrap";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const authenticated = localStorage.getItem("authenticated") === "true";

      if (!authenticated) {
        navigate("/");
      }

      const itemsPerPage = 10;
      let offset = (currentPage - 1) * itemsPerPage;
      if (currentPage === 0) offset = 0;
      try {
        const response = await fetch(`http://localhost:3002/order/${offset}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        });
        const { data } = await response.json();
        setOrders(data.orders);
        const totalItems = data.orders[0].totalItems;
        const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage);
        setTotalPages(calculatedTotalPages);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    fetchData();
    //const intervalId = setInterval(fetchData, 3000);
    //return () => clearInterval(intervalId);
  }, [currentPage]);

  const logOut = async () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
              <a className="nav-link" href="#">
                <Link to={`/orders`}>Ordenes</Link>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <Link to={`/products`}>Productos</Link>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <Link to={`/analytics`}>Analytics</Link>
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

        <Pagination>
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </main>
    </div>
  );
};

export default Order;
