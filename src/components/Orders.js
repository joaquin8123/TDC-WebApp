import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Pagination } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import populateTable from "../helpers/populateTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [role, setRole] = useState("USER");
  const [filter, setFilter] = useState(null);
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

    const token = localStorage.getItem("token");
    const { role } = jwtDecode(token);
    setRole(role);
    fetchData();
  }, [currentPage, filter]);

  const logOut = async () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterClick = (selectedFilter) => {
    if (filter === selectedFilter) {
      setFilter(null);
    } else {
      setFilter(selectedFilter);
    }
  };

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
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Orders</h1>
          {/* Filtros */}
          <div className="d-flex mt-2 ml-2">
            {["pending", "confirmed", "cancelled", "processing"].map((f) => (
              <button
                key={f}
                type="button"
                className={`btn btn-${
                  filter === f ? "primary" : "secondary"
                } rounded-pill mr-2`}
                onClick={() => handleFilterClick(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
            <FontAwesomeIcon
              icon={faFilter}
              className="ml-2"
              style={{ height: "38px" }}
            />
          </div>
        </div>

        {/* Tabla de pedidos */}
        {populateTable(orders, filter)}

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
