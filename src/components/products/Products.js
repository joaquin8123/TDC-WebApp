import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import Navbar from "../shared/Navbar";
const KEYS_WRITE_ACCESS = ["WRITE_PRODUCTS", "ACCESS_ADMIN"];
const KEYS_READ_ACCESS = ["READ_PRODUCTS", "ACCESS_ADMIN"];

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [role, setRole] = useState("USER");
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const authenticated = localStorage.getItem("authenticated") === "true";

      if (!authenticated) {
        navigate("/");
      }

      try {
        const response = await fetch("http://localhost:3002/product/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        });
        const { data } = await response.json();
        setProducts(data.products);
        const client = await fetch(
          `http://localhost:3002/group/permissions/${localStorage.getItem(
            "clientId"
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        const { data: clientData } = await client.json();
        setPermissions(clientData.permissions);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    const token = localStorage.getItem("token");
    const { role } = jwtDecode(token);
    setRole(role);
    fetchData();
  }, []);

  const updateProduct = async (params) => {
    const { productId, active } = params;
    const paramsUpdate = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({ productId, active }),
    };

    try {
      const response = await fetch(
        "http://localhost:3002/product/",
        paramsUpdate
      );
      if (!response.ok) {
        toast.error("Ocurrio un error al intentar actualizar el producto");
      }

      await response.json();
      window.location.reload();
    } catch (error) {
      toast.error("Ocurrio un error al intentar actualizar el producto");
    }
  };

  const createProduct = async () => {
    navigate("/add-product");
  };

  const mapColors = {
    activo: "green",
    inactivo: "red",
  };

  return (
    <div className="d-flex">
      {/* Barra lateral */}
      <Navbar role={role} />

      {/* Contenido principal */}
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Productos</h1>
          <div className="d-flex mt-2 ml-2">
            {KEYS_WRITE_ACCESS.some((permission) =>
              permissions.includes(permission)
            ) && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => createProduct()}
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Agregar Producto
              </button>
            )}
          </div>
        </div>

        {/* Tabla de productos */}
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th></th>
              <th>Nombre</th>
              <th>Descripcion</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Tiempo de Preparacion</th>
              <th>Estado</th>
            </tr>
          </thead>
          {KEYS_READ_ACCESS.some((permission) =>
            permissions.includes(permission)
          ) && (
            <tbody>
              {products.map((item) => (
                <tr key={item.productId}>
                  <td>
                    <Link to={`/product/${item.productId}`}>
                      <FontAwesomeIcon icon={faSearch} />
                    </Link>
                  </td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.price}</td>
                  <td>{item.stock}</td>
                  <td>{item.preparationTime}</td>
                  <td
                    style={{
                      color: mapColors[item.active],
                    }}
                  >
                    <strong>{item.active}</strong>
                  </td>
                  <td>
                    {item.active === "activo" && (
                      <button
                        style={{ marginRight: "5px" }}
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          updateProduct({
                            productId: item.productId,
                            active: false,
                          })
                        }
                      >
                        Desactivar
                      </button>
                    )}

                    {item.active === "inactivo" && (
                      <button
                        className="btn btn-success btn-sm"
                        style={{ marginRight: "5px" }}
                        onClick={() =>
                          updateProduct({
                            productId: item.productId,
                            active: true,
                          })
                        }
                      >
                        Activar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </main>
    </div>
  );
};

export default Products;
