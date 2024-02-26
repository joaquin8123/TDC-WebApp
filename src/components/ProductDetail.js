import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, Link, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProductDetail = () => {
  const { id } = useParams();
  const [role, setRole] = useState("USER");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: null,
    stock: null,
    active: null,
    preparationTime: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      const authenticated = localStorage.getItem("authenticated") === "true";

      if (!authenticated) {
        navigate("/");
      }
      try {
        const response = await fetch(`http://localhost:3002/product/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        });
        const { data } = await response.json();
        setFormData(data.product[0]);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    const token = localStorage.getItem("token");
    const { role } = jwtDecode(token);
    setRole(role);
    fetchData();
  }, []);

  const logOut = async () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("token");
    navigate("/");
  };

  const backOrders = async () => {
    navigate("/products");
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
          <h1 className="h2">Product</h1>
        </div>

        {/* Form Order */}
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card mb-4 mx-4">
                  <div className="card-body p-4">
                    <div className="input-group mb-3">
                      <span className="input-group-text">Nombre</span>
                      <input
                        className="form-control"
                        type="text"
                        name="name"
                        value={formData.name}
                        readOnly
                      />
                    </div>
                    <div className="input-group mb-4">
                      <span className="input-group-text">Descripcion</span>
                      <input
                        className="form-control"
                        type="text"
                        name="description"
                        value={formData.description}
                        readOnly
                      />
                    </div>
                    <div className="input-group mb-4">
                      <span className="input-group-text">Precio</span>
                      <input
                        className="form-control"
                        type="text"
                        name="price"
                        value={formData.price}
                        readOnly
                      />
                    </div>
                    <div className="input-group mb-4">
                      <span className="input-group-text">Stock</span>
                      <input
                        className="form-control"
                        type="text"
                        name="stock"
                        value={formData.stock}
                        readOnly
                      />
                    </div>
                    <div className="input-group mb-4">
                      <span className="input-group-text">Estado</span>
                      <input
                        className="form-control"
                        type="text"
                        name="active"
                        value={formData.active}
                        readOnly
                      />
                    </div>
                    <div className="input-group mb-4">
                      <span className="input-group-text">Tiempo de Preparacion</span>
                      <input
                        className="form-control"
                        type="text"
                        name="preparationTime"
                        value={formData.preparationTime}
                        readOnly
                      />
                    </div>
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

export default ProductDetail;
