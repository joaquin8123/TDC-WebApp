import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

const NewProduct = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("USER");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: null,
    stock: null,
    image: "",
    preparation_time: null,
  });

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
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const logOut = async () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("token");
    navigate("/");
  };

  const createProduct = async ({ product }) => {
    const { price, stock, preparation_time, name, description } = product;
    if (name.length < 4 || description.length < 4) {
      toast.error(
        "El nombre y la descripcion deben tener al menos 6 caracteres"
      );
      return;
    }
    if (!price || !stock || !preparation_time) {
      toast.error(
        "Todos los campos son requeridos"
      );
      return;
    }

    const parseProduct = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      preparation_time: parseInt(preparation_time),
    };

    const paramsCreate = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(parseProduct),
    };
    let data;
    try {
      const response = await fetch(
        "http://localhost:3002/product/",
        paramsCreate
      );

      if (response.ok) {
        data = await response.json();
        if (data.code === 201) {
          toast.success("Producto creado exitosamente");
          setTimeout(() => {
            navigate("/products");
          }, 2000);
        }
      } else {
        toast.error("El producto ya existe");
      }
    } catch (error) {
      toast.error("Ocurrio un error al intentar crear el producto");
    }
  };

  const backProducts = async () => {
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
          <h1 className="h2">Agregar Producto</h1>
        </div>

        {/* New product */}
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
                        required
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-group mb-3">
                      <span className="input-group-text">Descripcion</span>
                      <input
                        className="form-control"
                        type="text"
                        name="description"
                        required
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-group mb-4">
                      <span className="input-group-text">Precio</span>
                      <input
                        className="form-control"
                        type="text"
                        name="price"
                        value={formData.price}
                        required
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-group mb-4">
                      <span className="input-group-text">Stock</span>
                      <input
                        className="form-control"
                        type="text"
                        name="stock"
                        value={formData.stock}
                        required
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-group mb-4">
                      <span className="input-group-text">
                        Tiempo de Preparacion
                      </span>
                      <input
                        className="form-control"
                        type="text"
                        name="preparation_time"
                        value={formData.preparation_time}
                        required
                        onChange={handleChange}
                      />
                    </div>

                    <button
                      className="btn btn-primary px-4"
                      type="button"
                      style={{ marginRight: "5px" }}
                      onClick={backProducts}
                    >
                      Volver
                    </button>
                    <button
                      className="btn btn-block btn-success"
                      type="button"
                      onClick={async () =>
                        await createProduct({ product: formData })
                      }
                    >
                      Crear Producto
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

export default NewProduct;
